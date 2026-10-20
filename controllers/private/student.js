import express from "express";
import studentModel from "../../models/Students.js";

const router = express.Router();

router.get("/profile", async (req, res) => {
    try {
        let id = req.user.id;
        let student = await studentModel.findById(id, { _id: -1, name: 1, email: 1, rollNumber: 1, status: 1 });
        if(!student)
        {
            return res.status(404).json({message: "Student not found, please register"});
        }
        res.status(200).json({message: "Student profile", student});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error",error: error.message});
    }
});

export default router;