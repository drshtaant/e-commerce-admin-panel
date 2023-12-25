import {Decimal} from "@prisma/client/runtime/library";

enum projectTaskTypes {
	PHASE = "Phase",
	/*
		The value of type Module is seems to be stored with a wrong spelling
		in the db. Since the current db is in use with the older system,
		there is nothing we can do about it now. When we phase out the BIT v1
		fixing this can be considered.
	 */
	MODULE = "Modyule",
	TASK = "Task",
}

const costPerLocation = {
	IND: new Decimal("45.00"),
	USA: new Decimal("153.00"),
};

export {projectTaskTypes, costPerLocation};
