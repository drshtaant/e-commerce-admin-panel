/**
 * Utility function that returns a copy of the object after removing all the properties
 * that have been set to either `undefined` or `null`.
 * @param obj - The object to clean.
 * @returns A cleaned object without any `undefined` or `null` properties.
 */
function cleanObject<T extends object>(obj: T): Partial<T> {
	const result = {} as Partial<T>; // This type assertion informs TypeScript about the nature of 'result'.

	// Here we're checking that each key is actually a key of 'T', which TypeScript enforces for safety.
	Object.keys(obj).forEach((key) => {
		const propertyKey = key as keyof T; // This type assertion allows TypeScript to validate the following line.

		if (typeof obj[propertyKey] !== "undefined" && obj[propertyKey] !== null) {
			result[propertyKey] = obj[propertyKey];
		}
	});

	return result;
}

function deleteProps<SourceType extends object, TargetType extends object>(
	obj: SourceType,
	keysToBeDeleted: (keyof SourceType)[]
): TargetType {
	// Create a shallow copy of the object, as we don't want to modify the original object.
	const newObj = {...obj};

	// Iterate over each key we want to delete.
	keysToBeDeleted.forEach((key) => {
		// Delete each specified key from the new object.
		// We're not checking whether the object actually contains the key as the 'delete' operation
		// will simply do nothing if the key is not present. This is a JavaScript standard behavior.
		delete newObj[key];
	});

	// Return the new object, explicitly asserting the type as 'TargetType'.
	// This assertion informs TypeScript that we know what we're doing and that we claim the new object
	// will adhere to the structure of 'TargetType'.
	return newObj as unknown as TargetType;
}

/**
 * Checks if the value is undefined or not and returns true if it is undefined
 * otherwise returns false.
 * @param value - The value to check.
 * @returns True if the value is undefined, otherwise false.
 */
function isUndefined(value: unknown): boolean {
	return typeof value === "undefined";
}

export default {
	cleanObject,
	deleteProps,
	isUndefined,
};
