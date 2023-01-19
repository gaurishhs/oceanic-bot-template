import type { ClientEvents } from "oceanic.js";
import type { ExtendedClient } from "./Client";

export abstract class Listener<Key extends keyof ClientEvents = any> {
    public name: Key;
    public once?: boolean | undefined;

    constructor(name: Key, once: boolean | undefined = undefined) {
        this.name = name;
        this.once = once;
    };

    public invoke(Client: ExtendedClient, ...args: ClientEvents[Key]) { }
}