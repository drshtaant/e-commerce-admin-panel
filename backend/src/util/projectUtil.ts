import {iUpdateProjectTaskDTO} from "@/customTypes/appDataTypes/projectTypes";

/**
 * Merge the update object with the default values.
 *
 * @param updateObject
 * @returns The merged object.
 */
function mergeTaskUpdateObjectWithDefaults(
	updateObject: iUpdateProjectTaskDTO
): iUpdateProjectTaskDTO {
	return {
		name: updateObject.name ?? null,
		startDate: updateObject.startDate ?? null,
		endDate: updateObject.endDate ?? null,
		linkedTo: updateObject.linkedTo ?? null,
		notes: updateObject.notes ?? null,
		status: updateObject.status ?? null,
		parentId: updateObject.parentId ?? null,
		type: updateObject.type ?? null,
	};
}

export default {mergeTaskUpdateObjectWithDefaults};
