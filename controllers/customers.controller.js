const { Customer } = require ("../schemas/customer.schema");


exports.addCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(200).json({ status: true, message: "Customer saved successfully", customer });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

exports.getCustomers = async (req, res) => {
    // Extract page and limit from query parameters
    let { page, limit } = req.query;

    // Default values if not provided
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    try {
        // Calculate the total number of customers
        const total = await Customer.countDocuments({});

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Fetch a page of customers
        const customers = await Customer.find().limit(limit).skip(startIndex);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Determine if there's a next or previous page
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            status: true,
            message: "Customers found successfully",
            params: {
                total,
                limit,
                page,
                totalPages,
                next: nextPage,
                previous: previousPage,
            },
            customers,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
};


exports.getCustomerbyId = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) res.status(404).json({ status: false, message: "Customer not found" });
        else res.status(200).json({ status: true, message: "Customer find successfully", customer });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

exports.updateCustomer = async (req, res) => {
    try {
        const { name, address, CNIC, mobile } = req.body;
        const customer = await Customer.findByIdAndUpdate(req.params.id, { name, address, CNIC, mobile }, { new: true });

        if (!customer) res.status(404).json({ status: false, message: "Customer not found" });
        else res.status(200).json({ status: true, message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) res.status(404).json({ status: false, message: "Customer not found" });
        else res.status(200).json({ status: true, message: "Customer deleted successfully", customer });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

