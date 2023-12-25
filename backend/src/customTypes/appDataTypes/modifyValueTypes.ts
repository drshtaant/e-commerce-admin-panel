export interface iModifyValueInputDTO {
	id: number;
	uid: string;
	status: string;
	taskId: string;
}

export interface iModifyValueSummary {
	id: number;
	status: string | null;
}
