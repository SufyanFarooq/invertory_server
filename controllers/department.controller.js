import { Department } from "../schemas/department.schema.js";


export const addDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(200).json({ status: true, message: "Department saved successfully", department });
    } catch (err) {
        res.status(500).json({ status: false, message: err });
    }
};

export const getDepartments = async (req, res) => {
    // Extract page and limit from query parameters
    let { page, limit } = req.query;

    // Default values if not provided
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    try {
        // Calculate the total number of departments
        const total = await Department.countDocuments({});

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Fetch a page of departments
        const departments = await Department.find().limit(limit).skip(startIndex);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Determine if there's a next or previous page
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            status: true,
            message: "Departments found successfully",
            params: {
                total,
                limit,
                page,
                totalPages,
                next: nextPage,
                previous: previousPage,
            },
            departments,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
};


export const getDepartmentbyId = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) res.status(404).json({ status: false, message: "Department not found" });
        else res.status(200).json({ status: true, message: "Department find successfully", department });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        }, { new: true });

        if (!department) res.status(404).json({ status: false, message: "Department not found" });
        else res.status(200).json({ status: true, message: "Department updated successfully", department });
    } catch (error) {
        res.status(400).json({ status: false, message: error });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndRemove(req.params.id);

        if (!department) res.status(404).json({ status: false, message: "Department not found" });
        else res.status(200).json({ status: true, message: "Department deleted successfully", department });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }

};

