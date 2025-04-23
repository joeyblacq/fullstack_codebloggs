import POST_ROUTES from '../controllers/post.controller.js';

const postRoutesEndpoint = (app) => {
    app.post("/post", POST_ROUTES.postCreate);
    app.patch("/post/:id", POST_ROUTES.postUpdate);
    app.delete("/post/:id", POST_ROUTES.postDelete);
    app.get("/post/:id", POST_ROUTES.postGetById);
    app.get("/posts", POST_ROUTES.postsGetAll);
}

export default {
    postRoutesEndpoint
};