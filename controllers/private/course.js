import express from "express";
import courseModel from "../../models/Courses.js";

const router = express.Router();

router.post("/create-course", async (req, res) => {
    try {
        let courseDetails = req.body;
        let checkIfExists = await courseModel.findOne({ code: courseDetails.code });
        if (checkIfExists) {
            if(checkIfExists.isActive == false){
                return res.status(400).json({
                    "msg" : `course with Code ${courseDetails.code} alreaedy exists and is currently inactive`
                })
            }
            return res
                .status(400)
                .json({
                    message: `A course with course code ${courseDetails.code} already exists`,
                });
        }
        let creation = await courseModel.create(courseDetails);
        res.status(201).json({ message: "course created successfully", creation });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});

router.patch("/update-course/:code", async (req, res) => {
    try {
        let courseCode = req.params.code;
        let checkIfExists = await courseModel.findOne({
            code: courseCode,
            isActive: true,
        });
        if (!checkIfExists) {
            return res
                .status(404)
                .json({
                    message: `Course with course code ${courseCode} does not exists`,
                });
        }
        let changes = req.body;
        if (Object.keys(changes).includes("code")) {
            return res
                .status(401)
                .json({ message: "You cannot update a course code" });
        }
        let operation = await courseModel.findOneAndUpdate(
            { code: courseCode },
            { $set: changes },
            { returnDocument: "after" },
        ).select("title code fee tags -_id")
        res.status(200).json({ message: "Course updated successfully", operation });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});

router.patch("/delete-course/:code", async (req, res) => {
    try {
        let courseCode = req.params.code;
        let checkIfExists = await courseModel.findOne({ code: courseCode });
        if (!checkIfExists) {
            return res
                .status(404)
                .json({
                    message: `Course with course code ${courseCode} does not exists`,
                });
        }
        let deletedCourse = await courseModel.findOneAndUpdate(
            { code: courseCode },
            { $set: { isActive: false } },
        );
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});

router.patch("/add-tags/:code" , async (req,res) =>{
    try {
        let courseCode = req.params.code 
        let {tags} = req.body

        let checkIfExists = await courseModel.findOne({
            code: courseCode
        })

         if (!checkIfExists) {
            return res.status(404).json({
                message: "Course not found or inactive"
            });
        }

    let updatedCourse = await courseModel.findOneAndUpdate(
        {code: courseCode},
        {$addToSet: {tags: {$each: tags}}},
        {returnDocument: "after"}
    ).select("title code tags -_id")

    res.status(200).json({
            message: "Tags added successfully",
            updatedCourse
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})
export default router;
