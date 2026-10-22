import express from "express";
import courseModel from "../../models/Courses.js";
import { createCourseValidator} from "../../validators/courseValidators.js";
import { validation } from "../../validators/studentValidator.js";

const router = express.Router();

router.post("/create-course",createCourseValidator,validation,async (req, res) => {
  try {
    let courseDetails = req.body;
    let checkIfExists = await courseModel.findOne({ code: courseDetails.code });
    if (checkIfExists) {
      if (checkIfExists.isActive == false) {
        return res.status(400).json({
          msg: `course with Code ${courseDetails.code} alreaedy exists and is currently inactive`,
        });
      }
      return res.status(400).json({
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

router.patch("/update-course/:code",async (req, res) => {
  try {
    let courseCode = req.params.code;
    let checkIfExists = await courseModel.findOne({
      code: courseCode,
      isActive: true,
    });
    if (!checkIfExists) {
      return res.status(404).json({
        message: `Course with course code ${courseCode} does not exists`,
      });
    }
    let changes = req.body;
    if (Object.keys(changes).includes("code")) {
      return res
        .status(401)
        .json({ message: "You cannot update a course code" });
    }
    let operation = await courseModel
      .findOneAndUpdate(
        { code: courseCode },
        { $set: changes },
        { returnDocument: "after" },
      )
      .select("title code fee tags -_id");
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
      return res.status(404).json({
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

router.patch("/add-tags/:code", async (req, res) => {
  try {
    let courseCode = req.params.code;
    let { tags } = req.body;

    let checkIfExists = await courseModel.findOne({
      code: courseCode,
    });

    if (!checkIfExists) {
      return res.status(404).json({
        message: "Course not found or inactive",
      });
    }

    let updatedCourse = await courseModel
      .findOneAndUpdate(
        { code: courseCode },
        { $addToSet: { tags: { $each: tags } } },
        { returnDocument: "after" },
      )
      .select("title code tags -_id");

    res.status(200).json({
      message: "Tags added successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "internal server error",
    });
  }
});
// Remove tags of a court
router.patch("/remove-tags/:code", async (req, res) => {
  try {
    let courseCode = req.params.code;
    let { tags } = req.body;

    let course = await courseModel.findOne({
      code: courseCode,
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        msg: "Course not found or inactive",
      });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        msg: "Please provide tags in an array",
      });
    }

    let operation = await courseModel
      .findOneAndUpdate(
        { code: courseCode, isActive: true },
        { $pull: { tags: { $in: tags } } },
        { returnDocument: "after" },
      )
      .select("title code tags -_id");

    res.status(200).json({
      msg: "Tags removed successfully",
      operation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
});

// GET COURSE BY INSTRUCTOR
router.get("/instructor/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const courses = await courseModel.find({
      instructor: name,
    });

    if (courses.length === 0) {
      return res.status(404).json({
        message: "No courses found for this instructor",
      });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
export default router;
