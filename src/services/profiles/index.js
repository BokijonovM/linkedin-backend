import express from "express";
import createHttpError from "http-errors";
import ProfilesModel from "./schema.js";
import multer from "multer";
import json2csv from "json2csv";
import { join } from "path";
import fs from "fs-extra";
import { pipeline } from "stream";
import experience from "./exp.js";
import lib from "../lib/index.js";

const { createReadStream, writeJSON } = fs;

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

////////////////////////////////
////////// experiences /////////
////////////////////////////////

profileRouter.get("/:id/experiences", async (req, res, next) => {
  try {
    const user = await ProfilesModel.findById(req.params.id);
    if (user) {
      res.send(user.experiences);
    } else {
      next(createHttpError(404, `Profile with Id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in profilerouter.get body!", {
        message: error.message,
      })
    );
  }
});

profileRouter.post("/:id/experiences", async (req, res, next) => {
  try {
    const updatedProfile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { $push: { experiences: req.body } },
      { new: true }
    );
    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      next(createHttpError(404, `Author with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(
        400,
        "Some errors occurred in profileRouter.post experiences body!",
        {
          message: error.message,
        }
      )
    );
  }
});

profileRouter.get("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const profile = await ProfilesModel.findById(req.params.id);
    const findUser = profile.experiences?.find(
      (findUser) => findUser._id.toString() === req.params.expId
    );
    if (findUser) {
      res.send(findUser);
    } else {
      next(createHttpError(404, `profile with Id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in profilerouter.get body!", {
        message: error.message,
      })
    );
  }
});

profileRouter.put("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const user = await ProfilesModel.findById(req.params.id);
    if (user) {
      const index = user.experiences.findIndex(
        (book) => book._id.toString() === req.params.expId
      );

      if (index !== -1) {
        user.experiences[index] = {
          ...user.experiences[index].toObject(),
          ...req.body,
        };

        await user.save();
        res.send(user);
      } else {
        next(
          createHttpError(404, `Exp with id ${req.params.expId} not found!`)
        );
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in profilerouter.get body!", {
        message: error.message,
      })
    );
  }
});

profileRouter.delete("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const modifiedUser = await ProfilesModel.findByIdAndUpdate(
      req.params.id, //WHO
      { $pull: { experiences: { _id: req.params.expId } } }, // HOW
      { new: true } // OPTIONS
    );
    if (modifiedUser) {
      res.send("Deleted sucessfully");
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in profilerouter.get body!", {
        message: error.message,
      })
    );
  }
});

profileRouter.get("/:id/experiences/:_id/CSV", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const profile = await ProfilesModel.findById(_id);
    const experienceJSONPath = join(process.cwd(), `./src/data/${_id}.csv`);
    // console.log(experienceJSONPath);
    await writeJSON(experienceJSONPath, profile.experiences);

    const filename = `${_id}.csv`;
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    const source = createReadStream(experienceJSONPath);
    const transform = new json2csv.Transform({
      fields: [
        "role",
        "company",
        "startDate",
        "endDate",
        "description",
        "area",
        "username",
        "image",
      ],
    });
    const destination = res;

    pipeline(source, transform, destination, (err) => {
      if (err) {
        console.log("Error!!!!");
      }
    });

    // res.status(200).send()
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in request body!", {
        message: error.message,
      })
    );
  }
});

profileRouter
  .route("/:_userId/experiences/:_id/image")
  .put(
    multer({ storage: lib.cloudStorage }).single("image"),
    experience.uploadImage
  );

export default profileRouter;
