import { Result } from "@rbxts/rust-classes";
import { t } from "@rbxts/t";
import { CommandInteraction } from "./core/interaction";

export type CommandGuard = (interaction: CommandInteraction) => boolean;

export interface CommanderOptions {
	globalGroups?: string[];
}

export type TransformationResult<T extends defined> = Result<T, string>;

export interface TypeOptions<T extends defined> {
	name: string;
	expensive: boolean;
	validate: t.check<T>;
	transform: (text: string, executor: Player) => TransformationResult<T>;
	suggestions?: (text: string, executor: Player) => string[];
}

export interface ArgumentOptions {
	name: string;
	description: string;
	type: string;
	optional?: boolean;
	suggestions?: string[];
}

export interface CommandOptions {
	name: string;
	aliases?: string[];
	description?: string;
	arguments?: ArgumentOptions[];
}

export interface GroupOptions {
	name: string;
	description?: string;
	parent?: string[];
}

export interface CommandMetadata {
	options: CommandOptions;
	func: (...args: unknown[]) => unknown;
}

export interface CommandReply {
	success: boolean;
	text: string;
	sentAt: number;
}

export interface CommandInteractionData {
	executor: Player;
	text: string;
	reply?: CommandReply;
}
