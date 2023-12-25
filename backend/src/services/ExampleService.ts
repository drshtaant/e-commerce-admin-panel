import {iGenericServiceResult} from "@/customTypes/commonServiceTypes";
import {NullableString} from "@/customTypes/commonTypes";
import {httpStatusCodes} from "@/customTypes/networkTypes";
import {iGreetInputDTO} from "@/customTypes/appDataTypes/exampleTypes";

import {exampleServiceErrors} from "@/constants/errors/exampleServiceErrors";

import serviceUtil from "@/util/serviceUtil";

export default class ExampleService {
	public async sayHello(
		uniqueRequestId: NullableString,
		ipAddress: NullableString
	): Promise<iGenericServiceResult<{message: string} | null>> {
		const result = {
			message: `Hello ${ipAddress}, there 👋!`,
		};

		return serviceUtil.buildResult(
			true,
			httpStatusCodes.SUCCESS_OK,
			uniqueRequestId,
			null,
			result
		);
	}

	public async greet(
		uniqueRequestId: NullableString,
		greetingInputDTO: iGreetInputDTO
	): Promise<iGenericServiceResult<{greetingResponse: string} | null>> {
		const {greeting} = greetingInputDTO;

		let greetingResponse: string;

		switch (greeting) {
			case "Good Morning":
				greetingResponse = "Very Good Morning!";
				break;

			case "Good Afternoon":
				greetingResponse = "Good Afternoon!";
				break;

			case "Good Evening":
				greetingResponse = "Good Evening!";
				break;

			case "Good Night":
				greetingResponse = "Good Night, Sweet dreams!";
				break;

			default: {
				greetingResponse = "";
			}
		}

		if (greetingResponse) {
			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				{
					greetingResponse,
				}
			);
		}

		return serviceUtil.buildResult(
			true,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			uniqueRequestId,
			exampleServiceErrors.example.InvalidGreeting,
			null
		);
	}
}
