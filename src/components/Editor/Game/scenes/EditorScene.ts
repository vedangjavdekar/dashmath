import { useEditorStore, toolBarOptions } from "@/stores/editorStore";
import { useLevelStore } from "@/stores/levelStore";
import { Scene } from "phaser";

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

	debugText?: Phaser.GameObjects.Text;

	layerGroup?: Phaser.GameObjects.Group;
	cursorTile?: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "EditorScene" });
	}

	getGridCoordinates(pointerX: number, pointerY: number) {
		const gridX =
			this.CELL_SIZE * (0.5 + Math.floor(pointerX / this.CELL_SIZE));
		const gridY =
			this.CELL_SIZE * (0.5 + Math.floor(pointerY / this.CELL_SIZE));

		this.debugText?.setText(`X: ${gridX}, Y:${gridY}`);
		return { gridX, gridY };
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
			const tile = this.layerGroup?.getFirstDead(
				true,
				gridX,
				gridY,
				"tile"
			) as Phaser.GameObjects.Image;

			tile.setActive(true);
			tile.setVisible(true);

			const currTile = this.editorStore.getCurrentTile();

			if (!currTile) {
				return;
			}

			const color = parseInt(
				currTile ? currTile.color.substring(1) : "ffffff",
				16
			);

			tile.setTint(color);
			tile.setDisplaySize(this.CELL_SIZE - 2, this.CELL_SIZE - 2);

			this.tweens.add({
				targets: tile,
				scaleX: {
					from: 0,
					to: tile.scaleX,
				},
				scaleY: {
					from: 0,
					to: tile.scaleY,
				},
				ease: "Cubic",
				duration: 200,
			});

			this.levelStore.addTile(
				tile,
				this.editorStore.currSelectedLayer,
				gridX,
				gridY,
				currTile.hasValue,
				currTile.defaultValue
			);
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
			const tileToRemove = this.levelStore.removeTile(
				this.editorStore.currSelectedLayer,
				gridX,
				gridY
			);
			if (tileToRemove !== undefined) {
				this.tweens.add({
					targets: tileToRemove,
					scale: 0,
					ease: "Cubic",
					duration: "100",
					onComplete: () => {
						(tileToRemove as Phaser.GameObjects.Image)
							.setVisible(false)
							.setActive(false);
					},
				});
			}
		}
	}
	init() {
		this.layerGroup = this.add.group({ defaultKey: "tile" });
		toolBarOptions.forEach((toolBarOption, index) => {
			if (toolBarOption.selectable) {
				toolBarOption.keys.forEach((key) => {
					this.input.keyboard.on(`keydown-${key}`, () =>
						this.editorStore.handleSelectNewTool(index)
					);
				});
			}
		});

		this.input.mouse.disableContextMenu();

		this.input.on("pointerdown", (pointer: MouseEvent) => {
			this.mouse1Down = pointer.button === 0;
			this.mouse2Down = pointer.button === 2;
			this.mouse3Down = pointer.button === 1;

			if (this.mouse1Down) {
				this.handleSpawnNewTile(pointer.x, pointer.y);
			} else if (this.mouse2Down) {
				this.handleRemoveTileAt(pointer.x, pointer.y);
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
			this.cursorTile?.setPosition(gridX, gridY);
			if (this.levelStore.currMode === "paint") {
				if (this.mouse1Down) {
					this.handleSpawnNewTile(pointer.x, pointer.y);
				} else if (this.mouse2Down) {
					this.handleRemoveTileAt(pointer.x, pointer.y);
				}
			}
		});

		this.debugText = this.add
			.text(0, 0, "Debug Text")
			.setColor("#232323")
			.setDepth(10);

		this.cursorTile = this.add.image(-32, -32, "tile");
		this.cursorTile.setDisplaySize(this.CELL_SIZE, this.CELL_SIZE);
		this.cursorTile.setTint(0);
		this.cursorTile.setAlpha(0.25);
	}

	create() {}

	update() {
		this.canInteract = this.editorStore.isInitialized;

		if (!this.canInteract) {
			return;
		}
	}
}
