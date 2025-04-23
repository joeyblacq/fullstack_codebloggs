import './loadEnvironment.js';

import EXPRESS from "express";
const APP = EXPRESS();
const PORT = process.env.PORT || 5050;
import CORS from "cors";
import SESSION from "express-session"
import COOKIE_PARSER from "cookie-parser"

APP.use(EXPRESS.json());
APP.use(CORS());
APP.use(COOKIE_PARSER())
APP.use(SESSION({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

import USER_ROUTES from "./routes/user.routes.js";
import SESSION_ROUTES from "./routes/session.routes.js";
import POST_ROUTES from "./routes/post.routes.js";
import COMMENT_ROUTES from "./routes/comment.routes.js";

USER_ROUTES.userRoutesEndpoint(APP)
SESSION_ROUTES.sessionRoutesEndpoint(APP)
POST_ROUTES.postRoutesEndpoint(APP)
COMMENT_ROUTES.commentRoutesEndpoint(APP)

// start the Express server
APP.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});