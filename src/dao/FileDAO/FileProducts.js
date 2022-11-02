import FileContainer from "./FileContainer.js";

export default class FileProduct extends FileContainer{
        constructor() {
            super("/files/products.txt")
        }
};