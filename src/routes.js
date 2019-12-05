import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpController from './app/controllers/HelpController';
import authMiddleware from './app/middlewares/auth';

const PlanController = require('./app/controllers/PlanController');

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/checkin', CheckinController.index);
routes.get('/student/:id/checkin', CheckinController.store);
routes.get('/student/:id/checkin/list', CheckinController.list);
routes.get('/help', HelpController.index);
routes.post('/student/:id/help', HelpController.store);
routes.get('/student/:id/find', HelpController.findId);

/* routes.use(authMiddleware); */

routes.post('/help/:id/answer', HelpController.answer);

routes.get('/plans', authMiddleware, PlanController.index);
routes.post('/plans', authMiddleware, PlanController.store);
routes.put('/plans/:id', authMiddleware, PlanController.update);
routes.delete('/plans/:id', authMiddleware, PlanController.delete);

routes.get('/registration', authMiddleware, RegistrationController.index);
routes.post('/registration', authMiddleware, RegistrationController.store);
routes.put('/registration/:id', authMiddleware, RegistrationController.update);
routes.delete(
  '/registration/:id',
  authMiddleware,
  RegistrationController.delete
);

routes.post('/student', authMiddleware, StudentController.store);
routes.post('/student/:id', authMiddleware, StudentController.update);

export default routes;
