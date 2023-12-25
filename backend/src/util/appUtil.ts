import PackageJSON from "../../package.json";

/**
 * Returns whether the app is currently running on the "development"
 * environment or not.
 *
 * @returns isDev
 */
function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

/**
 * Returns the current version from package.json.
 * @returns - The current version.
 */
function getCurrentVersion(): string {
	return PackageJSON.version;
}

export default {
	isDev,

	getCurrentVersion,
};
