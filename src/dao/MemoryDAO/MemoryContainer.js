import { nanoid } from "nanoid"; // nanoid to generate random Ids

export default class MemoryContainer {
  constructor() {
    this.data = [];
  }

  getAll = () => {
    return this.data;
  };

  save = (element) => {
    this.data.push(element);
    return element;
  };

  getById = (id) => {
    const item = this.getAll().find((element) => element.id === id);
    if (item !== undefined) {
      return item;
    } else {
      return null;
    }
  };

  deleteById = async (id) => {
    let dataToDelete = this.getById(id);
    let deleted = true;
    if (dataToDelete === null) {
      return (deleted = false);
    } else {
      this.data = this.getAll();
      let index = this.data.findIndex((item) => item.id === id);
      this.data.splice(index, 1);
      return deleted;
    }
  };

  update = async (id, modifiedItem) => {
    let modified = false;
    let product = await this.getById(id);
    if (product === null) {
      return (modified)
    } else {
      modified = true;
      for (const key in product) {
        for (const item in modifiedItem) {
          if (key === item) {
            product[key] = modifiedItem[item];
          }
        }
      }
      return product;
    }
  };
}
