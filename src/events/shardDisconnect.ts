import { Listener } from "../structures/Listener";
import type { ExtendedClient } from "../structures/Client";

export default class ShardDisconnect extends Listener {
    constructor() {
        super("shardDisconnect");
    }

    public invoke(client: ExtendedClient, error: Error, shardId: number): void {
        client.logger.warn(`Shard ${shardId} disconnected`, { source: "shardDisconnect", error: error });
    }
}