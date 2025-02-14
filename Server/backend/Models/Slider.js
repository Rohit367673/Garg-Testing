import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const Slider = mongoose.model('Slider', SliderSchema)
export default Slider;