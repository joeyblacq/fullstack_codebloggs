import USER_CONTROLLER from '../controllers/user.controller.js';

const userRoutesEndpoint = (app) => {
    app.post("/user/register", USER_CONTROLLER.userCreate);
    app.patch("/user/:id", USER_CONTROLLER.userUpdate);
    app.delete("/user/:id", USER_CONTROLLER.userDelete);
    app.get("/user/:id", USER_CONTROLLER.userGetById);
    app.get("/users", USER_CONTROLLER.usersGetAll);
    app.get("/info/:id", USER_CONTROLLER.userGetInfo);
    app.get("/infos", USER_CONTROLLER.usersGetInfo);
}

export default {
    userRoutesEndpoint
};