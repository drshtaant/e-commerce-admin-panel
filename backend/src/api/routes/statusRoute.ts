import {RouteType} from "@/customTypes/expressTypes";
import logger from "@/loaders/logger";
import ProjectService from "@/services/ProjectService";
import expressUtil from "@/util/expressUtil";
import {NextFunction, Router} from "express";

const route = Router();
const projectService = new ProjectService();

const statusRoute: RouteType = (apiRouter) => {
	apiRouter.use("/status", route);
	route.get("/getAllStatus", async (req, res, next: NextFunction) => {
		const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
		logger.debug(uniqueRequestId, "Calling project/status endpoint", null);
		try {
			const {httpStatusCode, responseBody} =
				await projectService.getAllStatuses(uniqueRequestId);

			return res.status(httpStatusCode).json(responseBody);
		} catch (error) {
			logger.error(
				uniqueRequestId,
				"Error while calling /status endpoint",
				error
			);

			return next(error);
		}
	});
};

export default statusRoute;
