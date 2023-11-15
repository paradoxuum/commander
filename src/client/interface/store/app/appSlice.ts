import { createProducer } from "@rbxts/reflex";
import { copyDeep, push, removeIndices } from "@rbxts/sift/out/Array";
import { splitStringBySpace } from "../../../../shared/util/string";
import { HistoryEntry } from "../../../types";

export interface AppState {
	history: HistoryEntry[];
	terminalText: {
		value: string;
		parts: string[];
		index: number;
	};
}

const initialState: AppState = {
	history: [],
	terminalText: {
		value: "",
		parts: [],
		index: -1,
	},
};

export const appSlice = createProducer(initialState, {
	addHistoryEntry: (state, entry: HistoryEntry, limit: number) => {
		const history = copyDeep(state.history);
		if (history.size() >= limit) {
			const indices: number[] = [];
			for (const i of $range(limit, history.size())) {
				indices.push(i);
			}
			removeIndices(history, ...indices);
		}

		return {
			...state,
			history: push(state.history, entry),
		};
	},

	setHistory: (state, history: HistoryEntry[]) => ({
		...state,
		history,
	}),

	setText: (state, text: string) => {
		const parts = splitStringBySpace(text);
		const endsWithSpace = parts.size() > 0 && text.match("%s$").size() > 0;
		return {
			...state,
			terminalText: {
				value: text,
				parts,
				index: endsWithSpace ? parts.size() : parts.size() - 1,
			},
		};
	},
});
