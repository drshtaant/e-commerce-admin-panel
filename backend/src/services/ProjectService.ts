import {Prisma} from "@prisma/client";
import moment from "moment-timezone";

import {prisma} from "@/prisma/prismaClient";

import {iGenericServiceResult} from "@/customTypes/commonServiceTypes";
import {
	NullableNumber,
	NullableString,
	StringArray,
} from "@/customTypes/commonTypes";
import {httpStatusCodes} from "@/customTypes/networkTypes";
import {
	BulkUpdateProjectTaskDTOType,
	EstimateDetailsType,
	EstimateLineItemType,
	EstimateLineStatusMapType,
	EstimateResourceDetails,
	StatusListType,
	iBaseTaskItem,
	iFinalResponseUpdateAssignees,
	iModuleItem,
	iMultiEstimateLineStatusIdMap,
	iMultiTaskStatusOption,
	iPhaseItem,
	iProjectDetails,
	iProjectSummary,
	iTaskItem,
	iUpdateModuleAndPhaseObjectForHours,
	iUpdateProjectTaskDTO,
	iUpdateResourceAllocationToAssignee,
} from "@/customTypes/appDataTypes/projectTypes";

import {projectServiceErrors} from "@/constants/errors/projectServiceErrors";
import {
	costPerLocation as costRatePerLocation,
	projectTaskTypes,
} from "@/constants/projectConstants";
import {locationIds} from "@/constants/locationConstants";

import serviceUtil from "@/util/serviceUtil";
import hashObjectUtil from "@/util/hashObjectUtil";
import projectUtil from "@/util/projectUtil";
import securityUtil from "@/util/securityUtil";
import {Decimal} from "@prisma/client/runtime/library";

export default class ProjectService {
	/**
	 * Fetches and constructs a project summary based on the provided project ID.
	 *
	 * This function retrieves the project estimate details using the given project ID
	 * and calculates a summary containing information such as total revenue, total hours,
	 * and total cost for the project. The summary also includes detailed information about
	 * tasks, modules, phases, and assignees associated with the project.
	 *
	 * The function computes the total revenue by accumulating the product of hourly rates and
	 * billed hours for each resource allocation. Total hours are aggregated only for line items
	 * of the type 'PHASE'. The total cost is currently a placeholder and needs to be computed.
	 *
	 * If the project estimate details are found, a detailed project summary is returned encapsulated
	 * in a service result structure. Otherwise, an appropriate error response is returned.
	 *
	 * @param uniqueRequestId - A nullable unique request ID for tracing or debugging purposes.
	 * @param projectId - The ID of the project for which the summary is required.
	 *
	 * @returns A promise that resolves to a service result containing the project summary. The result
	 *          provides details about the success or failure of the operation, potential error messages,
	 *          and the actual project summary data.
	 */
	public async getProjectSummaryById(
		uniqueRequestId: NullableString,
		projectId: string
	): Promise<iGenericServiceResult<iProjectSummary>> {
		const numericProjectId = Number(projectId);

		const estimateDetails = await prisma.estimate.findUnique({
			where: {id: numericProjectId},
			include: {
				lineItems: {
					where: {
						resourceAllocation: {},
					},
					orderBy: {
						id: "asc",
					},
					include: {
						resourceAllocation: {
							include: {
								estimateResource: {
									include: {
										employee: {
											include: {
												location: {
													select: {
														id: true,
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		/*
	Fetches the estimateResource Id,  employee id, and project role from EstimateResourceTable
	*/
		const fetchEstimateResourceDetails = await prisma.estimateResource.findMany(
			{
				where: {estimateId: numericProjectId},
				select: {id: true, employeeId: true, projectRole: true},
			}
		);

		const estimateLineItemStatusMap: EstimateLineStatusMapType =
			await prisma.estimateLineItemStatusMap.findMany({
				where: {
					estimateId: numericProjectId,
				},
				select: {
					taskUid: true,
					statusId: true,
				},
			});

		if (estimateDetails) {
			const projectDetails = this.buildProjectDetails(
				estimateDetails,
				estimateLineItemStatusMap,
				fetchEstimateResourceDetails
			);

			const eventDetails: iProjectSummary = {
				id: projectId,
				projectName: estimateDetails.projectName || "",
				details: projectDetails,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				eventDetails
			);
		}

		/**
		 * No project found with the passed projectId.
		 * Returning project not found error.
		 */
		return serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
			uniqueRequestId,
			projectServiceErrors.generic.ProjectDoesNotExists
		);
	}

	public async getAllStatuses(
		uniqueRequestId: NullableString
	): Promise<iGenericServiceResult<iMultiTaskStatusOption>> {
		const statusList: StatusListType = await prisma.statusType.findMany({
			select: {
				id: true,
				status: true,
				color: true,
			},
		});

		if (statusList) {
			const normalizedTaskStatusOptions =
				this.normalizeTaskStatusOptions(statusList);

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				normalizedTaskStatusOptions
			);
		}

		/**
		 * No project found with the passed projectId.
		 * Returning project not found error.
		 */
		return serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
			uniqueRequestId,
			projectServiceErrors.getStatus.StatusDoesNotExists
		);
	}

	/**
	 * Updates the task with the provided data.
	 *
	 * @param uniqueRequestId - A nullable unique request ID for tracing or debugging purposes.
	 * @param projectId - The ID of the project to which the task belongs.
	 * @param taskId - The ID of the task to update.
	 * @param updateProjectTaskDTO - The DTO containing the task update data.
	 *
	 * @returns A promise that resolves to a service result. The result
	 *          provides details about the success or failure of the operation, potential error messages.
	 */
	public async updateProjectTask(
		uniqueRequestId: NullableString,
		projectId: string,
		taskId: string,
		updateProjectTaskDTO: iUpdateProjectTaskDTO
	): Promise<iGenericServiceResult<void>> {
		// Array of prisma queries to be executed in a single transaction at the end.
		const prismaQueries = [];

		const numericProjectId = Number(projectId);
		const numericTaskId = Number(taskId);

		/**
		 * Check whether the project exists or not.
		 */
		const projectExists = await prisma.estimate.findUnique({
			where: {id: numericProjectId},
		});

		if (!projectExists) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
				uniqueRequestId,
				projectServiceErrors.generic.ProjectDoesNotExists
			);
		}

		/**
		 * Check whether the task exists or not.
		 */
		const taskExists = await prisma.estimateLineItem.findUnique({
			where: {id: numericTaskId, estimateId: numericProjectId},
		});

		if (!taskExists || !taskExists.uid) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
				uniqueRequestId,
				projectServiceErrors.generic.TaskDoesNotExists
			);
		}

		const updateProjectTaskObject =
			projectUtil.mergeTaskUpdateObjectWithDefaults(updateProjectTaskDTO);

		/**
		 * Check whether the status exists or not if the status is provided.
		 */
		if (updateProjectTaskObject.status) {
			const newStatusId = updateProjectTaskObject.status;
			const statusExists = await prisma.statusType.findUnique({
				where: {id: newStatusId},
			});

			if (!statusExists) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					projectServiceErrors.getStatus.StatusDoesNotExists
				);
			}
			/**
			 * Check whether the status is already set to the same status or not.
			 * If it is already set to the same status then skip the update.
			 * If it is not set to the same status then update the status.
			 */
			prismaQueries.push(
				prisma.estimateLineItemStatusMap.upsert({
					where: {
						task_uid_estimate_id_unique: {
							taskUid: taskExists.uid,
							estimateId: numericProjectId,
						},
					},
					update: {
						statusId: updateProjectTaskObject.status,
						updatedAt: moment().utc().toDate(),
					},
					create: {
						id: securityUtil.generateUUID(),
						estimateId: numericProjectId,
						taskUid: taskExists.uid,
						statusId: updateProjectTaskObject.status,
						createdAt: moment().utc().toDate(),
						updatedAt: moment().utc().toDate(),
					},
				})
			);
		}

		let parentTask = null;
		/**
		 * Check whether a task with the parent id exists or not if the parentId is provided.
		 */
		if (updateProjectTaskObject.parentId) {
			parentTask = await prisma.estimateLineItem.findUnique({
				where: {
					id: Number(updateProjectTaskObject.parentId),
					estimateId: numericProjectId,
				},
			});

			if (!parentTask) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					projectServiceErrors.updateProjectTask.ParentTaskDoesNotExists
				);
			}
		}

		let linkedTask = null;
		/**
		 * Check whether a task with the linkedTo id exists or not if the linkedTo is provided.
		 */
		if (updateProjectTaskObject.linkedTo?.length) {
			linkedTask = await prisma.estimateLineItem.findUnique({
				where: {
					uid_estimateId_unique: {
						uid: updateProjectTaskObject.linkedTo,
						estimateId: numericProjectId,
					},
				},
			});

			if (!linkedTask) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					projectServiceErrors.updateProjectTask.LinkedTaskDoesNotExists
				);
			}
		}

		/**
		 * Check whether the startDate is not before the endDate of the linked task
		 * if the linkTo is provided or in the db and the startDate is provided
		 */
		if (updateProjectTaskObject.linkedTo || taskExists.linkedTo) {
			if (!linkedTask) {
				linkedTask = await prisma.estimateLineItem.findUnique({
					where: {
						uid_estimateId_unique: {
							uid: taskExists.linkedTo as string,
							estimateId: numericProjectId,
						},
					},
				});
			}

			if (
				linkedTask &&
				updateProjectTaskObject.startDate &&
				linkedTask.endDate
			) {
				const mTaskStartDate = moment(updateProjectTaskObject.startDate).utc();
				const mLinkedTaskEndDate = moment(linkedTask.endDate).utc();

				if (mTaskStartDate.isBefore(mLinkedTaskEndDate, "days")) {
					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						uniqueRequestId,
						projectServiceErrors.updateProjectTask.InvalidStartDate
					);
				}
			}
		}

		/**
		 * Check whether the startDate is not before the endDate of the parent task
		 * if the parentId is provided or in the db and the startDate is provided
		 */
		if (updateProjectTaskObject.parentId || taskExists.parentId) {
			if (!parentTask) {
				parentTask = await prisma.estimateLineItem.findUnique({
					where: {
						id: Number(updateProjectTaskObject.parentId || taskExists.parentId),
						estimateId: numericProjectId,
					},
				});
			}

			if (
				parentTask &&
				updateProjectTaskObject.startDate &&
				parentTask.startDate
			) {
				const mTaskStartDate = moment(updateProjectTaskObject.startDate).utc();
				const mParentTaskStartDate = moment(parentTask.startDate).utc();

				if (mTaskStartDate.isBefore(mParentTaskStartDate, "days")) {
					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						uniqueRequestId,
						projectServiceErrors.updateProjectTask.InvalidStartDate
					);
				}
			}
		}

		/**
		 * Check whether the endDate is not before the startDate of the task itself
		 * if the startDate is provided or in the db and the endDate is provided or
		 * in the db. If none of the startDate or endDate is provided then skip the check.
		 */
		if (
			(updateProjectTaskObject.startDate && taskExists.endDate) ||
			(updateProjectTaskObject.endDate && taskExists.startDate)
		) {
			const taskStartData =
				updateProjectTaskObject.startDate || taskExists.startDate;
			const taskEndData = updateProjectTaskObject.endDate || taskExists.endDate;

			const mTaskStartDate = moment(taskStartData).utc();
			const mTaskEndDate = moment(taskEndData).utc();

			if (mTaskStartDate.isAfter(mTaskEndDate, "days")) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					projectServiceErrors.updateProjectTask.InvalidStartDate
				);
			}
		}

		/**
		 * Build the update data object based on the provided update object.
		 */
		const cleanedUpdateProjectTaskObject = hashObjectUtil.cleanObject({
			...updateProjectTaskObject,
			// Remove the 'status' property from the update object as it's handled separately.
			status: undefined,
		});

		/**
		 * Update the task with the provided data.
		 */
		prismaQueries.push(
			prisma.estimateLineItem.update({
				where: {id: numericTaskId},
				data: {
					...(cleanedUpdateProjectTaskObject as Prisma.EstimateLineItemUncheckedUpdateInput),
					updatedAt: moment().utc().toDate(),
				},
			})
		);

		// Execute all the prisma queries in a single transaction.
		await prisma.$transaction(prismaQueries);

		return serviceUtil.buildResult(
			true,
			httpStatusCodes.SUCCESS_OK,
			uniqueRequestId,
			null
		);
	}

	public async updateResourceAllocationAssignees(
		uniqueRequestId: NullableString,
		projectId: string,
		taskId: string,
		updateResourceAllocationAssigneesDTO: Array<iUpdateResourceAllocationToAssignee>
	): Promise<iGenericServiceResult<iFinalResponseUpdateAssignees>> {
		const numericProjectId = Number(projectId);
		const numericTaskId = Number(taskId);

		/**
		 * Check whether the project exists or not.
		 */
		const projectExists = await prisma.estimate.findUnique({
			where: {id: numericProjectId},
		});

		if (!projectExists) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
				uniqueRequestId,
				projectServiceErrors.generic.ProjectDoesNotExists
			);
		}

		/**
		 * Check whether the task exists or not.
		 */
		const taskExists = await prisma.estimateLineItem.findUnique({
			select: {
				parentId: true,
				type: true,
				hours: true,
			},
			where: {id: numericTaskId, estimateId: numericProjectId},
		});

		if (!taskExists) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
				uniqueRequestId,
				projectServiceErrors.generic.TaskDoesNotExists
			);
		}

		//check for moduleExists for the task and getHours for that id
		let moduleHours: number | null | undefined = null;
		let phaseHours: number | null | undefined = null;

		const updateModuleAndPhaseObject: iUpdateModuleAndPhaseObjectForHours = {
			Modyule: {
				hours: 0,
				id: 0,
			},
			Phase: {
				hours: 0,
				id: 0,
			},
		};

		if (taskExists) {
			//check if module exist by taking parentId of task and select type, hours, id and parentID
			const moduleExists = await prisma.estimateLineItem.findUnique({
				select: {
					parentId: true,
					type: true,
					hours: true,
					id: true,
				},
				where: {
					id: Number(taskExists.parentId),
					estimateId: numericProjectId,
				},
			});
			if (!moduleExists) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
					uniqueRequestId,
					projectServiceErrors.generic.ModuleDoesNotExists
				);
			}

			//check if moduleExists has Phase as Parent
			if (moduleExists.parentId && moduleExists.type === "Modyule") {
				moduleHours = (moduleExists?.hours ?? 0) - (taskExists?.hours ?? 0);

				//insert the parentId as key and hours as value, this would be used to update the hours for module in estimate_line_item table
				// in the object updateModuleAndPhaseObject, if moduleExists.type is Modyule, insert the corresponding hours
				updateModuleAndPhaseObject[moduleExists.type] = {
					hours: moduleHours,
					id: moduleExists.id,
				};

				//check for PhaseExists for the task and getHours for that id

				const phaseExists = await prisma.estimateLineItem.findUnique({
					select: {
						parentId: true,
						type: true,
						hours: true,
						id: true,
					},
					where: {
						id: Number(moduleExists.parentId),
						estimateId: numericProjectId,
					},
				});
				if (!phaseExists) {
					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
						uniqueRequestId,
						projectServiceErrors.generic.PhaseDoesNotExists
					);
				}

				if (phaseExists.parentId == null && phaseExists.type === "Phase") {
					phaseHours = (phaseExists?.hours ?? 0) - (taskExists?.hours ?? 0);
					updateModuleAndPhaseObject[phaseExists.type] = {
						hours: phaseHours,
						id: phaseExists.id,
					};
				}
			}
		}

		//batchInsertUpdateAndDelete function, takes array, deletes all records that belong to TaskID, and inserts record for estimateResourceID in ResourceAllocation Table
		//update plannedHours for taskID in estimateLineItem table
		//updates plannedHours for Module and Phase related to taskID in estimateLineItem table
		async function batchInsertUpdateAndDelete(
			dataReceived: Array<iUpdateResourceAllocationToAssignee>,
			hours: number,
			updateArrayForPhaseAndModuleHours: {
				id: number;
				type: string;
				hours: number;
			}[]
		): Promise<Prisma.BatchPayload> {
			const result = await prisma.$transaction(async (tx) => {
				// Delete

				await tx.resourceAllocation.deleteMany({
					where: {
						estimateLineItemId: Number(taskId),
					},
				});

				console.log(`deletion occurred for ${taskId}`);
				//insert

				const createManyResult = await tx.resourceAllocation.createMany({
					data: dataReceived.map((item) => {
						return {
							estimateResourceId: Number(item.estimateResourceId),
							billedHours: new Decimal(item.billedHours),
							writeOff: new Decimal(item.writeOff),
							estimateLineItemId: Number(taskId),
							createdAt: moment().utc().toDate(),
							updatedAt: moment().utc().toDate(),
						};
					}),
				});

				//updateQuery in estimate_line_items, where billed_hours are updated for id (taskId)

				const updateResult = await tx.estimateLineItem.update({
					where: {
						id: Number(taskId),
					},
					data: {
						hours,
						updatedAt: moment().utc().toDate(),
					},
				});

				console.log(`update occurred for ${taskId}`, updateResult);

				//UPDATE QUERY IN estimate_line_items TO UPDATE HOURS ON MODULE AND TASK LEVEL, I.E UPDATE MANY FOR UID'S
				const updateResultsForPhaseAndModule = await Promise.all(
					updateArrayForPhaseAndModuleHours.map(async (item) => {
						const updateResultForPhaseAndModuleRec =
							await tx.estimateLineItem.update({
								where: {
									id: item.id,
								},
								data: {
									hours: item.hours,
									updatedAt: moment().utc().toDate(),
								},
							});
						return updateResultForPhaseAndModuleRec;
					})
				);

				console.log(
					`update occurred for Phase and Module`,
					updateResultsForPhaseAndModule
				);

				return createManyResult;
			});
			return result;
		}

		let totalBilledHours = new Decimal("0.00");
		let totalPlannedHours = new Decimal("0.00");

		updateResourceAllocationAssigneesDTO.forEach((item) => {
			//convert billed hours to Decimal
			const tempBilledHours = new Decimal(item.billedHours);

			//convert writeOff Hours to Decimal
			const tempWriteoff = new Decimal(item.writeOff);

			//totalBilled hours for task
			totalBilledHours = totalBilledHours.add(tempBilledHours);

			//Addition of billed hours and writeoff for task
			const tempPlannedHours = tempBilledHours.add(tempWriteoff);
			totalPlannedHours = totalPlannedHours.add(tempPlannedHours);
		});

		if (
			updateModuleAndPhaseObject.Modyule &&
			updateModuleAndPhaseObject.Phase
		) {
			if (phaseHours !== null) {
				phaseHours += totalPlannedHours.toNumber() as number;
			}

			if (moduleHours !== null) {
				moduleHours += totalPlannedHours.toNumber() as number;
			}

			updateModuleAndPhaseObject.Modyule.hours = moduleHours;
			updateModuleAndPhaseObject.Phase.hours = phaseHours;
		}

		const updateArrayForPhaseAndModuleHours: {
			id: number;
			type: string;
			hours: number;
		}[] = Object.entries(updateModuleAndPhaseObject).map(
			([type, {hours, id}]) => {
				return {
					id,
					type,
					hours,
				};
			}
		);

		const batchResult = await batchInsertUpdateAndDelete(
			updateResourceAllocationAssigneesDTO,
			totalPlannedHours.toNumber(),
			updateArrayForPhaseAndModuleHours
		);

		//const batchResult = null;

		if (!batchResult) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR,
				uniqueRequestId,
				projectServiceErrors.updateProjectTask.ResourceAllocationTransaction
			);
		}
		const dataReceived = updateResourceAllocationAssigneesDTO;

		const eventDetailsAfterTransaction: {
			[key: string]: {
				billedHours: Decimal;
				writeOff: Decimal;
				estimateResourceId: String;
			};
		} = {};

		if (batchResult) {
			console.log(`Batch insert and delete result`, batchResult);

			dataReceived.forEach((item) => {
				if (
					item.estimateResourceId !== null &&
					item.estimateResourceId !== undefined
				) {
					const key = item.estimateResourceId.toString();
					eventDetailsAfterTransaction[key] = item;
				}
			});
		}

		const responseObject: iFinalResponseUpdateAssignees =
			eventDetailsAfterTransaction;

		responseObject.updatedHours = updateArrayForPhaseAndModuleHours;

		return serviceUtil.buildResult(
			true,
			httpStatusCodes.SUCCESS_OK,
			uniqueRequestId,
			null,
			responseObject
		);
	}

	public async updateProjectTaskInBulk(
		uniqueRequestId: NullableString,
		projectId: string,
		bulkUpdateProjectTaskDTO: BulkUpdateProjectTaskDTOType
	): Promise<iGenericServiceResult<void>> {
		// Array of prisma queries to be executed in a single transaction at the end.
		// NOTE: disabled the eslint rule as the prismaQueries array is used to store
		//        prisma query objects and not functions.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const prismaQueries: Array<any> = [];

		const numericProjectId = Number(projectId);

		/*
		 * Check whether the project exists or not.
		 */
		const projectExists = await prisma.estimate.findUnique({
			where: {id: Number(projectId)},
		});

		if (!projectExists) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				projectServiceErrors.generic.ProjectDoesNotExists
			);
		}

		/*
		 * Check whether the tasks exists or not.
		 */
		const tasksExists = await prisma.estimateLineItem.findMany({
			where: {
				id: {
					in: bulkUpdateProjectTaskDTO.map((taskId) => {
						return Number(taskId.id);
					}),
				},
				estimateId: numericProjectId,
			},
		});

		const uidsOfExistingTasks = tasksExists.flatMap((task) => {
			if (task.uid) {
				return task.uid;
			}
			return [];
		});

		if (
			!tasksExists ||
			tasksExists.length !== bulkUpdateProjectTaskDTO.length ||
			uidsOfExistingTasks.length !== bulkUpdateProjectTaskDTO.length
		) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				projectServiceErrors.bulkUpdateProjectTask.OneOrMoreTasksDoesNotExists
			);
		}

		/**
		 * Check whether the status exists or not if the status is provided.
		 */
		const statusIds: {[key in string]: boolean} = {};
		bulkUpdateProjectTaskDTO.forEach((taskId) => {
			if (taskId.status) {
				statusIds[taskId.status] = true;
			}
		});

		const uniqueStatusIds = Object.keys(statusIds);
		const statusExists = await prisma.statusType.findMany({
			where: {
				id: {
					in: uniqueStatusIds,
				},
			},
		});

		if (!statusExists || statusExists.length !== uniqueStatusIds.length) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				projectServiceErrors.bulkUpdateProjectTask.OneOrMoreStatusDoesNotExists
			);
		}

		/**
		 * Check whether the parentId of any task is valid or not if the parentId is provided.
		 */
		const parentIds: {[key in string]: boolean} = {};
		bulkUpdateProjectTaskDTO.forEach((taskId) => {
			if (taskId.parentId) {
				parentIds[taskId.parentId] = true;
			}
		});

		const uniqueParentIds = Object.keys(parentIds);

		const parentTaskExists = await prisma.estimateLineItem.findMany({
			where: {
				id: {
					in: uniqueParentIds.map((parentId) => {
						return Number(parentId);
					}),
				},
				estimateId: numericProjectId,
			},
		});

		if (
			!parentTaskExists ||
			parentTaskExists.length !== uniqueParentIds.length
		) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				projectServiceErrors.bulkUpdateProjectTask.OneOrMoreTasksDoesNotExists
			);
		}

		/**
		 * Check whether the linkedTo of any task is valid or not if the linkedTo is provided.
		 */
		const linkedToIds: {[key in string]: boolean} = {};
		bulkUpdateProjectTaskDTO.forEach((taskId) => {
			if (taskId.linkedTo) {
				linkedToIds[taskId.linkedTo] = true;
			}
		});

		const uniqueLinkedToIds = Object.keys(linkedToIds);

		const linkedTaskExists = await prisma.estimateLineItem.findMany({
			where: {
				uid: {
					in: uniqueLinkedToIds,
				},
				estimateId: numericProjectId,
			},
		});

		if (
			!linkedTaskExists ||
			linkedTaskExists.length !== uniqueLinkedToIds.length
		) {
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				projectServiceErrors.bulkUpdateProjectTask
					.OneOrMoreLinkedTasksDoesNotExists
			);
		}

		const normalizedTaskExists = this.normalizeTasks(tasksExists);
		bulkUpdateProjectTaskDTO.forEach((updateProjectTaskDTO) => {
			const updateProjectTaskObject =
				projectUtil.mergeTaskUpdateObjectWithDefaults(updateProjectTaskDTO);

			const numericTaskId = Number(updateProjectTaskDTO.id);
			const taskExists = normalizedTaskExists.items[numericTaskId];

			if (updateProjectTaskDTO.status) {
				const taskUid = taskExists.uid as string;

				/**
				 * Check whether the status is already set to the same status or not.
				 * If it is already set to the same status then skip the update.
				 * If it is not set to the same status then update the status.
				 */
				prismaQueries.push(
					prisma.estimateLineItemStatusMap.upsert({
						where: {
							task_uid_estimate_id_unique: {
								taskUid,
								estimateId: numericProjectId,
							},
						},
						update: {
							statusId: updateProjectTaskObject.status,
							updatedAt: moment().utc().toDate(),
						},
						create: {
							id: securityUtil.generateUUID(),
							estimateId: numericProjectId,
							taskUid,
							statusId: updateProjectTaskObject.status,
							createdAt: moment().utc().toDate(),
							updatedAt: moment().utc().toDate(),
						},
					})
				);
			}

			/**
			 * Build the update data object based on the provided update object.
			 */
			const cleanedUpdateProjectTaskObject = hashObjectUtil.cleanObject({
				...updateProjectTaskObject,
				// Remove the 'status' property from the update object as it's handled separately.
				status: undefined,
			});

			/**
			 * Update the task with the provided data.
			 */
			prismaQueries.push(
				prisma.estimateLineItem.update({
					where: {id: numericTaskId},
					data: {
						...(cleanedUpdateProjectTaskObject as Prisma.EstimateLineItemUncheckedUpdateInput),
						updatedAt: moment().utc().toDate(),
					},
				})
			);
		});

		// Execute all the prisma queries in a single transaction.
		await prisma.$transaction(prismaQueries);

		return serviceUtil.buildResult(
			true,
			httpStatusCodes.SUCCESS_OK,
			uniqueRequestId,
			null
		);
	}

	/**
	 * Constructs a project details object based on the provided estimate details.
	 *
	 * This function processes the given estimate details to generate a structured
	 * representation of project details. The returned structure contains categorized
	 * lists for tasks, modules, phases, and assignees associated with the project.
	 *
	 * - Each category (tasks, modules, phases) contains:
	 *   - `ids`: An array of unique identifiers.
	 *   - `items`: A dictionary mapping each ID to its respective data.
	 *
	 * - The `assignees` category contains:
	 *   - `ids`: An array of unique employee identifiers.
	 *   - `assignees`: A dictionary mapping each employee ID to the employee's details.
	 *
	 * Note: The function omits the `resourceAllocation` field from each line item
	 * when constructing the project details. Only relevant employee data from
	 * `resourceAllocation` is extracted and included in the `assignees` category.
	 *
	 * @param estimateDetails - The estimate details containing line items,
	 *                          each with potential resource allocations.
	 *
	 * @returns An `iProjectDetails` object containing structured details
	 *          for tasks, modules, phases, and assignees of the project.
	 */
	private buildProjectDetails(
		estimateDetails: EstimateDetailsType,
		estimateLineItemStatusMap: EstimateLineStatusMapType,
		getEstimateResourceId: Array<EstimateResourceDetails>
	): iProjectDetails {
		const projectDetails: iProjectDetails = {
			tasks: {
				ids: [],
				items: {},
			},

			modules: {
				ids: [],
				items: {},
			},

			phases: {
				ids: [],
				items: {},
			},

			resourceAllocations: {
				ids: [],
				items: {},
			},

			assignees: {
				ids: [],
				items: {},
			},
		};

		const taskUidToTaskIdMap: {
			[key in string]: {
				id: string;
				taskType: projectTaskTypes;
			};
		} = {};

		const moduleChildrenMap: {
			[key in string]: StringArray;
		} = {};

		const phaseChildrenMap: {
			[key in string]: StringArray;
		} = {};

		const normalizedEstimateLineItemStatusMap =
			this.normalizeEstimateLineItemStatusIdMap(estimateLineItemStatusMap);

		estimateDetails.lineItems.forEach((lineItem) => {
			let statusId: NullableString = null;

			const taskUid = lineItem.uid;
			if (taskUid) {
				taskUidToTaskIdMap[taskUid] = {
					id: lineItem.id.toString(),
					taskType: String(lineItem.type) as projectTaskTypes,
				};

				const statusIdMap = normalizedEstimateLineItemStatusMap.items[taskUid];

				if (statusIdMap) {
					statusId = statusIdMap.statusId;
				}
			}

			// Constructing line item object without any relation or any unnecessary fields.
			const taskItem: iTaskItem = {
				id: lineItem.id.toString(),
				uid: lineItem.uid || "",
				name: lineItem.name || "",
				startDate:
					(lineItem.startDate && lineItem.startDate.toUTCString()) || null,
				endDate: (lineItem.endDate && lineItem.endDate.toUTCString()) || null,
				duration: lineItem.duration,
				hours: lineItem.hours || null,
				linkedTo: lineItem.linkedTo || null,
				linkedBy: [],
				notes: lineItem.notes || null,
				parentId: (lineItem.parentId && lineItem.parentId.toString()) || null,
				status: statusId,
				type: lineItem.type as projectTaskTypes,
				allocatedResources: [],
			};

			// Building assignees and resourceAllocations
			lineItem.resourceAllocation.forEach((resourceAllocationPerLineItem) => {
				const resourceAllocationId =
					resourceAllocationPerLineItem.id.toString();
				const {billedHours, writeOff, estimateResource} =
					resourceAllocationPerLineItem;

				const billedHoursDecimal =
					(billedHours && new Prisma.Decimal(billedHours)) ||
					new Prisma.Decimal("0.00");
				const writeOffDecimal =
					(writeOff && new Prisma.Decimal(writeOff)) ||
					new Prisma.Decimal("0.00");

				if (estimateResource) {
					const {hourlyRate: hourlyBillRate, employee} = estimateResource;
					const hourlyBillRateDecimal =
						(hourlyBillRate && new Prisma.Decimal(hourlyBillRate)) ||
						new Prisma.Decimal("0");

					if (employee) {
						const employeeId = employee.id.toString();
						const employeeLocation = employee.location;
						let hourlyCostRateDecimal = new Prisma.Decimal("0.00");

						if (employeeLocation) {
							switch (employeeLocation.id) {
								case locationIds.USA:
									hourlyCostRateDecimal = costRatePerLocation.USA;
									break;

								case locationIds.IND:
									hourlyCostRateDecimal = costRatePerLocation.IND;
									break;

								default:
									break;
							}
						}

						/*Normalized resourceId, mapped to get employeeId, resourceId and projectRole*/
						const normalizedGetResourceId: {
							[key: string]: {
								id: NullableNumber;
								employeeId: NullableNumber;
								projectRole: NullableString;
							};
						} = {};

						getEstimateResourceId.forEach((item) => {
							if (item.employeeId !== null && item.employeeId !== undefined) {
								normalizedGetResourceId[item.employeeId] = item;
							}
						});

						projectDetails.resourceAllocations.ids.push(resourceAllocationId);
						projectDetails.resourceAllocations.items[resourceAllocationId] = {
							id: resourceAllocationId,
							assigneeId: employeeId,
							billedHours: billedHoursDecimal,
							writeOff: writeOffDecimal,
						};

						taskItem.allocatedResources.push(resourceAllocationId);

						// Adding assignee to the assignees object if not already added.
						if (!projectDetails.assignees.ids.includes(employeeId)) {
							projectDetails.assignees.ids.push(employeeId);
							projectDetails.assignees.items[employeeId] = {
								id: employeeId,
								firstName: employee.firstName,
								middleName: employee.middleName,
								lastName: employee.lastName,
								hourlyBillRate: hourlyBillRateDecimal,
								hourlyCostRate: hourlyCostRateDecimal,
								estimateResourceId: normalizedGetResourceId[employeeId].id,
								projectRole: normalizedGetResourceId[employeeId].projectRole,
							};
						}
					}
				}
			});

			// Building tasks, modules and tasks
			// eslint-disable-next-line default-case
			switch (lineItem.type) {
				case projectTaskTypes.TASK:
					projectDetails.tasks.ids.push(taskItem.id);
					projectDetails.tasks.items[taskItem.id] = taskItem;
					if (taskItem.parentId) {
						const parentId = String(taskItem.parentId);

						if (!moduleChildrenMap[parentId]) {
							moduleChildrenMap[parentId] = [String(taskItem.id)];
						} else {
							moduleChildrenMap[parentId].push(String(taskItem.id));
						}
					}

					break;

				case projectTaskTypes.MODULE:
					{
						// Clean the taskItem and converting it to iModuleItem
						const taskItemForModule = hashObjectUtil.deleteProps<
							iTaskItem,
							iModuleItem
						>(taskItem, ["allocatedResources"]);

						projectDetails.modules.ids.push(taskItemForModule.id);
						projectDetails.modules.items[taskItemForModule.id] =
							taskItemForModule;

						if (taskItem.parentId) {
							const parentId = String(taskItem.parentId);

							if (!phaseChildrenMap[parentId]) {
								phaseChildrenMap[parentId] = [String(taskItem.id)];
							} else {
								phaseChildrenMap[parentId].push(String(taskItem.id));
							}
						}
					}
					break;

				case projectTaskTypes.PHASE:
					{
						// Clean the taskItem and converting it to iModuleItem
						const taskItemForPhase = hashObjectUtil.deleteProps<
							iTaskItem,
							iPhaseItem
						>(taskItem, ["allocatedResources", "parentId"]);

						projectDetails.phases.ids.push(taskItemForPhase.id);
						projectDetails.phases.items[taskItemForPhase.id] = taskItemForPhase;
					}
					break;
			}
		});

		/**
		 * Closure function to map linkedBy for tasks, modules and phases
		 * @param taskItem
		 */
		function mapLinkedBy(
			taskItem: iTaskItem | iModuleItem | iBaseTaskItem
		): void {
			if (taskItem.linkedTo) {
				const {id: linkedToTaskId, taskType: linkedToTaskType} =
					taskUidToTaskIdMap[taskItem.linkedTo];

				if (linkedToTaskId) {
					if (linkedToTaskType === projectTaskTypes.TASK) {
						const linkedToTaskItem = projectDetails.tasks.items[linkedToTaskId];
						linkedToTaskItem.linkedBy.push(taskItem.id);
					} else if (linkedToTaskType === projectTaskTypes.MODULE) {
						const linkedToModuleItem =
							projectDetails.modules.items[linkedToTaskId];
						linkedToModuleItem.linkedBy.push(taskItem.id);
					} else {
						const linkedToPhaseItem =
							projectDetails.phases.items[linkedToTaskId];
						linkedToPhaseItem.linkedBy.push(taskItem.id);
					}
				}
			}
		}

		// Building linkedBy for tasks
		projectDetails.tasks.ids.forEach((taskId) => {
			const taskItem = projectDetails.tasks.items[taskId];
			mapLinkedBy(taskItem);
		});

		// Building linkedBy for modules
		projectDetails.modules.ids.forEach((moduleId) => {
			const moduleItem = projectDetails.modules.items[moduleId];
			mapLinkedBy(moduleItem);
		});

		// Building linkedBy for phases
		projectDetails.phases.ids.forEach((phaseId) => {
			const phaseItem = projectDetails.phases.items[phaseId];
			mapLinkedBy(phaseItem);
		});

		// Adding module children map to the modules
		projectDetails.modules.ids.forEach((moduleId) => {
			const moduleItem = projectDetails.modules.items[moduleId];
			moduleItem.childrenIds = moduleChildrenMap[moduleId] || [];
		});

		// Adding phase children map to the phases
		projectDetails.phases.ids.forEach((phaseId) => {
			const phaseItem = projectDetails.phases.items[phaseId];
			phaseItem.childrenIds = phaseChildrenMap[phaseId] || [];
		});

		return projectDetails;
	}

	/**
	 * Converts an array of task status objects into a normalized task status option object.
	 *
	 * @param {StatusListType} statusList - The list of task statuses to normalize.
	 * @returns {iMultiTaskStatusOption} An object with 'ids' and 'items' properties where:
	 * - 'ids' is an array of all status ids as string values.
	 * - 'items' is an object mapping each status id to its corresponding task status option.
	 *
	 * @example
	 * const statusList = [
	 *   { id: 1, status: 'In Progress', color: 'blue' },
	 *   { id: 2, status: 'Completed', color: 'green' },
	 * ];
	 * const normalizedOptions = normalizeTaskStatusOptions(statusList);
	 */
	private normalizeTaskStatusOptions(
		statusList: StatusListType
	): iMultiTaskStatusOption {
		// Initialize the return object with default empty structures.
		const multiTaskStatusOption: iMultiTaskStatusOption = {
			ids: [],
			items: {},
		};

		// Iterate over the status list to populate the 'ids' and 'items'.
		statusList.forEach((status) => {
			// Convert the number id to a string representation.
			const idAsString = String(status.id);

			// Add the id to the 'ids' array.
			multiTaskStatusOption.ids.push(idAsString);

			// Add the task status to the 'items' with the string id as its key.
			multiTaskStatusOption.items[idAsString] = {
				id: status.id, // Keep the original number id for the option object.
				status: status.status,
				color: status.color,
			};
		});

		return multiTaskStatusOption;
	}

	private normalizeEstimateLineItemStatusIdMap(
		estimateLineItemStatusMap: EstimateLineStatusMapType
	): iMultiEstimateLineStatusIdMap {
		// Initialize the return object with default empty structures.
		const multiEstimateLineStatusIdMap: iMultiEstimateLineStatusIdMap = {
			ids: [],
			items: {},
		};

		// Iterate over the status list to populate the 'ids' and 'items'.
		estimateLineItemStatusMap.forEach((status) => {
			// Convert the number id to a string representation.
			const idAsString = String(status.taskUid);

			// Add the id to the 'ids' array.
			multiEstimateLineStatusIdMap.ids.push(idAsString);

			// Add the task status to the 'items' with the string id as its key.
			multiEstimateLineStatusIdMap.items[idAsString] = {
				taskUid: status.taskUid,
				statusId: status.statusId,
			};
		});

		return multiEstimateLineStatusIdMap;
	}

	private normalizeTasks = (
		tasks: Array<EstimateLineItemType>
	): {
		ids: Array<string>;
		items: {
			[key: string]: EstimateLineItemType;
		};
	} => {
		const normalizedTasks: {
			ids: Array<string>;
			items: {
				[key: string]: EstimateLineItemType;
			};
		} = {
			ids: [],
			items: {},
		};

		tasks.forEach((task) => {
			const taskId = String(task.id);

			normalizedTasks.ids.push(taskId);
			normalizedTasks.items[taskId] = task;
		});

		return normalizedTasks;
	};
}
