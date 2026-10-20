import mongoose from "mongoose";

const studentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:50,
        trim:true
    },

    rollNumber:{
        type:Number,
        required:true,
        unique:true,
        trim:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },

    password:{
        type:String,
        trim:true,
        required:true,
        minLength:8,
        maxLength:100,

    },

    age:{
        type:Number,
        required:true,
    },

    gender:{
        type:String,
        enum:["Male","Female"],
        required:true,
    },
    status:{
        type:String,
        enum:["active","inactive","Graduated"]
    }

}, {timestamps:true})

let StudentModel= mongoose.model("student",studentSchema)

export default StudentModel