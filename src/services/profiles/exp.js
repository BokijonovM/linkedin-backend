import Profile from "./schema.js";
import fs from "fs-extra";

const { createReadStream, writeJSON } = fs;

const uploadImage = async (req, res, next) => {
  try {
    const { _id, _userId } = req.params;

    const updateExperience = await Profile.findOneAndUpdate(
      { _id: _userId, "experiences._id": _id },
      {
        $set: { "experiences.$.image": req.file.path },
      },
      {
        projection: { "experiences.$": 1 },
      }
    );

    res.send(updateExperience.experiences[0]);
  } catch (error) {
    next(error);
  }
};

const experience = {
  uploadImage: uploadImage,
};

export default experience;
