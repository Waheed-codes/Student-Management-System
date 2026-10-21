import express from "express";
import courseModel from "../../models/Courses.js";

const router = express.Router();

router.get("/courses", async (req, res) => {
  try {
    let allCourses = await courseModel.find(
      { isActive: true },
      { title: 1, code: 1, fee: 1, tags: 1, duration: 1, _id: 0 },
    );
    // courseModel.find().select({name code fee tags duration -_id})
    if (allCourses.length === 0) {
      return res
        .status(200)
        .json({
          message:
            "There are no courses available at the moment. Please check later!",
        }); //404 || 200
    }
    res
      .status(200)
      .json({ message: "These are all the courses available", allCourses });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/course/:code", async (req, res) => {
  try {
    let courseCode = req.params.code;
    let course = await courseModel.findOne(
      { code: courseCode, isActive: true },
      { title: 1, code: 1, fee: 1, tags: 1, duration: 1, _id: 0 },
    );
    if (!course) {
      return res
        .status(404)
        .json({ message: `Course with code:${courseCode} does not exist` });
    }
    res
      .status(200)
      .json({
        message: `The details of course with code:${courseCode} are`,
        course,
      });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
