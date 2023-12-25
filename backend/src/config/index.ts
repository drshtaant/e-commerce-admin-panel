import dotenv from "dotenv";

import {loggingLevels, serverModes} from "@/constants/serverConstants";

import configUtil from "@/util/configUtil";

// set the default NODE_ENV to "development"
process.env.NODE_ENV = process.env.NODE_ENV || serverModes.DEVELOPMENT;

// loading .env file
const envFile = dotenv.config({
	path: configUtil.getEnvFilePath(),
});

if (envFile.error) {
	throw new Error("⚠️ Couldn't find .env file ⚠️");
}

// setting DATABASE_URL for prisma
process.env.DATABASE_URL = configUtil.constructPrismaDBUrl(
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	process.env.DATABASE_HOST,
	process.env.DATABASE_PORT,
	process.env.DATABASE_NAME
);

export default {
	// Service info
	serviceInfo: {
		name: process.env.SERVICE_NAME,
	},

	// server port
	port: parseInt(process.env.PORT, 10),

	// winston logger configurations
	logging: {
		level: process.env.LOG_LEVEL || loggingLevels.SILLY,
		transports: {
			file: {
				paths: {
					error: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_ERROR_LOG_FILE_NAME}`,
					warn: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_WARN_LOG_FILE_NAME}`,
					info: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_INFO_LOG_FILE_NAME}`,
					http: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_HTTP_LOG_FILE_NAME}`,
					verbose: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_VERBOSE_LOG_FILE_NAME}`,
					debug: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_DEBUG_LOG_FILE_NAME}`,
					silly: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_SILLY_LOG_FILE_NAME}`,
					combined: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_COMBINED_LOG_FILE_NAME}`,
				},
			},
		},
	},

	// api config
	api: {
		prefix: "/api",
	},

	// swagger config
	swagger: {
		port: "4000",

		info: {
			title: "API",
			description: "Awesome API doc",
		},

		routePrefix: "/",
	},

	// SMTP Email Transport config
	emailService: {
		transactionalEmail: {
			smtpHost: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_HOST,
			smtpPort: Number(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_PORT),
			smtpSecure: Boolean(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_SECURE),
			smtpUsername: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_USERNAME,
			smtpFromAddress:
				process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_FROM_ADDRESS,
			smtpPassword: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_PASSWORD,
		},

		marketingEmail: {
			smtpHost: process.env.EMAIL_SERVICE_MARKETING_SMTP_HOST,
			smtpPort: Number(process.env.EMAIL_SERVICE_MARKETING_SMTP_PORT),
			smtpSecure: Boolean(process.env.EMAIL_SERVICE_MARKETING_SMTP_SECURE),
			smtpUsername: process.env.EMAIL_SERVICE_MARKETING_SMTP_USERNAME,
			smtpFromAddress: process.env.EMAIL_SERVICE_MARKETING_SMTP_FROM_ADDRESS,
			smtpPassword: process.env.EMAIL_SERVICE_MARKETING_SMTP_PASSWORD,
		},
	},
};
