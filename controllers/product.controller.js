import { Product } from "../schemas/product.schema.js";


export const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(200).json({ status: true, message: "Product saved successfully", product });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

export const getProducts = async (req, res) => {
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
        const products = await Product.find().limit(limit).skip(startIndex);

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


export const getProductbyId = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product find successfully", product });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
        }, { new: true });

        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);

        if (!product) res.status(404).json({ status: false, message: "Product not found" });
        else res.status(200).json({ status: true, message: "Product deleted successfully", product });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

