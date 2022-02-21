import express from "express";
import ExperiencesModel from "./schema.js";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "experience",
    },
  }),
}).single("image");

const expereincesRouter = express.Router();

expereincesRouter.post("/", async (req, res, next) => {
  try {
    const newExperience = new ExperiencesModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(newExperience);
  } catch (error) {
    next(error);
  }
});

expereincesRouter.get("/", async (req, res, next) => {
  try {
    const product = await ExperiencesModel.find();
    res.send(product);
  } catch (error) {
    next(error);
  }
});

expereincesRouter.get("/:experienceId", async (req, res, next) => {
  try {
    const product = await ExperiencesModel.findById(req.params.experienceId);
    if (product) {
      res.send(product);
    } else {
      res
        .status(404)
        .send(`Product with id ${req.params.experienceId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

expereincesRouter.put("/:experienceId", async (req, res, next) => {
  try {
    const updated = await ExperiencesModel.findByIdAndUpdate(
      req.params.experienceId,
      req.body,
      { new: true }
    );
    if (updated) {
      res.send(updated);
    } else {
      res
        .status(404)
        .send(`Expereince with id ${req.params.experienceId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

expereincesRouter.delete("/:experienceId", async (req, res, next) => {
  try {
    const deleted = await ExperiencesModel.findByIdAndDelete(
      req.params.experienceId
    );
    if (deleted) {
      res.send("Experience deleted!");
    } else {
      res
        .status(404)
        .send(`Experience with id ${req.params.experienceId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

expereincesRouter.post(
  "/:experienceId/image",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const experienceId = req.params.experienceId;
      const updated = await ExperiencesModel.findByIdAndUpdate(
        experienceId,
        { image: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(
          createHttpError(404, `Experience with id ${experienceId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default expereincesRouter;
