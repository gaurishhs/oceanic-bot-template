import { Client, ClientOptions, Collection } from "oceanic.js";
import winston, { createLogger, type Logger } from "winston";
import type { Command } from "./Command";
import { EdenHandler } from "./Handler";
import config from "../config";
import type { Config } from "../types";

export class ExtendedClient extends Client {
    public commands: Collection<string, Command>;
    public aliases: Collection<string, string>;
    public handler: EdenHandler;
    public logger: Logger;
    public config: Config;
    constructor(options?: ClientOptions) {
        super(options!);
        this.commands = new Collection<string, Command>();
        this.aliases = new Collection<string, string>();
        this.handler = new EdenHandler(this);
        this.logger = createLogger({
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        })
        this.config = config;
    }
}