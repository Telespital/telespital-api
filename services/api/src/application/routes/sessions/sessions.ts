import { makeController, Route, StatusCodes } from 'equipped'
import { SessionsController } from '../../controllers/sessions/sessions'
import { isAuthenticated, isDoctor, isPatient } from '@application/middlewares'

export const sessionsRoutes: Route[] = [
	{
		path: '/sessions/sessions/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.getSessions(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.findSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/',
		method: 'post',
		controllers: [
			isAuthenticated, isPatient,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.createSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/connect',
		method: 'post',
		controllers: [
			isAuthenticated, isDoctor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.connect(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/pay',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.payForSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/description',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.updateDescription(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/prescriptions',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.updatePrescriptions(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/note',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.updateNote(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/close',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.closeSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/cancel',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.cancelSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/rate',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.rateSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/join',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.joinSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/details',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.getSessionDetails(req)
				}
			})
		]
	}
]