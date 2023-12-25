/**
 * Prisma Environment Command Helper Script
 *
 * This script facilitates the execution of Prisma commands within different development environments by leveraging dotenv-cli for environment-specific variable loading. It aims to enhance development workflows by abstracting the complexity of switching between various environments (development, staging, production) when running Prisma commands.
 *
 * Usage:
 * The script expects an initial argument specifying the target environment ('dev', 'staging', 'prod') followed by any Prisma CLI command(s).
 *
 * Example:
 *  $ yarn prisma dev generate
 *  $ yarn prisma staging push
 *  $ yarn prisma prod migrate deploy
 *
 * The above commands demonstrate how the script can initiate Prisma CLI commands under different environment configurations. For instance, 'yarn prisma dev generate' will execute 'prisma generate' using the variables defined in '.env.development'.
 *
 * Behavior:
 * - Validates the provided environment argument.
 * - Loads the corresponding environment variables from the appropriate '.env' file (e.g., '.env.development', '.env.staging', '.env.production').
 * - Executes the Prisma command in the context of the loaded environment variables.
 * - Outputs the command's results to the console, inheriting the parent's stdio streams.
 *
 * Requirements:
 * - The project must be configured with Prisma and have the necessary '.env' files for each environment.
 * - The 'dotenv-cli' package should be installed in the project.
 * - This script should be invoked in a Node.js environment and have permissions to spawn child processes.
 *
 * This approach maintains a clean workspace, avoids the confusion of environment switching, and contributes to more reliable deployment or migration processes.
 */
import {spawn, SpawnOptions} from "child_process";
import path from "path";

// Ensures the script runs from the root of the project.
// This is crucial for accessing files and modules correctly, irrespective of where the script was called from.
process.chdir(path.join(__dirname, ".."));

// Retrieve the list of command-line arguments excluding the first two (reserved for node command and script path).
const args: string[] = process.argv.slice(2);

// Establish a key-value pair linking possible environment inputs with their corresponding .env file names.
const envs: {[key: string]: string} = {
	dev: ".env.development",
	staging: ".env.staging",
	prod: ".env.production",
};

// Shift the arguments to isolate the intended environment (e.g., 'dev', 'staging', 'prod') for this script's run.
const nodeEnv: string | undefined = args.shift();

// Validate the environment input against the keys defined in 'envs'.
// If not valid, it guides the user and safely exits the script without executing further instructions.
if (!nodeEnv || !Object.keys(envs).includes(nodeEnv)) {
	process.stderr.write("Usage: prisma [dev|staging|prod] [prisma-commands]\n");
	process.exit(0);
}

// Match the input with the corresponding .env file, critical for loading the correct environment variables.
const envFile = envs[nodeEnv];

// Construct the command string for dotenv-cli, specifying the .env file and appending the Prisma commands.
// This string is passed directly to the shell for execution.
const dotenvCommand = `dotenv -e ${envFile} -- node_modules/.bin/prisma ${args.join(
	" "
)}`;

// Options for the child process that will execute the command.
// 'stdio: "inherit"' ensures the child process inherits the main process's input/output/error streams.
// 'shell: true' specifies that the command should be run inside of a shell, which allows for using the system's command-line syntax.
const opts: SpawnOptions = {stdio: "inherit", shell: true};

// Execute the constructed command in a new shell process, allowing the script to run commands and use the functionality of the shell.
const child = spawn(dotenvCommand, [], opts);

// Listen for and handle any errors that occur while attempting to start the subprocess, providing clarity and traceability for debugging.
child.on("error", (error) => {
	console.error(`Failed to start subprocess. Error: ${error.message}`);
});

// Upon script completion, output the exit code for clarity. Non-zero codes indicate something went wrong.
child.on("close", (code) => {
	if (code !== 0) {
		console.error(`Process exited with code: ${code}`);
	}
});
