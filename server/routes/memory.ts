import express, { Router, RequestHandler, Request, Response, NextFunction } from "express";
import * as controllers from "../controllers/memory";
import { check, query } from "express-validator";
import passport from "passport";
import { MEMORY_CONTENT_MIN_LENGTH, MEMORY_TITLE_MAX_LENGTH, MEMORY_CONTENT_MAX_LENGTH } from "../../client/src/shared/constants";

const updateMemoryValidations = [
    check("title", "toast.post.title_empty").not().isEmpty(),
    check("content", "toast.post.content_empty").not().isEmpty(),
    check("title", "toast.memory.title_too_long").isLength({ max: MEMORY_TITLE_MAX_LENGTH }),
    check("content", "toast.memory.content_too_short").isLength({ min: MEMORY_CONTENT_MIN_LENGTH }),
    check("content", "toast.memory.content_too_long").isLength({ max: MEMORY_CONTENT_MAX_LENGTH }),
];

const checkUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    next();
};

const memory: Router = express.Router();
memory.route("/create").post(
    checkUser,
    updateMemoryValidations,
    controllers.create
);
memory.route("/edit").post(
    checkUser,
    [
        check("author", "toast.user.attack_alert")
            .exists()
            .custom((value, { req }) => value === req.user._id.toString()),
        ...updateMemoryValidations
    ],
    controllers.update
);
memory.route("/").get(controllers.read);
memory.route("/remove/:id").get(
    checkUser,
    controllers.remove
);

export default memory;