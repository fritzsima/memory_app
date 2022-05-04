import { RequestHandler, Request, Response, NextFunction } from "express";
import User from "../../client/src/models/User.d";

export const test: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log("test");
    return res.status(200).end();
};

export const callback: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.redirect("/");
};

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
    }
    const user: User = req.user as User;
    return res.json(user);
};

export const logout: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.session) {
        delete req.session["user"];
    }
    res.redirect(302, "/");
};