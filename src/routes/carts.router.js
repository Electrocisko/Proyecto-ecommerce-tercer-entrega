import { Router } from "express";
import services from "../dao/index.js";
import { nanoid } from "nanoid";
import logger from "../config/winston.config.js";


let typeOfPersistence = services.persistence;

const router = Router();

router.get("/", async (req, res) => {
  try {
    let allCarts = JSON.stringify(await services.cartsService.getAll());
    logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
    res.end(allCarts);
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

// Add a cart and return the id
router.post("/", async (req, res) => {
  logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
  logger.log('debug',`UserId from Post menu? ${JSON.stringify(req.body.userId)} `)  
  try {
    let newCart = {
      products: [],
      userId: req.body.userId // associate the cart with the user id
    };
    newCart.timestamp = Date.now();
    newCart.id = nanoid(10);
    let cart = await services.cartsService.save(newCart);
    res.status(201).send({
      message: "Carrito agregado",
      cart: cart,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

///////// to delete cart
router.delete("/:cid", async (req, res) => {
  logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
  try {
    let cartID = req.params.cid;
    let cartDelete = await services.cartsService.deleteById(cartID);
    res.status(202).send({
      "Cart Removed": cartDelete,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

///////////To get products from the cart

router.get("/:cid/products", async (req, res) => {
  logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
  try {
    let showList = [];
    let allProducts;
    let cartID = req.params.cid;
    let cart = await services.cartsService.getById(cartID);
    if (cart === null) {
      return res.status(400).send('{ "error" : "non-existent cart"}');
    }
    if (typeOfPersistence === "mongodb") {
      allProducts = await services.productsService.getAll();
      let productsInCart = cart[0].products;
      allProducts.map((item) => {
        productsInCart.forEach((element) => {
          if (element.product === item._id.toString()) {
            showList.push({
              product: item.name,
              productId: item.id.toString(),
              price: item.price,
              stock: item.stock,
              cuantity: element.quantity,
            });
          }
        });
      });
    } else {
      allProducts = await services.productsService.getAll();
      //Here I compare the two arrays and create a new one called showList with the matching products.
      allProducts.map((item) => {
        cart.products.forEach((element) => {
          if (element.product === item.id) {
            showList.push({
              product: item.name,
              productId: item.id,
              price: item.price,
              stock: item.stock,
              cuantity: element.quantity,
            });
          }
        });
      });
    }
    res.status(200).send({
      products: showList,
    });
  } catch (error) {
    res.send({
      Error: error,
    });
  }
});

// ////////////////// To add products to the cart by their product id
router.post("/:cid/products", async (req, res) => {
  logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
  try {
    let productsInCart;
    let newData;
    let cartID = req.params.cid; 
    let addProduct = req.body;
    let cart = await services.cartsService.getById(cartID);
    if (cart === null) {
      return res.status(400).send('{ "error" : "non-existent cart"}');
    }
    let existProduct = await services.productsService.getById(
      addProduct.product
    );
    if (existProduct === null) {
      return res.status(400).send('{"error": "non-existent product');
    }
    if (addProduct.quantity === undefined) {
      addProduct.quantity = 1;
    } //if the amount is not sent by body, it is taken as one
    ///MONGO////
    if (typeOfPersistence === "mongodb") {
      productsInCart = cart[0].products;
      ///////MEMORY Y LOCAL////
    } else {
      productsInCart = cart.products;
      await services.cartsService.deleteById(cartID);
      await services.cartsService.save(cart);
    }
    const prodIndex = productsInCart.findIndex(
      (item) => item.product === addProduct.product
    );
    if (prodIndex === -1) {
      // If there are no products, it is added directly
      productsInCart.push(addProduct); //I update the cart with the added product
    } else {
      let newCuantity =
        productsInCart[prodIndex].quantity + addProduct.quantity;
      addProduct.quantity = newCuantity;
      productsInCart.splice(prodIndex, 1); // I delete the old object and
      productsInCart.push(addProduct); // I push the new updated object
    }
    if (typeOfPersistence === "mongodb") {
      newData = {
        products: productsInCart,
      };
      let updateCart = await services.cartsService.update(cartID, newData);
    } else {
      newData = productsInCart;
      await services.cartsService.deleteById(cartID);
      await services.cartsService.save(cart);
    }
    res.status(201).send({
      cartId: cartID,
      products: newData,
    });
  } catch (error) {
    res.send({
      Error: error,
      Message: 'Error in Post cart'
    });
  }
});

////////////////To delete products from the cart////////////

router.delete("/:cid/products/:pid", async (req, res) => {
  logger.log('info',`request type ${req.method} en route ${req.baseUrl} ${new Date()}`)
  try {
    let productsInCart;
    let productID = req.params.pid;
    let cartID = req.params.cid;
    let cart = await services.cartsService.getById(cartID);
    if (cart === null) {
      return res.status(400).send({
        message: "The cart with that id does not exist",
      });
    }
    //MONGODB//
    if (typeOfPersistence === "mongodb") {
      productsInCart = cart[0].products; // the array from products in cart
      //REST//
    } else {
      productsInCart = cart.products;
    }
    let prodIndex = productsInCart.findIndex(
      (item) => item.product === productID
    );
    if (prodIndex === -1) {
      return res.status(400).send({
        message: "Error the product does not exist in the cart",
      });
    }
    productsInCart.splice(prodIndex, 1); // remove the product from the array
    let newData = {
      products: productsInCart,
    };
    if (typeOfPersistence === "mongodb") {
      let updateCart = await services.cartsService.update(cartID, newData);
    } else {
      await services.cartsService.deleteById(cartID);
      await services.cartsService.save(cart);
    }
    res.status(202).send({
      cartId: cartID,
      message: "deleted product",
    });
  } catch (error) {
    res.send({
      Error: error,
    });
  }
});
export default router;
