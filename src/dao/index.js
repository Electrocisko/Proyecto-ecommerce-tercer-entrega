
const persistence = "mongodb";
let productsService;
let cartsService;
let usersService;

switch (persistence) {
  case "memory":
    const { default: MemProduct } = await import("./MemoryDAO/ProductsDAO.js");
    productsService = new MemProduct();
    const { default: MemCarts } = await import("./MemoryDAO/CartsDAO.js");
    cartsService = new MemCarts();
    break;
  case "localfile":
    const { default: FileProduct } = await import("./FileDAO/FileProducts.js");
    productsService = new FileProduct();
    const { default: FileCarts } = await import("./FileDAO/FileCarts.js");
    cartsService = new FileCarts();
    const { default: FileUser } = await import("./FileDAO/FileUsers.js");
    usersService = new FileUser();
    break;
  case "mongodb":
    const { default: MongoProduct } = await import("./MongoDAO/MongoProducts.js");
    productsService = new MongoProduct();
    const { default: MongoCarts } = await import("./MongoDAO/MongoCarts.js");
    cartsService = new MongoCarts();
    const { default: MongoUser } = await import("./MongoDAO/MongoUsers.js");
    usersService = new MongoUser();
    break;
}

const services = {
  productsService,
  cartsService,
  persistence,
  usersService
};

export default services;
