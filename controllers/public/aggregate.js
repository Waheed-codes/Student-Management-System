import express from "express"
import studentModel from "../../models/Students.js"
import courseModel from "../../models/Courses.js"
import enrollmentModel from "../../models/Enrollment.js"
import mongoose  from "mongoose"

const router= express.Router()


//get all enrollments
router.get("/aggregate/get-all-enrollments", async(req,res)=>{
    try {
        let studentId = new mongoose.Types.ObjectId(req.user.id)

        let enrolled = await enrollmentModel.aggregate([
            {
                $match:{
                    student_id:studentId
                },
                $lookup:{
                    from:"students",
                    localField:"student_id",
                    foreignField:"_id",
                    as:"Student_Info"
                },
                $lookup:{
                    from:"courses",
                    localField:"course_id",
                    foriegnFeild:"_id",
                    as:"Course_info"
                },
                    $project:{
                        _id:0,
                        student_id:{
                            $arrayElemAt:["student_info", 0]
                        },
                        course_id:{
                            $arrayElemAt:["$course_info",0]
                        },
                        status:1,
                        enrolledAt:1
                    },

                    $project:{
                        student_id:{
                            name:1,
                            email:1,
                            age:1,
                            gender:1
                        },
                        course_id:{
                            title:1,
                            code:1,
                            insturctor:1,
                            fee:1
                        },
                        status:1,
                        enrolledAt:1

                    }
            }
        ])

        if(enrolled.length===0){
            let studentExists= await studentModel.findOne({
                _id:studentId,
                status:"active"
            })
        }

        if(!studentExists){
            return res.status(404).json({msg:"Student doesnt exists with this id"})
        }

        return res.status(200).json({
            msg:"all courses info registered from this student"
        })
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
})

//aggregate GET API to get all instructor with name
// $lookup is not required because we the instructor detials and course details are in same collection
router.get("/aggregate/instructor/:name", async(req,res)=>{
    try {
        const name= req.params

        const courses= await courseModel.aggregate([
            {
                $match:{
                    instructor:name
                }
            },

            {
                $project:{
                    _id:0,
                    title:1,
                    code:1,
                    instructor:1,
                    fee:1,
                    duration:1,
                    tags:1
                }
            }
        ])

        if(courses.length===0){
            return res.status(404).json({msg:"No courses found for this instuctor"})
        }

        return res.json({msg:`Course fetched successfully `})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
})


//GET all courses 
router.get("/aggregate/courses", async (req, res) => {
    try {
        let allCourses = await courseModel.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    code: 1,
                    fee: 1,
                    tags: 1,
                    duration: 1
                }
            }
        ]);

        if (allCourses.length === 0) {
            return res.status(200).json({
                message:
                    "There are no courses available at the moment. Please check later!"
            });
        }

        return res.status(200).json({
            message: "These are all the courses available",
            allCourses
        });

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

//GET course by course code
router.get("aggregate/course/:code", async (req, res) => {
    try {
        let courseCode = req.params.code;

        let course = await courseModel.aggregate([
            {
                $match: {
                    code: courseCode,
                    isActive: true
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    code: 1,
                    fee: 1,
                    tags: 1,
                    duration: 1
                }
            }
        ]);

        if (course.length === 0) {
            return res.status(404).json({
                message: `Course with code:${courseCode} does not exist`
            });
        }

        return res.status(200).json({
            message: `The details of course with code:${courseCode} are`,
            course: course[0]
        });

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});


// GET withdrawn enrollments
router.get("aggregate/withdrawn-enrollments", async (req, res) => {
    try {
        let studentId = new mongoose.Types.ObjectId(req.user.id);

        let withdrawn = await enrollmentModel.aggregate([
            {
                $match: {
                    student_id: studentId,
                    status: "withdrawn"
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "courseDetails",
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $project: {
                    _id: 0,
                    course_id: {
                        title: "$courseDetails.title",
                        code: "$courseDetails.code",
                        instructor: "$courseDetails.instructor",
                        fee: "$courseDetails.fee"
                    },
                    status: 1,
                    enrolledAt: 1
                }
            }
        ]);

        if (withdrawn.length === 0) {
            return res.status(200).json({
                msg: "No cancelled enrollments found",
                count: 0,
                withdrawn: []
            });
        }

        return res.status(200).json({
            msg: "Withdrawn enrollments fetched successfully",
            count: withdrawn.length,
            withdrawn
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

export default router