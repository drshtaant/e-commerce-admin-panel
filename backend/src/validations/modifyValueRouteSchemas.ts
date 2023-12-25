import {Joi} from "celebrate";

const projectIdSchema = Joi.string()
	.min(1)
	.max(16)
	.pattern(/^\d+$/)
	.messages({
		"string.pattern.base": `"projectId" should only contain numeric characters.`,
	})
	.label("projectId");

const taskIdSchema = Joi.string()
	.min(1)
	.max(16)
	.pattern(/^\d+$/)
	.messages({
		"string.pattern.base": `"taskId" should only contain numeric characters.`,
	})
	.label("taskId");

const modifyValueSchema = Joi.object({
	projectId: projectIdSchema,
	taskId: taskIdSchema,
});

const modifyValueBodySchema = Joi.object({
	status: Joi.string().required().label("status"),
});

export {modifyValueSchema, modifyValueBodySchema};
