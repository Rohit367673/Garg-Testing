import mongoose from "mongoose"
const userSchema=new mongoose.Schema({
    Username:{
        typeof:String,
        required:[true,"Username is required"],
        unique:true
    },
    Email:{

        typeof:String,
        required:true,
        valid:true

    },
    Password:{
        typeof:String,
        required:[true,"you have to enter password"],
        unique:true
    },
    about:{
        type:mongoose.Types.ObjectId,
        ref:"About"
    }

})
export const User=mongoose.model("User",userSchema)