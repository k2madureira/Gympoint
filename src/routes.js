import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const PlanController = require('./app/controllers/PlanController');

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/student', StudentController.store);

routes.use(authMiddleware);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/student/:id', StudentController.update);

export default routes;
