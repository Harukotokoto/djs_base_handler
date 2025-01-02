import { Event } from '@/handlers/Event';
import { client } from '@/index';
import { CommandError, ErrorTypes } from '@/handlers/CommandError';

export default new Event('messageCreate', async (message) => {
    const prefix = client.prefix;

    const Error = new CommandError(message);

    if (
        message.author.bot ||
        !message.guild ||
        !message.content.startsWith(prefix)
    ) {
        return;
    }

    const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const command =
        client.commands.get(cmd.toLowerCase()) ||
        client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

    if (!command || !command.execute.message) return;

    const member = message.guild.members.cache.get(message.author.id);
    if (!member) return;

    if (command.isOwnerCommand && !client.admins.includes(message.author.id)) {
        return await Error.create(
            'このコマンドはBot関係者のみ実行可能です',
            ErrorTypes.Warn,
        );
    }

    if (client.debugMode && !client.admins.includes(message.author.id)) {
        return await Error.create(
            '開発モードが有効です\n' +
                '許容されたユーザーのみコマンドを実行することができます',
            ErrorTypes.Warn,
        );
    }

    if (!member.permissions.has(command.requiredPermissions || [])) {
        return await Error.create('このコマンドを使用する権限が不足しています');
    }

    await command.execute.message({ client, message, args });
});
