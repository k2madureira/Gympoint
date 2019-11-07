import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/student', StudentController.store);

routes.use(authMiddleware);

routes.post('/student/:id', StudentController.update);

export default routes;
