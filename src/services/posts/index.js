import express from "express";
import createHttpError from "http-errors";
import ProfileModel from "./schema.js";

const profileRouter = express.Router();

profileRouter.get("/", async (req, res, next) => {
  try {
    const profile = await new ProfileModel.find();
    res.send(profile);
  } catch (error) {
    next(error);
  }
});
profileRouter.get("/:profileId", async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    const profile = await ProfileModel.findById(profileId);
    if (profile) {
      res.send(profile);
    } else {
      next(createHttpError(404, `profile with id ${profileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
profileRouter.post("/", async (req, res, next) => {
  try {
    const newProfile = new ProfileModel(req.body);
    const { _id } = await newProfile.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
profileRouter.put("/:profileId", async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      profileId,
      req.body,
      {
        new: true,
      }
    );
    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      next(createHttpError(404, `profile with id ${profileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
profileRouter.delete("/:profileId", async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    const deletedProfile = await ProfileModel.findByIdAndDelete(profileId);
    if (deletedProfile) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `profile with id ${profileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
export default profileRouter;
