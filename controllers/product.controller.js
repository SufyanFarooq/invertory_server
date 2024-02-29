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
    const products = await Product.find();
    res.status(200).json({ status: true, message: "Product find successfully", products });
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

