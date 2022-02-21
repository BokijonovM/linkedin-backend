import json2csv from "json2csv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import ExperiencesModel from "./schema.js";
import { pipeline } from "stream";
import createHttpError from "http-errors";

const { createReadStream, writeJSON } = fs;

const getExpCSV = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const profile = await ExperiencesModel.findById({ _id });
    // const experienceJSONPath = join(
    //   dirname(fileURLToPath(import.meta.url)),
    //   `../../data/${_id}.json`
    // );
    const experienceJSONPath = join(process.cwd(), `./src/data/${_id}.json`);
    // console.log(experienceJSONPath);
    await writeJSON(experienceJSONPath, profile.experiences);

    const filename = `${_id}.csv`;
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`); // this header tells the browser to open the "save file as" dialog
    const source = createReadStream(experienceJSONPath);
    const transform = new json2csv.Transform({
      fields: [
        "area",
        "company",
        "description",
        "image",
        "role",
        "user",
        "endDate",
        "startDate",
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
};

const experience = {
  getExpCSV: getExpCSV,
};

export default experience;
