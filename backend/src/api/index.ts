import {Router} from "express";

import exampleRoute from "@/api/routes/exampleRoute";


const getRouter = (): Router => {
	const apiRouter = Router();

	// connecting all api routes
	// sampleRoute(apiRouter);
	exampleRoute(apiRouter);


	return apiRouter;
};

export default getRouter;
