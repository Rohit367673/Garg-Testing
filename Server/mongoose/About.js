import mongoose, { Mongoose } from "mongoose";

const AboutSchema= new mongoose.Schema({

    about:{
        typeof:String,
        required:true
    }
})

export const Value= mongoose.model("Value",AboutSchema)