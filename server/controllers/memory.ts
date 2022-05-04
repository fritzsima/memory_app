import { RequestHandler, Request, Response, NextFunction } from "express";
import MemoryDocument from "../models/Memory/MemoryDocument";
import MemoryCollection from "../models/Memory/MemoryCollection";
import Memory from "../../client/src/models/Memory.d";
import UserDocument from "../models/User/UserDocument";
import UserCollection from "../models/User/UserCollection";
import User from "../../client/src/models/User.d";
import GetMemoriesResponse from "../../client/src/models/response/GetMemoriesResponse.d";
import GetMyMemoriesResponse from "../../client/src/models/response/GetMyMemoriesResponse.d";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import { DEFAULT_PAGE_SIZE } from "../../client/src/shared/constants";

export const create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    const memory: MemoryDocument = new MemoryCollection({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        isPrivate: req.body.isPrivate
    });

    memory
    .save()
    .then((saved: Memory) => {
        res.status(200).json(saved);
    })
    .catch((error: Response) => {
        return next(error);
    });
};

export const update: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    MemoryCollection
    .findById(req.body._id)
    .exec()
    .then((memory: MemoryDocument | null) => {
        if (!memory) {
            return Promise.reject(res.status(404).json({ message: "toast.memory.not_found" }));
        }
        const user: User = req.user as User;
        if (memory.author !== user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        return MemoryCollection.findByIdAndUpdate(req.body._id, {content: req.body.content, title: req.body.title, isPrivate: req.body.isPrivate}).exec();
    })
    .then((updated: Memory | null) => {
        if (!updated) {
            return Promise.reject(res.status(404).json({ message: "toast.memory.not_found" }));
        }
        return res.status(200).json(updated);
    })
    .catch((error: Response) => {
        return next(error);
    });
};

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    MemoryCollection
    .findById(req.params.id)
    .exec()
    .then((memory: MemoryDocument | null) => {
        if (!memory) {
            return Promise.reject(res.status(404).json({ message: "toast.memory.not_found" }));
        }
        const user: User = req.user as User;
        if (memory.author !== user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        return MemoryCollection.findByIdAndRemove(req.params.id).exec();
    })
    .then((removed: Memory | null) => {
        return res.status(200).end();
    })
    .catch((error: Response) => {
        return next(error);
    });
};

export const read: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const latestTime: Date = req.query.latest ? new Date(req.query.latest as string) : new Date(Date.now());
    const pageSize: number = req.query.size ? Number.parseInt(req.query.size as string) : DEFAULT_PAGE_SIZE;

    const findAuthorInUsers = (memory: Memory): Promise<UserDocument | null> => {
        return UserCollection.findById(memory.author).exec();
    };

    const memories: MemoryDocument[] = await MemoryCollection
        .find({ createdAt: { $lt: latestTime.toISOString()}, isPrivate: false })
        .sort({ createdAt: "desc" })
        .limit(pageSize + 1) // Use 1 more requirement for indication of hasMore
        .exec();
    const hasMore: boolean = memories.length === pageSize + 1;
    const promises: Promise<User | undefined>[] = memories.map(async (memory: Memory) => {
        const user: UserDocument | null = await findAuthorInUsers(memory);
        if (!user) {
            return undefined;
        } else {
            return {
                email: user.email,
                _id: user._id.toString()
            } as User;
        }
    });

    const authors: (User | undefined) [] = await Promise.all(promises);
    const authorsDic: {[id: string]: User} = {};
    authors.forEach((author: User | undefined): void => {
        if (author) {
            authorsDic[author._id] = author;
        }
    });
    return res.json({
        data: memories.slice(0, pageSize),
        authors: authorsDic,
        hasMore: hasMore,
    } as GetMemoriesResponse);
};

export const me: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user as User;
    const latestTime: Date = req.query.latest ? new Date(req.query.latest as string) : new Date(Date.now());
    const pageSize: number = req.query.size ? Number.parseInt(req.query.size as string) : DEFAULT_PAGE_SIZE;

    const memories: MemoryDocument[] = await MemoryCollection
        .find({ createdAt: { $lt: latestTime.toISOString()}, author: user._id })
        .sort({ createdAt: "desc" })
        .limit(pageSize + 1) // Use 1 more requirement for indication of hasMore
        .exec();
    const hasMore: boolean = memories.length === pageSize + 1;
    return res.json({
        data: memories.slice(0, pageSize),
        hasMore: hasMore
    } as GetMyMemoriesResponse);
};
