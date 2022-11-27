import Phaser from "phaser";
import BootScene from "@/components/Editor/Game/scenes/BootScene";
import EditorScene from "@/components/Editor/Game/scenes/EditorScene";

function launch(containerId: string) {
	return new Phaser.Game({
		type: Phaser.AUTO,
		width: 960,
		height: 540,
		backgroundColor: "#E3E3E3",
		parent: containerId,
		scene: [BootScene, EditorScene],
	});
}

export default launch;
export { launch };
