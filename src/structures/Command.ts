import { ExtendedClient } from './Client';
import { CommandOptions } from '../types';
import { CommandInteraction } from 'oceanic.js';

export abstract class Command {
	protected client: ExtendedClient;
	public options: CommandOptions;

	constructor(client: ExtendedClient, options: CommandOptions) {
		this.client = client;
		this.options = options;
	}

	public interactionRun(interaction: CommandInteraction): void | Promise<void> {}
	public messageContext (interaction: CommandInteraction ): void | Promise<void> {}
	public userContext (interaction: CommandInteraction ): void | Promise<void> {}
}