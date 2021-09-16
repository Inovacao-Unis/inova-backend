const express = require("express");
const multer = require('multer');
const routes = express.Router();

const auth = require("./middlewares/auth");

const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const LeaderController = require("./controllers/LeaderController");
const TeamController = require("./controllers/TeamController");
const ActivityController = require("./controllers/ActivityController");
const CategoryController = require("./controllers/CategoryController");
const ChallengeController = require("./controllers/ChallengeController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

routes.get("/check", auth, AuthController.check);
routes.post("/register-email", AuthController.registerEmail);

routes.get("/user", auth, UserController.view);
routes.get("/users", UserController.list);
routes.post("/users", UserController.create);
routes.put("/user/:id", auth, UserController.update);
//routes.delete("/user/:id", UserController.delete);

routes.get("/leader/:id", LeaderController.view);
routes.get("/leaders", LeaderController.list);
routes.post("/leaders", LeaderController.create);
routes.put("/leader/:id", LeaderController.update);
routes.delete("/leader/:id", LeaderController.delete);

routes.get("/team/:id", auth, TeamController.view);
routes.get("/teams", auth, TeamController.list);
routes.post("/teams", auth, TeamController.create);
routes.put("/team/:id", auth, TeamController.update);
routes.delete("/team/:id", auth, TeamController.delete);

routes.get("/activity/:id", ActivityController.view);
routes.get("/activities", ActivityController.list);
routes.post("/activities", ActivityController.create);
routes.put("/activity/:id", ActivityController.update);
routes.delete("/activity/:id", ActivityController.delete);

routes.get("/category/:id", CategoryController.view);
routes.get("/categories", CategoryController.list);
routes.post("/categories", CategoryController.create);
routes.put("/category/:id", CategoryController.update);
routes.delete("/category/:id", CategoryController.delete);

routes.get("/challenge/:id", ChallengeController.view);
routes.get("/challenges", ChallengeController.list);
routes.post("/challenges", ChallengeController.create);
routes.put("/challenge/:id", ChallengeController.update);
routes.delete("/challenge/:id", ChallengeController.delete);


module.exports = routes;
