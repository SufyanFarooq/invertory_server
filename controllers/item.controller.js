import { Item } from "../schemas/item.schema.js";


export const addItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(200).json({ status: true, message: "Item saved successfully", item });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

export const getItems = async (req, res) => {
    // Extract page and limit from query parameters
    let { page, limit } = req.query;

    // Default values if not provided
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    try {
        // Calculate the total number of items
        const total = await Item.countDocuments({});

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Fetch a page of items
        const items = await Item.find().limit(limit).skip(startIndex);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Determine if there's a next or previous page
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            status: true,
            message: "Items found successfully",
            params: {
                total,
                limit,
                page,
                totalPages,
                next: nextPage,
                previous: previousPage,
            },
            items,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
};


export const getItembyId = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item find successfully", item });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

export const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
        }, { new: true });

        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item updated successfully", item });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndRemove(req.params.id);

        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item deleted successfully", item });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

