import COMMENT_ROUTES from '../controllers/comment.controller.js';

const commentRoutesEndpoint = (app) => {
    app.post("/comment", COMMENT_ROUTES.commentCreate);
    app.patch("/comment/:id", COMMENT_ROUTES.commentUpdate);
    app.delete("/comment/:id", COMMENT_ROUTES.commentDelete);
    app.get("/comment/:id", COMMENT_ROUTES.commentGetById);
    app.get("/comments", COMMENT_ROUTES.commentGetAll);
}

export default {
    commentRoutesEndpoint
};