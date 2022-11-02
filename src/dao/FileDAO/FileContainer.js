import fs from "fs";
import __dirname from "../../utils.js";
import logger from "../../config/winston.config.js";
import { nanoid } from "nanoid";


export default class FileContainer {
  constructor (path) {
    this.path = path
  }

  getAll = async () => {
    try {
      if (fs.existsSync(__dirname + this.path)) {
        let data = await fs.promises.readFile(__dirname + this.path, "utf-8");
        return JSON.parse(data);
      } else {
        let data = [];
        return data;
      }
    } catch (error) {
      logger.log('error', `could not read the file ${error}`);
    }
  };

  save = async (item) => {
    try {
      item._id = nanoid(10);
      let list = await this.getAll();
      list.push(item);
      await fs.promises.writeFile(
        __dirname + this.path,
        JSON.stringify(list, null, "\t")
      );
      return item;
    } catch (error) {
      logger.log('error', `could not save the file ${error}`);
    }
  };

  getById = async (id) => {
    try {
      let list = await this.getAll();
      const foundItem = list.find((element) => element.id === id);
      if (foundItem !== undefined) {
        return foundItem;
      } else {
        return null;
      }
    } catch (error) {
      logger.log('error', `Error get by id ${error}`);
    }
  };

  deleteById = async (id) => {
    try {
      let deleteItem;
      let toDelete = await this.getById(id);
      if (toDelete === null) {
        return (deleteItem = false);
      } else {
        let list = await this.getAll();
        let index = await list.findIndex((item) => item.id === id);
        list.splice(index, 1);
        await fs.promises.writeFile(
          __dirname + this.path,
          JSON.stringify(list, null, "\t")
        );
        return (deleteItem = true);
      }
    } catch (error) {
      logger.log('error', `Error deleted by id ${error}`);
    }
  };

  update = async (id, modifiedItem) => {
    try {
      let modified = false;
      let product = await this.getById(id);
      if (product === null) {
        return modified;
      } else {
        modified = true;
        for (const key in product) {
          for (const item in modifiedItem) {
            if (key === item) {
              product[key] = modifiedItem[item];
            }
          }
        }
        let checkDelete = await this.deleteById(id);
        let saveFile = await this.save(product);
        return checkDelete;
      }
    } catch (error) {
      logger.log('error', `Error update  ${error}`);
    }
  };
}
