import {Router} from "express";

import exampleRoute from "@/api/routes/exampleRoute";
import projectRoute from "@/api/routes/projectRoute";
import statusRoute from "./routes/statusRoute";

const getRouter = (): Router => {
	const apiRouter = Router();

	// connecting all api routes
	// sampleRoute(apiRouter);
	exampleRoute(apiRouter);
	projectRoute(apiRouter);
	statusRoute(apiRouter);

	return apiRouter;
};

export default getRouter;
