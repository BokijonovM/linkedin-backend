import express from "express";
import createHttpError from "http-errors";
import ProfilesModel from "./schema.js";

const profileRouter = express.Router();

profileRouter.get("/", async (req, res, next) => {
  try {
    const profile = await ProfilesModel.find();
    res.send(profile);
  } catch (error) {
    next(error);
  }
});
profileRouter.post("/", async (req, res, next) => {
  try {
    const newProfile = new ProfilesModel(req.body);
    const { _id } = await newProfile.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
profileRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const profile = await ProfilesModel.findById(id);
    if (profile) {
      res.send(profile);
    } else {
      next(createHttpError(404, `profile with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
profileRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedProfile = await ProfilesModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      next(createHttpError(404, `profile with id ${profileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default profileRouter;
