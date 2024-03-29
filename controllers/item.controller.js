const { Item } = require ("../schemas/item.schema");


exports.addItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(200).json({ status: true, message: "Item saved successfully", item });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

exports.getItems = async (req, res) => {
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
        // const items = await Item.find().limit(limit).skip(startIndex);
        const items = await Item.find()

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


exports.getItembyId = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item find successfully", item });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        }, { new: true });

        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item updated successfully", item });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) res.status(404).json({ status: false, message: "Item not found" });
        else res.status(200).json({ status: true, message: "Item deleted successfully", item });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

