import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import authMiddleware from './app/middlewares/auth';

const PlanController = require('./app/controllers/PlanController');

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/checkin', CheckinController.index);
routes.get('/student/:id/checkin', CheckinController.store);
routes.get('/student/:id/checkin/list', CheckinController.list);

routes.use(authMiddleware);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

routes.post('/student', StudentController.store);
routes.post('/student/:id', StudentController.update);

export default routes;
