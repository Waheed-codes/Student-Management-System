import express from "express";
import studentModel from "../../models/Students.js"
import bcrypt from "bcrypt";
import tokenize from "../../utils/token.js";
import { loginValidator, registerValidator, validation } from "../../validators/studentValidator.js";

const router = express.Router();

router.post("/register", registerValidator, validation, async (req, res) => {
    try {
        let { name, rollNumber, email, password, age, gender } = req.body;
        let checkIfExists = await studentModel.findOne({ email: email });
        if (checkIfExists) {
            return res.status(400).json({ message: "Student already exists" });
        }
        let newStudent = {
            name,
            rollNumber,
            email,
            password: await bcrypt.hash(password, 10),
            age,
            gender,
            
        };
        let response = await studentModel.create(newStudent);
        res.status(201).json({ message: "Student created successfully", response });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
});

router.post("/login",loginValidator,validation, async (req, res) => {
    try {
        let { email, password } = req.body;
        let checkIfExists = await studentModel.findOne({ email: email });
        if (!checkIfExists) {
            return res.status(404).json({ message: "Student not found, please register" });
        }
        const passwordMatches = await bcrypt.compare(password, checkIfExists.password);
        if (!passwordMatches) {
            return res.status(400).json({ message: "Incorrect credentials" });
        }
        let payload = {
            id: checkIfExists._id
        };
        let token = await tokenize(payload);
        res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


export default router;