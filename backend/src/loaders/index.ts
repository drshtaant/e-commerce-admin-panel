import express from "express";

import logger from "@/loaders/logger";
import loadExpress from "@/loaders/expressLoader";
import loadSwagger from "@/loaders/swaggerLoader";

const loader = async ({
	expressApp,
}: {
	expressApp: express.Application;
}): Promise<void> => {
	// loading express...
	await loadExpress({app: expressApp});
	logger.loggerInstance.info("✅ Express loaded");

	await loadSwagger();
	logger.loggerInstance.info("✅ SwaggerUI loaded");
};

export default loader;
