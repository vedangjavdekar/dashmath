export interface LayerDetails {
	id: string;
	name: string;
	disabled: boolean;
	visible: boolean;
}

export interface TileDetails {
	id: string;
	name: string;
	boardName: string;
	description: string;
	layer: number;
	color: string;
	hasValue: boolean;
	defaultValue?: number;
	minValue?: number;
	maxValue?: number;
}
