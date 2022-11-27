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
	layer: number;
	color: string;
	hasValue: boolean;
	defaultValue?: number;
	minValue?: number;
	maxValue?: number;
}

export interface ToolBarOption {
	actionName: string;
	icon: string;
	text: string;
	selectable: boolean;
	keys: string[];
}
