import {
	CommandContext,
	CommandOptions,
	ImmutableRegistryPath,
} from "../shared";
import { BaseCommand } from "../shared/core/command";
import { BaseRegistry } from "../shared/core/registry";
import { ReadonlyDeep } from "../shared/util/data";
import { ClientConfig, ClientRemotes } from "./types";

export class ServerCommand extends BaseCommand {
	private readonly remote: ClientRemotes.Execute;

	constructor(
		private readonly config: ReadonlyDeep<ClientConfig>,
		registry: BaseRegistry,
		path: ImmutableRegistryPath,
		options: CommandOptions,
	) {
		super(config, registry, path, options);
		this.remote = config.network.execute;
	}

	execute(context: CommandContext, args: string[]) {
		const [success, data] = pcall(() =>
			this.remote.Invoke(this.path.toString(), args),
		);

		if (!success) {
			context.error(this.config.messages.error);
			return;
		}

		if (data?.reply !== undefined) context.setReply(data.reply);
	}

	toString() {
		return `ServerCommand{path=${this.path}}`;
	}
}
