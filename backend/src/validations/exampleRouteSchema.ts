import {Joi} from "celebrate";

const greetBodySchema = Joi.object({
	greeting: Joi.string().required().min(10).max(100),
});

export {greetBodySchema};
