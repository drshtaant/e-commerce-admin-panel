import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
	const statuses = [
		{
			id: "230899a6-9955-4321-8e35-d1a4dd30d808",
			status: "Open",
			color: "#3388FF",
		},
		{
			id: "f605ca32-9d83-4738-a9bd-5656b17dbc4d",
			status: "In Progress",
			color: "#E7B81F",
		},
		{
			id: "6ba469b4-ed4d-44e1-8e3c-873619825c19",
			status: "Blocked",
			color: "#E33D31",
		},
		{
			id: "06b97d28-6e85-463c-9a74-09e64524fbf3",
			status: "In Review",
			color: "#E29030",
		},
		{
			id: "a344a030-c4ff-4448-8e59-9f83830a703e",
			status: "In QA",
			color: "#CDB0FF",
		},
		{
			id: "c2ba96c2-6886-475a-b974-41607e9b35d2",
			status: "Done",
			color: "#03C072",
		},
		{
			id: "3ec6dfc7-1076-4579-857f-5cd88ab9bff1",
			status: "Killed",
			color: "#808080",
		},
	];

	for (let statusIndex = 0; statusIndex < statuses.length; statusIndex += 1) {
		const status = statuses[statusIndex];

		// eslint-disable-next-line no-await-in-loop
		await prisma.statusType.create({
			data: status,
		});
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
