require('dotenv').config();
import { Bot } from '@/libraries/Classes/Bot';

export const client = new Bot({
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

console.clear();
client.start();

process.on('uncaughtException', async (e) => {
    client.logger.error(e);
    return e;
});

process.on('unhandledRejection', async (e) => {
    client.logger.error(e);
    return e;
});
