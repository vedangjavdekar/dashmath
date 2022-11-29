import type { ToolBarOption } from "@/types/toolBarOptionType";

export const toolBarOptions: ToolBarOption[] = [
	{
		icon: "bi-shield-check",
		text: "Validate",
		selectable: false,
		actionName: "validate",
		visibleInToolbar: true,
		keys: [],
	},
	{
		icon: "bi-trash",
		text: "Clear",
		selectable: false,
		actionName: "clear",
		visibleInToolbar: true,
		keys: [],
	},
	{
		icon: "bi-save",
		text: "Save",
		selectable: false,
		actionName: "save",
		visibleInToolbar: true,
		keys: [],
	},
	{
		icon: "bi-pencil",
		text: "Draw (D)",
		selectable: true,
		actionName: "draw",
		visibleInToolbar: true,
		keys: ["D"],
	},
	{
		icon: "bi-brush",
		text: "Paint (S)",
		selectable: true,
		actionName: "paint",
		visibleInToolbar: true,
		keys: ["S"],
	},
	{
		icon: "bi-gear",
		text: "Edit (E)",
		selectable: true,
		actionName: "edit",
		visibleInToolbar: true,
		keys: ["E"],
	},
	{
		icon: "",
		text: "",
		selectable: false,
		actionName: "nextTile",
		visibleInToolbar: false,
		keys: ["W"],
	},
	{
		icon: "",
		text: "",
		selectable: false,
		actionName: "prevTile",
		visibleInToolbar: false,
		keys: ["Q"],
	},
];
