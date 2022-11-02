import logger from "../../config/winston.config.js";
import FileContainer from "./FileContainer.js";
import { nanoid } from "nanoid";
import fs from "fs";
import __dirname from "../../utils.js";



export default class FileUser extends FileContainer {
  constructor() {
    super("/files/users.txt");
  }

  getByMail = async (email) => {
    try {
      let list = await this.getAll();
      const foundItem = list.find((element) => element.email === email);
      if (foundItem !== undefined) {
        logger.log("debug", `getbymail ${JSON.stringify(foundItem)}`);
        return foundItem;
      } else {
        return null;
      }
    } catch (error) {
      logger.log('error', `Error get by mail  ${error}`);
    }
  };

  save = async (user) => {
    try {
      user._id = nanoid(10);
      user.admin = false;
      let list = await this.getAll();
      list.push(user);
      await fs.promises.writeFile(
        __dirname + this.path,
        JSON.stringify(list, null, "\t")
      );
      return user;
    } catch (error) {
      logger.log('error', `could not save the file ${error}`);
    }
  };
}
