import { ExtendedClient } from "./Client";
import glob from 'glob';
import { Listener } from "./Listener";
import { AnyInteractionGateway, Constants } from "oceanic.js";
import { Command } from "./Command";

export class EdenHandler {
	protected client: ExtendedClient;
	constructor(client: ExtendedClient) {
		this.client = client;
		this.loadCommands().then(() => this.client.logger.info(`Loaded ${this.client.commands.size} commands.`)).catch((err) => this.client.logger.error(err));
		this.loadListeners().then(() => this.client.logger.info(`Loaded Listeners.`));
		this.client.on('interactionCreate', this.handleInteraction.bind(this));
	}

	public async loadCommands() {
		const commandFiles = glob.sync(process.cwd() + '/src/commands/**/*{.ts,.js}');
		const promises = commandFiles.map(async (file) => {
			const { default: CommandClass } = await import(file);
			const targetFile: Command = new CommandClass(this.client);
			if (this.client.commands.has(targetFile.options.name)) return;
			if (targetFile.options.name.length < 3 && targetFile.options.slash?.enabled) {
				throw new TypeError('Commands which have slash enabled must be atleast 3 characters long.');
			}
			this.client.commands.set(targetFile.options.name, targetFile);
			const commandAliases = targetFile.options.aliases as Array<any>;
			if (targetFile.options.aliases) {
				commandAliases.forEach(alias => {
					this.client.aliases.set(alias, targetFile.options.name);
				});
			}
		});

		await Promise.all(promises);
	}

	private fetchCommand(commandName: string) {
		return this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName) as string);
	}

	public handleInteraction(interaction: AnyInteractionGateway) {
		if (interaction.type !== Constants.InteractionTypes.APPLICATION_COMMAND) return;
		const command: Command | undefined = this.fetchCommand(interaction.data.name);
		if (!command || !command.options?.slash?.enabled) return;
		if (command.options.slash.precondition && !command.options.slash.precondition(interaction)) return;
		if (command.options.permissions && !interaction.member?.permissions.has(...command.options.permissions)) return;
		if (command.options.guildOnly && !interaction.guildID) return;
		if (command.options.dmOnly && interaction.guildID) return;
		if (command.options.guildOwneronly && interaction.guildID && interaction.guild?.ownerID !== interaction.member?.id) return;
		if (command.options.ownerOnly) {
			const user = interaction.member?.id || interaction.user?.id;
			if (!user || !this.client.config.owners.includes(user)) return;
		}
	
		switch (interaction.data.type) {
			case Constants.ApplicationCommandTypes.CHAT_INPUT:
				command.interactionRun(interaction);
				break;
			case Constants.ApplicationCommandTypes.USER:
				command.userContext(interaction);
				break;
			case Constants.ApplicationCommandTypes.MESSAGE:
				command.messageContext(interaction);
				break;
		}
		
	}

	public async loadListeners() {
		const ListenerFiles = glob.sync(process.cwd() + '/src/Listeners/**/*{.ts,.js}');
		const promises = ListenerFiles.map(async (file) => {
			const { default: ListenerClass } = await import(file);
			const targetFile: Listener = new ListenerClass(this.client);
			if (targetFile.once) {
				this.client.once(targetFile.name, (...args) => targetFile.invoke(this.client, ...args));
			} else {
				this.client.on(targetFile.name, (...args) => targetFile.invoke(this.client, ...args));
			}
		});

		await Promise.all(promises);
	}
}