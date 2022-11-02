import { Router } from "express";
import passport from "passport";
import logger from "../config/winston.config.js";
import { upLoader } from "../utils.js";
import jwt from "jsonwebtoken";
import dotenvConfig from "../config/dotenv.config.js";
import fetch from "node-fetch";

const router = new Router();

router.post(
  "/register",
  upLoader.single("imageUrl"),
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/registerfail",
    passReqToCallback: true,
  }),
  async (req, res) => {
    res.send({ status: "succes", payload: req.user });
  }
);

router.get("/registerfail", (req, res) => {
  res.status(400).send({ status: "error", message: "user registration error" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/loginfail",
  }),
  async (req, res) => {
    //I generate a cart associated to the user
    let userId = req.user._id;

    const createCart = (id) => {
      try {
        let data = { userId: id };
        fetch("http://localhost:8080/api/carts", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            //I create the loginUser  to use in the JWT token, I include the user id and the associated cart id
            const loginUser = {
              name: req.user.name,
              email: req.user.email,
              id: req.user._id,
              cartId: data.cart._id,
              admin: req.user.admin,
              imageUrl: req.user.imageUrl,
            };
            
            logger.log(
              "debug",
              `loginuser: ${JSON.stringify(loginUser)} sessions.router`
            );
            const token = jwt.sign(loginUser, dotenvConfig.jwt.SECRET, {
              expiresIn: 600,
            });
            res
              .cookie(dotenvConfig.jwt.COOKIE, token, {
                maxAge: 600000,
                httpOnly: true,
              })
              .send({ status: "logged in" });
          }).catch( (error) => console.log(error))
          
      } catch (error) {
        console.log("Error en el fetch de session router", error);
      }
    };
    createCart(userId);
  }
);

router.get("/loginfail", (req, res) => {
  res.status(400).send({ status: "error", message: "user registration error" });
});

router.get("/logout", async (req, res) => {
  try {
    res.clearCookie(dotenvConfig.jwt.COOKIE).redirect("/login");
  } catch (error) {
    logger.log("error", `logout error: ${error}`);
  }
});

export default router;
