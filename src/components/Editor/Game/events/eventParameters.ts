export interface LayerVisibilityParameters {
	layerIndex: number;
	visible: boolean;
}

export interface OnValidateParameters {
	message: string;
	color: string;
}

export interface OnTileValueChanged {
	layerIndex: number;
	gridX: number;
	gridY: number;
}
