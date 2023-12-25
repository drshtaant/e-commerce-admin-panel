import express from "express";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

import config from "@/config";

import appUtil from "@/util/appUtil";

const swaggerOptions: swaggerJSDoc.Options = {
	definition: {
		openapi: "3.0.0",

		info: {
			title: config.swagger.info.title,

			version: appUtil.getCurrentVersion(),

			description: config.swagger.info.title,
		},

		servers: [
			{
				url: `http://localhost:${config.port}${config.api.prefix}`,
				description: "Local server",
			},
		],
	},

	apis: ["./src/api/routes/exampleRoute.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const loadSwagger = (): void => {
	const swaggerApp = express();

	swaggerApp.use(
		config.swagger.routePrefix,
		swaggerUIExpress.serve,
		swaggerUIExpress.setup(swaggerSpec)
	);

	swaggerApp.listen(config.swagger.port, () => {
		console.log(`Swagger server is running on port ${config.swagger.port}`);
	});
};

export default loadSwagger;
