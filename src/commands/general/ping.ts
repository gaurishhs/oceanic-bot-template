import { ExtendedClient } from "../../structures/Client";
import { Command } from "../../structures/Command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from "oceanic.js";

export default class PingCommand extends Command {
    constructor(client: ExtendedClient) {
        super(client, {
            name: "ping",
            description: "Get the bot's latency",
            slash: {
                enabled: true,
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        await interaction.createMessage({
            content: "Pong. " + interaction.guild?.shard.latency + "ms",
        });
    }
}