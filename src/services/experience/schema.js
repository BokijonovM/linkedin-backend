import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    description: { type: String, required: true },
    area: { type: String, required: true },
    username: { type: String, unique: true, required: true, dropDups: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


export default model("Experience", ExperienceSchema);