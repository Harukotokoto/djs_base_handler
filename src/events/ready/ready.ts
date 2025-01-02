import { Event } from '@/handlers/Event';
import { client } from '@/index';
import { ActivityType } from 'discord.js';

export default new Event('ready', async () => {
    if (!client.user) {
        return client.logger.error(
            'クライアントユーザーが見つかりませんでした。',
        );
    }

    client.logger.info(client.user.tag + 'でログインしました');
    client.logger.info('Prefix: ' + client.prefix);

    if (client.debugMode) {
        client.logger.debug('デバッグモードは有効です');

        client.user.setPresence({
            activities: [
                {
                    name: '開発モードが有効です',
                    type: ActivityType.Listening,
                },
            ],
            status: 'dnd',
        });
    } else {
        client.user.setPresence({
            activities: [
                {
                    name: 'Im Here!',
                    type: ActivityType.Playing,
                },
            ],
            status: 'online',
        });
    }
});
