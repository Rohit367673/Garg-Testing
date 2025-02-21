import mongoose from "mongoose";

const { Schema } = mongoose;

const ReviewsSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

const ReviewsModel = mongoose.model("Reviews", ReviewsSchema);
export default ReviewsModel;
