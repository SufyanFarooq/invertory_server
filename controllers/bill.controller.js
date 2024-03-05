import { Bill } from "../schemas/bill.schema.js";
import ExcelJS from "exceljs";

export const createBill = async (req, res) => {
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

export const readBills = async (req, res) => {
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

export const readBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) res.status(404).json({ status: false, message: "Bill not found" });
        else res.status(200).json({ status: true, message: "Bill find successfully", bill });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

export const updateBill = async (req, res) => {
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

export const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);

        if (!bill) res.status(404).json({ status: false, message: "Bill not found" });
        else res.status(200).json({ status: true, message: "Bill deleted successfully", bill });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }

};

export const getBillAsExcel = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('customer').populate('department').populate('item').populate('products');

        if (!bill) {
            return res.status(404).send();
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bill');

        // Add headers for the "BILL FORMATE" section
        worksheet.columns = [
            { header: 'Product', key: 'product' },
            { header: 'Unit Rate', key: 'unitRate' },
            { header: 'Qty.', key: 'quantity' },
            { header: 'Amount', key: 'amount' },
            { header: 'GST 18%', key: 'gst' },
            { header: 'Total Amount', key: 'totalAmount' }
        ];

        // Add data for each product in the "BILL FORMATE" section
        let totalGST = 0;
        let totalAmount = 0;
        bill.products.forEach(product => {
            const amount = product.price * product.quantity;
            const gst = amount * (product.saleTaxPercentage / 100);
            const total = amount + gst;

            worksheet.addRow({
                product: product.name,
                unitRate: product.price,
                quantity: product.quantity,
                amount: amount,
                gst: gst,
                totalAmount: total
            });

            totalGST += gst;
            totalAmount += total;
        });

        // Add total row in the "BILL FORMATE" section
        worksheet.addRow({
            unitRate: 'Total:',
            amount: totalAmount - totalGST,
            gst: totalGST,
            totalAmount: totalAmount
        });

        // Add headers for the "INVOICE FORMATE" section
        worksheet.addRow([]);
        worksheet.addRow(['INVOICE FORMATE', 'Unit Rate', 'Qty.', 'Amount', 'GST 18%', 'Total Amount']);

        // Add data for the invoice in the "INVOICE FORMATE" section
        worksheet.addRow({
            unitRate: totalAmount - totalGST,
            gst: totalGST,
            totalAmount: totalAmount
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=bill.xlsx');
        res.send(buffer);
    } catch (e) {
        res.status(500).send();
    }
};