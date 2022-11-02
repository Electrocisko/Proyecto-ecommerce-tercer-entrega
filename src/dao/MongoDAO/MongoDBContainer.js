import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import dotenvConfig from "../../config/dotenv.config.js";
import logger from "../../config/winston.config.js";

const MONGO_URL = dotenvConfig.mongo.MONGO_URL;

export default class MongoDBContainer {
  constructor(collection, schema) {
    mongoose.connect(MONGO_URL)
    .then( () => {
      this.model = mongoose.model(collection, schema);
    })
    .catch((error) => {
      logger.log('error',`Error in mongoose connect error: ${error}`)
    })
  }

  getAll = async () => {
    try {
      let result = await this.model.find();
      return result;
    } catch (error) {
      logger.log("error", `Error mongodb getAll  ${error}`);
    }
  };

  save = async (document) => {
    try {
      let result = await this.model.create(document);
      return result;
    } catch (error) {
      logger.log("error", `Error mongodb save  ${error}`);
    }
  };

  getById = async (id) => {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      let result = await this.model.find({ _id: id });
      if (Object.keys(result).length === 0) {
        return null;
      }
      return result;
    } catch (error) {
      logger.log("error", `Error mongodb getById  ${error}`);
    }
  };

  deleteById = async (id) => {
    try {
      let result = false;
      if (!ObjectId.isValid(id)) {
        return result;
      }
      let deleted = await this.model.deleteOne({ _id: id });
      deleted.deletedCount === 0 ? (result = false) : (result = true);
      return result;
    } catch (error) {
      logger.log("error", `Error mongodb deleteById  ${error}`);
    }
  };

  update = async (id, modifiedProduct) => {
    try {
    let result = false;
    if (!ObjectId.isValid(id)) {
      return result;
    }
    let modi = await this.model.updateOne(
      { _id: id },
      { $set: modifiedProduct }
    );
    return modi;
    } catch (error) {
      logger.log("error", `Error mongodb update ${error}`);
    }
  };
}
