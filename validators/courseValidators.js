import { body, validationResult } from "express-validator";


let createCourseValidator=[
    body("title")
    .trim()
    .isAlpha()
    .withMessage("Title should only be alphabets")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min:3, max:60}),


    body("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isAlpha()
    .withMessage("Code should only be alphabets"),

    body("instructor")
    .trim()
    .notEmpty()
    .withMessage("Instructor is required")
    .isAlpha()
    .withMessage("Instructor should only be alphabets")
    .isLength({min:6, max:25}),


    body("fee")
    .trim()
    .notEmpty()
    .withMessage("Fee is required")
    .isNumeric()
    .withMessage("Fee should be in Numbers"),


    body("duration")
     .notEmpty()
    .withMessage("Duration is required")
    .isAlpha()
    .withMessage("Duration should be in days and months")

]







async function validation(req,res,next){
    try {
        let errors = await validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json(errors)
        }
        next()
    } catch (error) {
        console.log(error.message);
        
    }
}

export {createCourseValidator, validation}