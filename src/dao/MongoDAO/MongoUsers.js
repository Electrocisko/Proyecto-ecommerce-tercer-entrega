import mongoose from "mongoose";
import logger from "../../config/winston.config.js";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = "users";

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  imageUrl: { type: String },
  admin:{
    type:Boolean,
    default:false
},
});

export default class MongoUsers extends MongoDBContainer {
  constructor() {
    super(collection, usersSchema);
  }

  getByMail = async (mail) => {
    try {
      let result = await this.model.findOne({ email: mail });
      return result;
    } catch (error) {
      logger.log("error", `Error mongodb getByMail  ${error}`);
    }
  };
}
