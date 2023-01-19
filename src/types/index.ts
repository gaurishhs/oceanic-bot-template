import { ApplicationCommandOptions, CommandInteraction, Constants, Message } from "oceanic.js";
import { ApplicationCommandPermissionsUpdatePacket } from "oceanic.js/dist/lib/types/gateway-raw";

interface SlashOptions {
    enabled: boolean | false;
    options?: ApplicationCommandOptions[];
    defaultPermission?: boolean | false;
    // eslint-disable-next-line no-unused-vars
    precondition?: (interaction: CommandInteraction) => boolean;
}

export interface CommandOptions {
    name: string;
    description: string;
    aliases?: string[];
    usage?: string;
    guildOnly?: boolean;
    dmOnly?: boolean;
    guildOwneronly?: boolean;
    ownerOnly?: boolean;
    permissions?: Iterable<Constants.PermissionName | bigint>;
    // eslint-disable-next-line no-unused-vars
    customPrecondition?: (message: Message) => boolean;
    slash?: SlashOptions;
}

export type Config = {
    owners: string[];
}