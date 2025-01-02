import { APIEmbed, CommandInteraction } from 'discord.js';

export interface PaginationOptions {
    interaction: CommandInteraction;
    items: APIEmbed[];
    maxPages: number;
}
