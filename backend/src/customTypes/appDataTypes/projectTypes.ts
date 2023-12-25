import {Decimal} from "@prisma/client/runtime/library";
import {Prisma} from "@prisma/client";

import {
	GenericNullable,
	NullableNumber,
	NullableString,
	StringArray,
} from "@/customTypes/commonTypes";
import {projectTaskTypes} from "@/constants/projectConstants";

export interface iBaseTaskItem {
	id: string;
	uid: string;
	name: string;
	startDate: NullableString;
	endDate: NullableString;
	duration: NullableNumber;
	linkedTo: NullableString;
	linkedBy: StringArray;
	notes: NullableString;
	hours: NullableNumber;
	status: NullableString;
	type: projectTaskTypes;
}

export interface iTaskItem extends iBaseTaskItem {
	parentId: NullableString;
	allocatedResources: StringArray;
}

export interface iModuleItem extends iBaseTaskItem {
	parentId: NullableString;
	childrenIds: StringArray;
}

export interface iPhaseItem extends iBaseTaskItem {
	childrenIds: StringArray;
}

export interface iAssignee {
	id: string;
	firstName: NullableString;
	middleName: NullableString;
	lastName: NullableString;
	hourlyBillRate: Decimal;
	hourlyCostRate: Decimal;
	estimateResourceId: NullableNumber;
	projectRole: NullableString;
}

export interface iMultiAssignee {
	ids: StringArray;

	items: {
		[key in string]: iAssignee;
	};
}

export interface iResourceAllocation {
	id: string;
	billedHours: Decimal;
	writeOff: Decimal;
	assigneeId: string;
}

export interface iMultiResourceAllocation {
	ids: StringArray;

	items: {
		[key in string]: iResourceAllocation;
	};
}

interface iMultiTask {
	ids: StringArray;

	items: {
		[key in string]: iTaskItem;
	};
}

interface iMultiModule {
	ids: StringArray;

	items: {
		[key in string]: iModuleItem;
	};
}

interface iMultiPhase {
	ids: StringArray;

	items: {
		[key in string]: iPhaseItem;
	};
}

export interface iProjectDetails {
	phases: iMultiPhase;

	modules: iMultiModule;

	tasks: iMultiTask;

	resourceAllocations: iMultiResourceAllocation;

	assignees: iMultiAssignee;
}

export interface iProjectSummary {
	id: string;
	projectName: string;
	details: iProjectDetails;
}

export interface iTaskStatus {
	id: string;
	status: string;
	color: string;
}

export type StatusListType = Array<iTaskStatus>;

export interface iTaskStatusOption {
	id: string;
	status: string;
	color: string;
}

export interface iMultiTaskStatusOption {
	ids: StringArray;

	items: {[key in string]: iTaskStatusOption};
}

export type EstimateDetailsType = Prisma.EstimateGetPayload<{
	include: {
		lineItems: {
			include: {
				resourceAllocation: {
					include: {
						estimateResource: {
							include: {
								employee: {
									include: {
										location: true;
									};
								};
							};
						};
					};
				};
			};
		};
	};
}>;

export type EstimateLineItemType = Prisma.EstimateLineItemGetPayload<{}>;

export interface iTaskStatusIdMap {
	taskUid: NullableString;
	statusId: NullableString;
}

export type EstimateLineStatusMapType = Array<iTaskStatusIdMap>;

export type EstimateResourceDetails = {
	id: NullableNumber;
	employeeId: NullableNumber;
	projectRole: NullableString;
};

export interface iMultiEstimateLineStatusIdMap {
	ids: StringArray;

	items: {[key in string]: iTaskStatusIdMap};
}

export interface iUpdateProjectTaskDTO {
	name: NullableString;
	startDate: NullableString;
	endDate: NullableString;
	linkedTo: NullableString;
	notes: NullableString;
	status: NullableString;
	parentId: NullableString;
	type: GenericNullable<projectTaskTypes>;
}

export interface iUpdateResourceAllocationToAssignee {
	billedHours: Decimal;
	writeOff: Decimal;
	estimateResourceId: String;
}

export interface iUpdateResourceAllocationToAssignees {
	resourceAllocationToAssignee: Array<iUpdateResourceAllocationToAssignee>;
}

export interface iUpdateProjectTaskItem extends iUpdateProjectTaskDTO {
	id: string;
}

export type BulkUpdateProjectTaskDTOType = Array<iUpdateProjectTaskItem>;

export interface iUpdateModuleAndPhaseObjectForHours {
	Modyule: {
		hours: number | null;
		id: number;
	};
	Phase: {
		hours: number | null;
		id: number;
	};
}

interface iItemDetailsForResourceAllocation {
	billedHours: Decimal;
	writeOff: Decimal;
	estimateResourceId: String;
}

export interface iUpdatedHoursItemForResourceAllocation {
	id: number;
	type: string;
	hours: number;
}

export interface iFinalResponseUpdateAssignees {
	[key: string]:
		| iItemDetailsForResourceAllocation
		| iUpdatedHoursItemForResourceAllocation[]
		| undefined;
	updatedHours?: iUpdatedHoursItemForResourceAllocation[];
}
