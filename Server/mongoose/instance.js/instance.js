import mongoose, { Mongoose } from "mongoose";
const emailSchema= new Mongoose.schema({
    username:String,
    email:String
})
emailSchema.method.generateId=function(){
    return this.username+'@'+this.email.split('@')[0]
}

export const EmailId= mongoose.model("EmailId",emailSchema)