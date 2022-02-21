import express from "express";
import ExperiencesModel from "./schema.js";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import json2csv from "json2csv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import { pipeline } from "stream";
import experience from "./csv.js";

const { createReadStream, writeJSON } = fs;

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "experience",
    },
  }),
}).single("image");

const expereincesRouter = express.Router();

expereincesRouter.post("/experiences/", async (req, res, next) => {
  try {
    const newExperience = new ExperiencesModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(newExperience);
  } catch (error) {
    next(error);
  }
});

expereincesRouter.get("/experiences/", async (req, res, next) => {
  try {
    const product = await ExperiencesModel.find();
    res.send(product);
  } catch (error) {
    next(error);
  }
});

expereincesRouter.get("/experiences/:experienceId", async (req, res, next) => {
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

expereincesRouter.put("/experiences/:experienceId", async (req, res, next) => {
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

expereincesRouter.delete(
  "/experiences/:experienceId",
  async (req, res, next) => {
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
  }
);

expereincesRouter.post(
  "/experiences/:experienceId/image",
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

expereincesRouter.route("/experiences/:_id/CSV").get(experience.getExpCSV);

export default expereincesRouter;
