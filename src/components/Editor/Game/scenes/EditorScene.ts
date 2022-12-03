import { useEditorStore } from "@/stores/editorStore";
import { useLevelStore } from "@/stores/levelStore";
import { toolBarOptions } from "@/stores/toolBarOptions";
import type { LevelTileData } from "@/types/levelTypes";
import { Scene } from "phaser";
import DashMathEventEmitter from "../events/DashMathEventEmitter";
import { DashMathEvents } from "../events/eventConstants";
import type {
	LayerVisibilityParameters,
	OnValidateParameters,
} from "../events/eventParameters";

export default class EditorScene extends Scene {
	readonly CELL_SIZE = 32;
	readonly TOTAL_WIDTH = 960;
	readonly TOTAL_HEIGHT = 540;

	canInteract: boolean = false;
	editorStore = useEditorStore();
	levelStore = useLevelStore();

	mouse1Down: boolean = false; //Left
	mouse2Down: boolean = false; //Right
	mouse3Down: boolean = false; //Middle Mouse

	cursorTile?: Phaser.GameObjects.Image;

	objectPool: Phaser.GameObjects.Container[] = [];
	debugText?: Phaser.GameObjects.Text;
	editingTile: boolean = false;

	constructor() {
		super({ key: "EditorScene" });
	}

	setupEventCallbacks() {
		const eventEmitter = DashMathEventEmitter.getInstance();

		eventEmitter.on(
			DashMathEvents.CHANGE_LAYER_VISIBILITY,
			this.onChangeLayerVisibility,
			this
		);

		eventEmitter.on(DashMathEvents.ON_VALIDATE, this.onValidateLevel, this);
		eventEmitter.on(DashMathEvents.CLEAR_LEVEL, this.onClearLevel, this);
		eventEmitter.on(
			DashMathEvents.ON_TILE_VALUE_CHANGED,
			this.onEditTileValue,
			this
		);
		eventEmitter.on(
			DashMathEvents.TOOL_MODE_CHANGED,
			this.onToolModeChanged,
			this
		);
	}

	getGridCoordinates(pointerX: number, pointerY: number) {
		const gridX =
			this.CELL_SIZE * (0.5 + Math.floor(pointerX / this.CELL_SIZE));
		const gridY =
			this.CELL_SIZE * (0.5 + Math.floor(pointerY / this.CELL_SIZE));

		this.debugText?.setText(`X: ${gridX}, Y:${gridY}`).setColor("#232323");
		return { gridX, gridY };
	}

	getFirstDeadOrCreate() {
		let tile = this.objectPool?.find((gameObj) => !gameObj.active);
		if (tile === undefined) {
			tile = this.add.container(0, 0);
			const img = this.add
				.image(0, 0, "tile")
				.setName("tileBG")
				.setOrigin(0.5, 0.5);
			const text = this.add
				.text(0, 0, "")
				.setName("tileText")
				.setOrigin(0.5, 0.5);
			tile.add([img, text]);
			this.objectPool?.push(tile);
		} else {
			tile.setActive(true);
			tile.setVisible(true);
		}
		return tile;
	}

	handleEditTile(pointerX: number, pointerY: number) {
		const { gridX, gridY } = this.getGridCoordinates(pointerX, pointerY);

		this.levelStore.setTileForEdit(gridX, gridY);
		this.cursorTile?.setPosition(gridX, gridY);
		this.setEditingCursor();
	}

	handleSpawnNewTile(pointerX: number, pointerY: number) {
		const { gridX, gridY } = this.getGridCoordinates(pointerX, pointerY);

		if (
			!this.levelStore.checkForTileAt(
				this.editorStore.currSelectedLayer,
				gridX,
				gridY
			)
		) {
			const currTile = this.editorStore.getCurrentTile();

			if (currTile === undefined) {
				return;
			}

			const tileData = this.levelStore.addTile(
				this.editorStore.currSelectedTile,
				this.editorStore.currSelectedLayer,
				gridX,
				gridY,
				currTile.hasValue,
				currTile.defaultValue
			);

			const color = parseInt(
				currTile ? currTile.color.substring(1) : "ffffff",
				16
			);

			const tile = this.getFirstDeadOrCreate();
			tile.setActive(true);
			tile.setVisible(true);
			tile.setDepth(this.editorStore.currSelectedLayer);
			tile.setData("layerIndex", this.editorStore.currSelectedLayer);
			tile.setData("gridPosition", { gridX, gridY });
			tile.setPosition(gridX, gridY);
			const tileBG = tile.getByName("tileBG") as Phaser.GameObjects.Image;
			tileBG.setTint(color);
			tileBG.setDisplaySize(this.CELL_SIZE - 4, this.CELL_SIZE - 4);
			this.updateTileText(tileData, tile);

			this.tweens.add({
				targets: tile,
				scaleX: {
					from: 0,
					to: 1,
				},
				scaleY: {
					from: 0,
					to: 1,
				},
				ease: "Cubic",
				duration: 200,
			});
		}
	}

	handleRemoveTileAt(pointerX: number, pointerY: number) {
		const { gridX, gridY } = this.getGridCoordinates(pointerX, pointerY);

		if (
			this.levelStore.checkForTileAt(
				this.editorStore.currSelectedLayer,
				gridX,
				gridY
			)
		) {
			const tileContainer = this.objectPool?.find((gameObj) => {
				const layer = gameObj.getData("layerIndex");
				const gridPosition = gameObj.getData("gridPosition");
				return (
					layer === this.editorStore.currSelectedLayer &&
					gridPosition.gridX === gridX &&
					gridPosition.gridY === gridY
				);
			});
			const tileToRemove = this.levelStore.removeTile(
				this.editorStore.currSelectedLayer,
				gridX,
				gridY
			);
			if (tileToRemove && tileContainer) {
				this.tweens.add({
					targets: tileContainer,
					scale: 0,
					ease: "Cubic",
					duration: "100",
					onComplete: () => {
						tileContainer.setVisible(false).setActive(false);
					},
				});
			}
		}
	}

	init() {
		this.setupEventCallbacks();

		this.debugText = this.add
			.text(0, 0, "")
			.setColor("#232323")
			.setDepth(10);

		toolBarOptions.forEach((toolBarOption, index) => {
			toolBarOption.keys.forEach((key) => {
				this.input.keyboard.on(`keydown-${key}`, () =>
					this.editorStore.handleSelectNewTool(index)
				);
			});
		});

		this.input.mouse.disableContextMenu();

		this.input.on("pointerdown", (pointer: MouseEvent) => {
			this.mouse1Down = pointer.button === 0;
			this.mouse2Down = pointer.button === 2;
			this.mouse3Down = pointer.button === 1;

			if (this.levelStore.currMode !== "edit") {
				if (this.mouse1Down) {
					this.handleSpawnNewTile(pointer.x, pointer.y);
				} else if (this.mouse2Down) {
					this.handleRemoveTileAt(pointer.x, pointer.y);
				}
			} else {
				this.handleEditTile(pointer.x, pointer.y);
			}
		});

		this.input.on("pointerup", (pointer: MouseEvent) => {
			if (pointer.button === 0) {
				this.mouse1Down = false;
			}
			if (pointer.button === 2) {
				this.mouse2Down = false;
			}
			if (pointer.button === 1) {
				this.mouse3Down = false;
			}
		});

		this.input.on("pointermove", (pointer: MouseEvent) => {
			const { gridX, gridY } = this.getGridCoordinates(
				pointer.x,
				pointer.y
			);
			if (!this.editingTile) {
				this.cursorTile?.setPosition(gridX, gridY);
			}
			if (this.levelStore.currMode === "edit") {
				return;
			}
			if (this.levelStore.currMode === "paint") {
				if (this.mouse1Down) {
					this.handleSpawnNewTile(pointer.x, pointer.y);
				} else if (this.mouse2Down) {
					this.handleRemoveTileAt(pointer.x, pointer.y);
				}
			}
		});

		this.cursorTile = this.add.image(-32, -32, "tile");
		this.cursorTile.setDisplaySize(this.CELL_SIZE, this.CELL_SIZE);
		this.cursorTile.setTint(0);
		this.cursorTile.setAlpha(0.25);
	}

	update() {
		this.canInteract = this.editorStore.isInitialized;

		if (!this.canInteract) {
			return;
		}
	}

	setEditingCursor() {
		this.editingTile = this.levelStore.currEditTile !== undefined;
		if (this.editingTile) {
			this.cursorTile?.setTint(0x30ff8d);
			this.cursorTile?.setAlpha(1);
		} else {
			this.cursorTile?.setTint(0);
			this.cursorTile?.setAlpha(0.25);
		}
	}

	updateTileText(
		tileData: LevelTileData,
		container: Phaser.GameObjects.Container
	) {
		const tileText = container.getByName(
			"tileText"
		) as Phaser.GameObjects.Text;
		const levelTileData = this.editorStore.getTileById(tileData.tileId);
		if (levelTileData) {
			tileText.setFixedSize(this.CELL_SIZE, this.CELL_SIZE);
			if (tileData.hasValue) {
				const valueString = levelTileData.boardName.split("{");
				valueString[1] = tileData.value.toString();
				tileText.setText(valueString);
			} else {
				tileText.setText(levelTileData.boardName);
			}
		}
	}

	// Event Callbacks
	onChangeLayerVisibility(
		layerVisibilityParameters: LayerVisibilityParameters
	) {
		this.objectPool?.forEach((gameObj) => {
			const layer = gameObj.getData("layerIndex");
			if (
				layer === layerVisibilityParameters.layerIndex &&
				gameObj.active
			) {
				gameObj.setVisible(layerVisibilityParameters.visible);
			}
		});
	}

	onValidateLevel(levelValidationParams: OnValidateParameters) {
		this.debugText
			?.setText(levelValidationParams.message)
			.setColor(levelValidationParams.color);
	}

	onClearLevel() {
		this.objectPool?.forEach((gameObj) => {
			gameObj.setActive(false).setVisible(false);
		});
		this.setEditingCursor();
	}

	onToolModeChanged() {
		this.setEditingCursor();
	}

	onEditTileValue() {
		const gridX = this.levelStore.currEditTile?.gridX;
		const gridY = this.levelStore.currEditTile?.gridY;

		const tileContainer = this.objectPool?.find((gameObj) => {
			const layerIndex = gameObj.getData("layerIndex");
			const gridPosition = gameObj.getData("gridPosition");
			return (
				layerIndex === this.editorStore.currSelectedLayer &&
				gridPosition.gridX === gridX &&
				gridPosition.gridY === gridY
			);
		});

		if (!this.levelStore.currEditTile || !tileContainer) {
			return;
		}

		this.updateTileText(this.levelStore.currEditTile, tileContainer);
	}
}
