import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./config/database.js";
import publicStudentRouter from "./controllers/public/student.js";
import authMiddleware from "./middleware/auth.js";
import privateStudentRouter from "./controllers/private/student.js";
import publicCourseRouter from "./controllers/public/course.js";
import privateCourseRouter from "./controllers/private/course.js";
import privateEnrollment from "./controllers/private/enrollment.js"
import publicAggregate from "./controllers/public/aggregate.js"
import privateAggregate from "./controllers/private/aggregate.js"


// console.log(process.env.PORT);
// what is process?
/*
"process" is the execution thread which basically runs your program.
*/

const app = express();

app.use(express.json()); // what is the purpose of this line?
// Converting any format of data (plain text, csv, html, etc) to JSON

const port = process.env.PORT || 5000;
// .env did not load, it returned undefined
// OR operator, null/undefined/0/false -> falsy conditions

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is collecting APIs just fine" });
});

app.use("/public-student", publicStudentRouter);
app.use("/public-course", publicCourseRouter);
app.use("/public-aggregate",publicAggregate),
app.use(authMiddleware);
app.use("/private-aggregate",privateAggregate);
app.use("/private-student", privateStudentRouter);
app.use("/private-course", privateCourseRouter);
app.use("/private-enrollment",privateEnrollment)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});