import { ExtendedClient } from "../structures/Client";
import { Listener } from "../structures/Listener";

export default class Error extends Listener {
    constructor() {
        super("error");
    }

    public invoke(client: ExtendedClient, info: string | Error, shardId: number | undefined): void {
        client.logger.error(`Shard ${shardId} encountered an error`, { source: "error", error: info });
    }
}