import {Joi} from "celebrate";
import {uuidv4Schema} from "./genericSchemas";

const projectIdSchema = Joi.string()
	.min(1)
	.max(16)
	.pattern(/^\d+$/) // ensures only numeric values inside the string
	.messages({
		"string.pattern.base": `"projectId" should only contain numeric characters.`,
	})
	.label("projectId");

const taskIdSchema = Joi.string()
	.min(1)
	.max(16)
	.pattern(/^\d+$/) // ensures only numeric values inside the string
	.messages({
		"string.pattern.base": `"taskId" should only contain numeric characters.`,
	})
	.label("taskId");

const getProjectSummaryByIdParamSchema = Joi.object({
	projectId: projectIdSchema,
});

const updateProjectTaskByIdParamSchema = Joi.object({
	projectId: projectIdSchema,
	taskId: taskIdSchema,
});

const updateProjectTaskBodySchema = Joi.object({
	name: Joi.string().max(200).optional(),
	startDate: Joi.date().iso().optional(),
	endDate: Joi.date().iso().optional(),
	linkedTo: Joi.string().optional().allow(""),
	notes: Joi.string().max(500).optional(),
	status: uuidv4Schema.optional(),
	parentId: Joi.string().optional(),
	type: Joi.string().valid("Task", "Module", "Phase").optional(),
}).or(
	"name",
	"startDate",
	"endDate",
	"linkedTo",
	"notes",
	"status",
	"parentId",
	"type"
);

const updateResourceAllocationToAssigneeSchema = Joi.array().items(
	Joi.object({
		billedHours: Joi.string().required(),
		writeOff: Joi.string().required(),
		estimateResourceId: Joi.string().required(),
	})
);

const updateProjectTaskInBulkBodySchema = Joi.array()
	.items(
		updateProjectTaskBodySchema.keys({id: taskIdSchema.label("id").required()})
	)
	.min(1);

export {
	getProjectSummaryByIdParamSchema,
	updateProjectTaskByIdParamSchema,
	updateProjectTaskBodySchema,
	updateResourceAllocationToAssigneeSchema,
	updateProjectTaskInBulkBodySchema,
};
