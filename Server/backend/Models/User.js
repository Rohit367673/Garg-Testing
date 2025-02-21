import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   
    Name: String,
    Email: String,
    Number: Number,
    Pass: String,
    ProfilePic: { type: String },
    role: {
      type: String,
      default: "user",
    },
    firebaseUid: String,
    Number: String,
  
  },
  { timeStamps: true }
);

const UserModel = mongoose.model("User", userSchema);
 export default UserModel;
