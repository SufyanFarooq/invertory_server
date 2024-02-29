import { Product } from "../schemas/product.schema.js";


export const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({ status: false, message: "Product saved successfully" });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

export const getProducts = async (req, res) => {
    const products = await Product.find();
    res.send(products);
};

export const getProductbyId = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) res.status(404).send('Product not found');
        else res.status(400).json({ status: true, message: err, product });
    } catch (error) {
        res.status(500).json({ status: false, message: err });
    }

};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
        }, { new: true });

        if (!product) res.status(404).send('Product not found');
        else res.status(400).json({ status: false, message: err, product });
    } catch (error) {
        res.status(400).json({ status: false, message: err });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);

        if (!product) res.status(404).send('Product not found');
        else res.send(product);
    } catch (error) {
        res.status(500).json({ status: false, message: err });
    }

};

