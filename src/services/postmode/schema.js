// {
//     "_id": "5d93ac84b86e220017e76ae1", //server generated
//     "text": "this is a text 12312 1 3 1",
//     "username": "admin",
//     "image": ..., //server generated on upload, set a default here
//     "user": {
//         "_id": "5d84937322b7b54d848eb41b", //server generated
//         "name": "Diego",
//         "surname": "Banovaz",
//         "email": "diego@strive.school",
//         "bio": "SW ENG",
//         "title": "COO @ Strive School",
//         "area": "Berlin",
//         "image": ..., //server generated on upload, set a default here
//         "username": "admin",
//         "createdAt": "2019-09-20T08:53:07.094Z", //server generated
//         "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
//     }
//     "createdAt": "2019-10-01T19:44:04.496Z", //server generated
//     "updatedAt": "2019-10-01T19:44:04.496Z", //server generated

// }

import mongoose from "mongoose";

const { Schema, model } = mongoose;
const PostSchema = new Schema(
  {
    text: { type: String, required: false },
    username: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    // user: {
    //   name: { type: String, required: true },
    //   surname: { type: String, required: true },
    //   email: { type: String, required: true },
    //   bio: { type: String, required: true },
    //   title: { type: String, required: false },
    //   area: { type: String, required: false },
    //   image: { type: String, required: true },
    //   username: { type: String, required: true },
    // },
    comments: [
      {
        author: { type: String, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    likes: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("Post", PostSchema);
