import passport from "passport";
import MagicLoginStrategy from "passport-magic-login";
import { sendEmail } from "../config/smtp-transporter";
import UserDocument from "../models/User/UserDocument";
import UserCollection from "../models/User/UserCollection";
import User from "../../client/src/models/User";

passport.serializeUser<any, any>((user: any, done: (err: any, id?: any) => void) => {
    done(undefined, user._id);
});

passport.deserializeUser((id: any, done: (err: Error, user: UserDocument) => void) => {
    UserCollection.findById(id, (err: Error, user: UserDocument) => {
        done(err, user);
    });
});

export const magicLogin = new MagicLoginStrategy({
    secret: process.env.MAGIC_LINK_SECRET!,

    // The authentication callback URL
    callbackUrl: "/auth/magiclogin/callback",

    // Called with the generated magic link so you can send it to the user
    sendMagicLink: async (destination, href) => {
        const to = destination;
        const subject = "";
        const content = `Click this link to finish logging in: http://3.22.1.249:3000${href}`;
        await sendEmail(to, subject, content);
    },

    // Once the user clicks on the magic link and verifies their login attempt,
    // you have to match their email to a user record in the database.
    verify: (payload, callback) => {
        // Get or create a user with the provided email from the database
        const email = payload.destination;
        if (!email) {
            return callback(undefined, undefined, "no email");
        }
        UserCollection
        .findOne({ email })
        .then((user) => {
            if (!user) {
                return UserCollection.create({ email });
            }
            return user;
        })
        .then((user: User) => {
            callback(undefined, user);
        })
        .catch(err => {
            callback(err);
        });
    }
});

passport.use(magicLogin);
