import express from "express"
import enrollmentModel from "../../models/Enrollment.js"
import mongoose  from "mongoose"

const router= express.Router()



//get my courses
router.get("/aggregate/my-courses", async(req,res)=>{
    try {
      let id= req.user.id
      
      const courses= await enrollmentModel.aggregate([
    //    $match is used to filter out logged in students enrollments 
        {
            $match:{
                student_id:new mongoose.Types.ObjectId(id)
            }

      },
    //   $lookup is used to match the course_id with courses collection "_id"
      {
        $lookup:{
            from:"courses",
            locaFeild:"course_id",
            foriegnFeild:"_id",
            as:"courseDetails"
        }
      },
    //   converts the courseDetails array into individual course object
      {
        $unwind:"$courseDetials"
      },

      {
        $project:{
            _id:0,
            "courseDetails.title":1,
            "courseDetails.code":1,
            "courseDetails.instructor":1,
            "courseDetails.duration":1,
            "courseDetails.tags":1
        }
      }
    ])

    return res.status(200).json({msg:"Courses fetched successfully"})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
})

export default router