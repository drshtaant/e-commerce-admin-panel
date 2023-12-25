import {asTypeIServiceError} from "@/customTypes/commonServiceTypes";

const projectServiceErrors = asTypeIServiceError({
	generic: {
		ProjectDoesNotExists: {
			error: "ProjectDoesNotExists",

			message: "Project doesn't exists",
		},

		TaskDoesNotExists: {
			error: "TaskDoesNotExists",

			message: "Task doesn't exists",
		},
		ModuleDoesNotExists: {
			error: "ModuleDoesNotExists",

			message: "Module doesn't exists",
		},
		PhaseDoesNotExists: {
			error: "PhaseDoesNotExists",

			message: "Phase doesn't exists",
		},
	},

	updateProjectTask: {
		ParentTaskDoesNotExists: {
			error: "ParentTaskDoesNotExists",

			message: "Parent task doesn't exists",
		},

		LinkedTaskDoesNotExists: {
			error: "LinkedTaskDoesNotExists",

			message: "Linked task doesn't exists",
		},

		InvalidStartDate: {
			error: "InvalidStartDate",

			message: "Start date is invalid",
		},
		ResourceAllocationTransaction: {
			error: "Transaction Failed ",

			message: "Invalid estimateResourceID",
		},
	},

	bulkUpdateProjectTask: {
		OneOrMoreTasksDoesNotExists: {
			error: "OneOrMoreTasksDoesNotExists",

			message: "One or more tasks doesn't exists in the project",
		},

		OneOrMoreStatusDoesNotExists: {
			error: "OneOrMoreStatusDoesNotExists",

			message: "One or more status doesn't exists in the passed tasks",
		},

		OneOrMoreParentTasksDoesNotExists: {
			error: "OneOrMoreParentTasksDoesNotExists",

			message: "One or more parent tasks doesn't exists in the passed tasks",
		},

		OneOrMoreLinkedTasksDoesNotExists: {
			error: "OneOrMoreLinkedTasksDoesNotExists",

			message: "One or more linked tasks doesn't exists in the passed tasks",
		},
	},

	getStatus: {
		StatusDoesNotExists: {
			error: "StatusDoesNotExists",
			message: "Status doesn't exists",
		},
	},
});

export {projectServiceErrors};
