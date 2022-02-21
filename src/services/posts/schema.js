import mongoose from "mongoose";
const { Schema, model } = mongoose;
const profileSchema = new Schema(
  {
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, required:false },
    userName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default model("profile", profileSchema);
