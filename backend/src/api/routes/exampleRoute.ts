import {NextFunction, Router} from "express";
import {Segments, celebrate} from "celebrate";

import logger from "@/loaders/logger";

import ExampleService from "@/services/ExampleService";

import expressUtil from "@/util/expressUtil";

import {RouteType, iRequest, iResponse} from "@/customTypes/expressTypes";
import {iGreetInputDTO} from "@/customTypes/appDataTypes/exampleTypes";

import {greetBodySchema} from "@/validations/exampleRouteSchema";

const route = Router();
const exampleService = new ExampleService();

const exampleRoute: RouteType = (apiRouter) => {
	apiRouter.use("/example", route);

	/**
	 * @swagger
	 * /example:
	 *   get:
	 *     description: Make the Server say Hello to you!
	 *     responses:
	 *       200:
	 *         description: Message
	 *       500:
	 *         description: Sample Server Error
	 */
	route.get(
		"/",

		async (
			req: iRequest<void>,
			res: iResponse<{message: string}>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Calling /example/ endpoint", {
				requestBody: req.body,
			});

			try {
				const ipAddress = expressUtil.getClientIp(req);

				const {httpStatusCode, responseBody} = await exampleService.sayHello(
					uniqueRequestId,
					ipAddress
				);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(uniqueRequestId, "Error in /example/ endpoint", error);

				return next(error);
			}
		}
	);

	route.post(
		"/",
		celebrate({
			[Segments.BODY]: greetBodySchema,
		}),
		async (
			req: iRequest<iGreetInputDTO>,
			res: iResponse<{greetingResponse: string}>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Calling POST: /example/ endpoint", {
				requestBody: req.body,
			});

			try {
				const {body} = req;

				const {httpStatusCode, responseBody} = await exampleService.greet(
					uniqueRequestId,
					body
				);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error in POST: /example/ endpoint",
					error
				);

				return next(error);
			}
		}
	);
};

export default exampleRoute;
