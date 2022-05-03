import { RequestHandler, Request, Response, NextFunction } from "express";

export const test: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log("test");
    return res.status(200).end();
};

export const callback: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.redirect("/");
};