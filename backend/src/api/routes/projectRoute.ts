import {NextFunction, Router} from "express";
import {Segments, celebrate} from "celebrate";

import logger from "@/loaders/logger";

import ProjectService from "@/services/ProjectService";

import expressUtil from "@/util/expressUtil";

import {
	RouteType,
	iRequestParams,
	iRequestParamsWithBody,
	iResponse,
} from "@/customTypes/expressTypes";
import {
	BulkUpdateProjectTaskDTOType,
	iFinalResponseUpdateAssignees,
	iProjectSummary,
	iUpdateProjectTaskDTO,
	iUpdateResourceAllocationToAssignee,
} from "@/customTypes/appDataTypes/projectTypes";

import {
	getProjectSummaryByIdParamSchema,
	updateProjectTaskBodySchema,
	updateProjectTaskByIdParamSchema,
	updateProjectTaskInBulkBodySchema,
	updateResourceAllocationToAssigneeSchema,
} from "@/validations/projectRouteSchemas";

const route = Router();
const projectService = new ProjectService();

const projectRoute: RouteType = (apiRouter) => {
	apiRouter.use("/project", route);

	route.get(
		"/:projectId",
		celebrate({
			[Segments.PARAMS]: getProjectSummaryByIdParamSchema,
		}),
		async (
			req: iRequestParams<{projectId: string}>,
			res: iResponse<iProjectSummary>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			logger.debug(
				uniqueRequestId,
				"Calling project/:projectId endpoint with params:",
				null,
				{
					requestParams: req.params,
				}
			);

			try {
				const {httpStatusCode, responseBody} =
					await projectService.getProjectSummaryById(
						uniqueRequestId,
						req.params.projectId
					);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error while calling project/:projectId endpoint:",
					error
				);

				return next(error);
			}
		}
	);

	route.patch(
		"/:projectId/bulk-task",
		celebrate({
			[Segments.PARAMS]: getProjectSummaryByIdParamSchema,
			[Segments.BODY]: updateProjectTaskInBulkBodySchema,
		}),
		async (
			req: iRequestParamsWithBody<
				{projectId: string},
				BulkUpdateProjectTaskDTOType
			>,
			res: iResponse<void>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling PATCH:: project/:projectId/bulk-task endpoint with params & body:",
				null,
				{
					requestParams: req.params,
					requestBody: req.body,
				}
			);

			try {
				const {httpStatusCode, responseBody} =
					await projectService.updateProjectTaskInBulk(
						uniqueRequestId,
						req.params.projectId,
						req.body
					);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error while calling PATCH:: project/:projectId/bulk-task endpoint:",
					error
				);

				return next(error);
			}
		}
	);

	route.patch(
		"/:projectId/:taskId/assignees",
		celebrate({
			[Segments.PARAMS]: updateProjectTaskByIdParamSchema,
			[Segments.BODY]: updateResourceAllocationToAssigneeSchema,
		}),
		async (
			req: iRequestParamsWithBody<
				{projectId: string; taskId: string},
				Array<iUpdateResourceAllocationToAssignee>
			>,
			res: iResponse<iFinalResponseUpdateAssignees>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling PATCH:: project/:projectId/:taskId/assignees endpoint with params & body:",
				null,
				{
					requestParams: req.params,
					requestBody: req.body,
				}
			);

			try {
				const {httpStatusCode, responseBody} =
					await projectService.updateResourceAllocationAssignees(
						uniqueRequestId,
						req.params.projectId,
						req.params.taskId,
						req.body
					);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error while calling PATCH:: project/:projectId/:taskId/assignees endpoint:",
					error
				);

				return next(error);
			}
		}
	);

	route.patch(
		"/:projectId/:taskId",
		celebrate({
			[Segments.PARAMS]: updateProjectTaskByIdParamSchema,
			[Segments.BODY]: updateProjectTaskBodySchema,
		}),
		async (
			req: iRequestParamsWithBody<
				{projectId: string; taskId: string},
				iUpdateProjectTaskDTO
			>,
			res: iResponse<void>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling PATCH:: project/:projectId/:taskId endpoint with params & body:",
				null,
				{
					requestParams: req.params,
					requestBody: req.body,
				}
			);

			try {
				const {httpStatusCode, responseBody} =
					await projectService.updateProjectTask(
						uniqueRequestId,
						req.params.projectId,
						req.params.taskId,
						req.body
					);

				return res.status(httpStatusCode).json(responseBody);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error while calling PATCH:: project/:projectId/:taskId endpoint:",
					error
				);

				return next(error);
			}
		}
	);
};

export default projectRoute;
