import express from "express";
import ExperiencesModel from "./schema.js";
import createHttpError from "http-errors";

const expereincesRouter = express.Router();

export default expereincesRouter