import express from "express";
import ExperiencesModel from "./schema.js";
import createHttpError from "http-errors";

const expereincesRouter = express.Router();

expereincesRouter.post("/", async(req, res, next) => {
    try {
        const newExperience = new ExperiencesModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(newExperience);
    } catch (error) {
        next(error)
    }
})

expereincesRouter.get("/", async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
expereincesRouter.get("/:userName", async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
expereincesRouter.put("/:userName", async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
expereincesRouter.delete("/:userName", async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

export default expereincesRouter