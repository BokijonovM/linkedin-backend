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

export default profileRouter;
