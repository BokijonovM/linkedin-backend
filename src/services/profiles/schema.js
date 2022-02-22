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
    image: { type: String, required: true },
    username: { type: String, required: true, unique: true, dropDups: true },
    experiences: [
      {
        role: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: false },
        description: { type: String, required: true },
        area: { type: String, required: true },
        username: {
          type: String,
          unique: true,
          required: true,
          dropDups: true,
        },
        user: { type: Schema.Types.ObjectId, ref: "profile" },
        image: { type: String, required: true },
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default model("profile", profileSchema);
