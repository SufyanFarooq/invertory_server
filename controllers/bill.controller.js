const { Bill } = require("../schemas/bill.schema");
const ExcelJS = require("exceljs");
const easyinvoice = require("easyinvoice");
exports.createBill = async (req, res) => {
    const bill = new Bill({
        ...req.body
    });

    try {
        await bill.save();
        res.status(201).json({ status: true, message: "Bill Created successfully", bill });
    } catch (e) {
        res.status(500).json({ status: false, message: err });
    }
};

exports.readBills = async (req, res) => {
    // Extract page and limit from query parameters
    let { page, limit } = req.query;

    // Default values if not provided
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    try {
        // Calculate the total number of bills
        const total = await Bill.countDocuments({});

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Fetch a page of bills
        const bills = await Bill.find()
            .populate('customer')
            .populate('department')
            .populate('item')
            .limit(limit).skip(startIndex);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Determine if there's a next or previous page
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            status: true,
            message: "Bills found successfully",
            params: {
                total,
                limit,
                page,
                totalPages,
                next: nextPage,
                previous: previousPage,
            },
            bills,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
};

exports.readBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate('customer')
            .populate('department')
            .populate('item');
        if (!bill) res.status(404).json({ status: false, message: "Bill not found" });
        else res.status(200).json({ status: true, message: "Bill find successfully", bill });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

exports.updateBill = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['billNumber', 'customer', 'department', 'products', 'item', 'totalSaleTax', 'totalIncomeTax', 'total'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const bill = await Bill.findOne({ _id: req.params.id });

        if (!bill) {
            return res.status(404).send();
        }

        updates.forEach((update) => bill[update] = req.body[update]);
        await bill.save();
        res.send(bill);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);

        if (!bill) res.status(404).json({ status: false, message: "Bill not found" });
        else res.status(200).json({ status: true, message: "Bill deleted successfully", bill });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }

};

exports.getBillAsExcel = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('customer').populate('department').populate('item').populate('products');

        if (!bill) {
            return res.status(404).send();
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Invoice');

        // Set the properties of the worksheet
        worksheet.properties.defaultRowHeight = 25;

        // Create a reusable style
        const style = {
            font: { name: 'Arial', size: 10 },
            alignment: { vertical: 'middle', horizontal: 'center' }
        };

        // Add headers for the "INVOICE FORMATE" section
        worksheet.columns = [
            { header: 'Product ID', key: 'productId', width: 10, style },
            { header: 'Product Name', key: 'productName', width: 30, style },
            { header: 'QTY', key: 'quantity', width: 10, style },
            { header: 'Unit Price', key: 'unitPrice', width: 10, style },
            { header: 'Amount', key: 'amount', width: 10, style },
            { header: 'GST 18%', key: 'gst', width: 10, style },
            { header: 'Sales Tax Amount', key: 'salesTaxAmount', width: 15, style },
            { header: 'Grand Total', key: 'grandTotal', width: 15, style }
        ];

        // Add data for each product in the "INVOICE FORMATE" section
        let totalGST = 0;
        let totalAmount = 0;
        bill.products.forEach((product, index) => {
            const amount = product.price * product.quantity;
            const gst = amount * (product.saleTaxPercentage / 100);
            const total = amount + gst;

            worksheet.addRow({
                productId: index + 1,
                productName: product.name,
                quantity: product.quantity,
                unitPrice: product.price,
                amount: amount,
                gst: gst,
                salesTaxAmount: gst,
                grandTotal: total
            }, 'n');

            totalGST += gst;
            totalAmount += total;
        });

        // Add total row in the "INVOICE FORMATE" section
        const totalRow = worksheet.addRow({
            productName: 'Total:',
            amount: totalAmount - totalGST,
            salesTaxAmount: totalGST,
            grandTotal: totalAmount
        });

        // Apply bold style to the total row
        totalRow.font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.xlsx');
        res.send(buffer);
    } catch (e) {
        res.status(500).send();
    }
};


const createInvoice = async (bill) => {
    const products = bill.products.map(product => {
        const amount = product.price * product.quantity;
        const gst = amount * (product.saleTaxPercentage / 100);
        const total = amount + gst;

        return {
            quantity: product.quantity,
            description: product.name,
            tax: gst,
            price: total
        };
    });

    const data = {
        //"documentTitle": "RECEIPT", //Defaults to INVOICE
        "currency": "USD",
        "taxNotation": "vat", //or gst
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
        //"logoExtension": "png", //only when logo is base64
        "sender": {
            "company": "MIAN ABDUL SHAKOOR TRADERS",
            "address": "Sample Street 123",
            "zip": "1234 AB",
            "city": "Toba Tek Singh",
            "country": "Pakistan"
            //"custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
        },
        "client": {
            "company": bill.customer.name,
            "address": bill.customer.address,
            "zip": "",
            "city": "",
            "country": ""
        },
        "invoiceNumber": bill.billNumber,
        "invoiceDate": bill.date,
        "products": products,
        "bottomNotice": "Kindly pay your invoice within 15 days."
    };

    const result = await easyinvoice.createInvoice(data);
    return Buffer.from(result.pdf, 'base64');
};
exports.getInvoiceAsExcel = async (req, res) => {
    const bill = await Bill.findById(req.params.id).populate('customer').populate('department').populate('item').populate('products');

    if (!bill) {
        return res.status(404).send();
    }

    const pdf = await createInvoice(bill);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdf);
};