import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLength: 25,
    },
    fee: {
      type: Number,
      required: true,
      min: 100,
    },
    duration: {
      type: String,
      required: true,
      min: 5,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const courseModel = mongoose.model("Course", courseSchema);

export default courseModel;
