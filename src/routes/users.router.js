import { Router } from "express";
import logger from "../config/winston.config.js";
import services from "../dao/index.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    let result = await services.usersService.getAll();
    res.send(result);
  } catch (error) {
    logger.log("error", `Error route api users ${error}`);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    let id = req.params.userId;
    let modifiedUser = req.body;
    let result = await services.usersService.update(id, modifiedUser);
    if (!result) return res.send({ message: "User does not exist" });
    res.send({ message: "The user data was successfully modified", modified: true });
  } catch (error) {
    logger.log("error", `Error route api userId ${error}`);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    let id = req.params.userId;
    let result = await services.usersService.getById(id);
    if (!result) return res.send({ message: "User does not exist" });
    res.send(result);
  } catch (error) {
    logger.log("error", `Error in get user from id: ${error}`);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    let id = req.params.userId;
    let result = await services.usersService.deleteById(id);
    if (!result) return res.send({ message: "User does not exist", deleted: false });
    res.send({ message: "deleted user", deleted: true });
  } catch (error) {
    logger.log("error", `Error in get user from id: ${error}`);
  }
});

export default router;
