const { Product } = require("../schemas/product.schema");


exports.addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(200).json({ status: true, message: "Product saved successfully", product });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

exports.getProducts = async (req, res) => {
    // Extract page and limit from query parameters
    let { page, limit } = req.query;

    // Default values if not provided
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    try {
        // Calculate the total number of products
        const total = await Product.countDocuments({});

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Fetch a page of products
        // const products = await Product.find().limit(limit).skip(startIndex);
        const products = await Product.find()

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Determine if there's a next or previous page
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            status: true,
            message: "Products found successfully",
            params: {
                total,
                limit,
                page,
                totalPages,
                next: nextPage,
                previous: previousPage,
            },
            products,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
};


exports.getProductbyId = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product find successfully", product });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, saleTaxPercentage, incomeTaxPercentage } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { name, price, saleTaxPercentage, incomeTaxPercentage }, { new: true });
        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product deleted successfully", product });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }

};

