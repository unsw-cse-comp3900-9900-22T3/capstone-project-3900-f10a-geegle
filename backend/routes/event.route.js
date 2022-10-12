import { Router } from 'express';
import { getUpcomingEventsController, getAllEventsController } from '../controllers/event.controller.js'

const eventRouter = Router();

eventRouter.post('/create', (req, res) => {})
eventRouter.post('/:eventId/publish', (req, res) => {})
eventRouter.post('/:eventId/cancel', (req, res) => {})
eventRouter.get('/upcoming', getUpcomingEventsController);
eventRouter.get('/all', getAllEventsController);
eventRouter.post('/:eventId/purchase', (req, res) => {})
eventRouter.get('/guest/:eventId', (req, res) => {});

export default eventRouter;