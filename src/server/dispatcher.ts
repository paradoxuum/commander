import { t } from "@rbxts/t";
import { CommandInteraction, CommandInteractionData, Path } from "../shared";
import { BaseDispatcher } from "../shared/core/dispatcher";
import { Remotes } from "../shared/network";

export class ServerDispatcher extends BaseDispatcher {
	/**
	 * Initialises the server dispatcher.
	 *
	 * This handles any connections to dispatcher remotes. It is
	 * required in order to handle server command execution from clients.
	 */
	init() {
		Remotes.Execute.OnServerInvoke = (player, path, text) => {
			if (!t.string(path) || !t.string(text)) return;

			const commandPath = Path.fromString(path);

			const [success, data] = this.run(commandPath, player, text)
				.timeout(5)
				.await();

			let interactionData: CommandInteractionData;
			if (success) {
				interactionData = data.getData();
			} else {
				this.handleError(player, text, data);
				interactionData = {
					executor: player,
					text,
					reply: {
						success: false,
						text: "An error occurred.",
						sentAt: os.time(),
					},
				};
			}

			return interactionData;
		};
	}

	/**
	 * Executes a command.
	 *
	 * @param path The path of the command
	 * @param executor The command executor
	 * @param text The text input used to execute the command
	 * @returns A {@link CommandInteraction} determining the result of execution
	 */
	async run(path: Path, executor: Player, text = "") {
		return this.executeCommand(path, executor, text).catch((err) => {
			this.handleError(executor, text, err);

			const interaction = new CommandInteraction(path, executor, text);
			interaction.error("An error occurred.");
			return interaction;
		});
	}

	private handleError(executor: Player, text: string, err: unknown) {
		warn(
			`${executor.Name} tried to run '${text}' but an error occurred: ${err}`,
		);
	}
}
