import { ExtendedClient } from "./structures/Client";
const client = new ExtendedClient({
    auth: "Bot " + process.env.TOKEN,
});

client.connect();