import SESSION_ROUTES from '../controllers/session.controller.js';

const sessionRoutesEndpoint = (app) => {
    app.post("/session/login", SESSION_ROUTES.sessionLogin);
    app.post("/session/logout", SESSION_ROUTES.sessionLogout);
    app.get("/session/:id", SESSION_ROUTES.sessionGet);
    app.get("/sessions", SESSION_ROUTES.sessionGetAll);
    app.post("/session/:id", SESSION_ROUTES.sessionCreate);
    app.get("/validate_token", SESSION_ROUTES.sessionValidateToken);
}

export default {
    sessionRoutesEndpoint
};