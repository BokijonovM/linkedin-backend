import Profile from "./schema.js";
import fs from "fs-extra";

const uploadImage = async (req, res, next) => {
  try {
    const { _id, id } = req.params;

    const updateExperience = await Profile.findOneAndUpdate(
      { _id: id, "experiences._id": _id },
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

const update = async (req, res, next) => {
  try {
    const { _id, id } = req.params;
    await Profile.findOneAndUpdate(
      { _id: id, "experiences._id": _id },
      {
        "experiences.$": {
          ...req.body,
          _id: _id,
        },
      }
    );

    const getUpdatedExperiences = await Profile.findOne(
      { _id: id, "experiences._id": _id },
      { "experiences.$": 1 }
    );

    res.send(getUpdatedExperiences.experiences[0]);
  } catch (error) {
    next(error);
  }
};

const experience = {
  uploadImage: uploadImage,
  update: update,
};

export default experience;
