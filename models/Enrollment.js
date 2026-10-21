import mongoose from "mongoose"

const enrollmentSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "students"
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "courses"
    },
    status:{
        type: String,
        enum: ["enrolled", "completed", "withdrawn"],
        default: "enrolled"
    },
    enrolledAt:{
        type: Date,
        default: Date.now()
    }
},{timestamps: true})

const enrollmentModel = mongoose.model("enrolled", enrollmentSchema)

export default enrollmentModel