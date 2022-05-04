import express, { Router } from "express";
import passport from "passport";
import * as controllers from "../controllers/auth";
import { magicLogin } from "../config/passport-strategy";

const auth: Router = express.Router();
auth.route("/magiclogin").post(magicLogin.send);
auth.route("/magiclogin/callback").get(passport.authenticate("magiclogin"), controllers.callback);
auth.route("/authenticate").post(controllers.authenticate);
auth.route("/logout").post(controllers.logout);

// auth.route("/test").get(passport.authenticate("magiclogin"), controllers.test);

export default auth;
