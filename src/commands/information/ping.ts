import { Command } from '@/handlers/Command';
import { Colors } from 'discord.js';

export default new Command({
    name: 'ping',
    description: 'Botの応答速度を表示します',
    ephemeral: false,
    execute: {
        interaction: async ({ client, interaction }) => {
            const response =
                Date.now() - (await interaction.fetchReply()).createdTimestamp;

            await interaction.followUp({
                embeds: [
                    {
                        title: 'Pong!',
                        description:
                            `**WebSocket:** \`${client.ws.ping}\`ms\n` +
                            `**Latency:** \`${response}\`ms`,
                        color: Colors.Green,
                        footer: client.footer(),
                    },
                ],
            });
        },
        message: async ({ client, message }) => {
            const response = Date.now() - message.createdTimestamp;

            await message.reply({
                embeds: [
                    {
                        title: 'Pong!',
                        description:
                            `**WebSocket:** \`${client.ws.ping}\`ms\n` +
                            `**Latency:** \`${response}\`ms`,
                        color: Colors.Green,
                        footer: client.footer(),
                    },
                ],
                allowedMentions: {
                    parse: [],
                },
            });
        },
    },
});
