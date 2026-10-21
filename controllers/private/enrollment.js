import express from "express";
import enrollmentModel from "../../models/Enrollment.js";
import studentModel from "../../models/Students.js";
import courseModel from "../../models/Courses.js";

const router = express.Router();

router.post("/enroll", async (req, res) => {
    try {
         let details = req.body;
        let studentExists = await studentModel.findOne({
            _id: req.user.id,
            status: "active",
        });

        if (!studentExists) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        let courseExists = await courseModel.findOne({
            _id: details.course_id,
            isActive: true,
        });

        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        let newEnrollment = {
            student_id: req.user.id,
            ...details,
        };

        let enrollment = await enrollmentModel.create(newEnrollment);

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

export default router;
