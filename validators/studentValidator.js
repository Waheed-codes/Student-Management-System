import { body, validationResult } from "express-validator";

let registerValidator = [
      body("name")
            .trim()
            .isAlpha()
            .withMessage("Name should be alphabets only")
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 3, max: 25 })
            .withMessage(
                  "Name should be minimum 3 letters and maximum 25 letters",
            ),

      body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid Email")
            .notEmpty()
            .withMessage("Email ID is required"),

      body("rollNumber")
            .trim()
            .isNumeric()
            .withMessage("Roll number must be a number"),

      body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 6, max: 12 })
            .withMessage(
                  "Password must be atleast 6 characters and maximum 12 characters",
            ),

      body("age")
            .trim()
            .notEmpty()
            .withMessage("age is required")
            .isNumeric()
            .withMessage("Age must be a number"),

      body("gender").trim().isAlpha().withMessage("Gender must be alphabets"),
];

let loginValidator=[
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid Email")
        .notEmpty()
        .withMessage("Email is required"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is Required")
        .isLength({min:6, max:18})
]


let updateStudentValidator=[
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid Email")
        .notEmpty()
        .withMessage("Email is required"),


    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is Required")
        .isAlphanumeric()
        .isLength({min:6, max:18}),
    

    body("age")
    .trim()
    .isNumeric()
    .withMessage("Age Must Be a number")
    .notEmpty()
    .withMessage("Age must be a Number")
]

let changePasswordStudentValidator=[
     body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Password is Required")
        .isAlphanumeric()
        .isLength({min:6, max:18}),

        body("newPassword")
         .trim()
        .notEmpty()
        .withMessage("Password is Required")
        .isAlphanumeric()
        .isLength({min:6, max:18}),
          
    ]

function validation(req, res, next) {
      try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                  res.status(400).json(errors);
            }
            next();
      } catch (error) {
            console.error(error.message);
      }
};

        
export {registerValidator,loginValidator, updateStudentValidator, changePasswordStudentValidator,validation};