import {
    APIEmbedFooter,
    ApplicationCommandType,
    Client,
    ClientEvents,
    ClientOptions,
    Collection,
    EmbedFooterData,
    Message,
    PartialMessage,
} from 'discord.js';
import { promisify } from 'util';
import glob from 'glob';
import { Event } from '@/libraries/Classes/Handlers/Event';
import { CommandType } from '@/interfaces/Command';
import { Logger } from './Utils/Logger';
import mongoose from 'mongoose';
import process from 'process';
import moment from 'moment';
import { BotOptions } from '@/interfaces/BotOptions';
import { client } from '@/index';

const globPromise = promisify(glob);

export class Bot extends Client {
    public prefix;
    public debugMode;
    public admins;

    public constructor(options: ClientOptions & BotOptions) {
        super(options);

        this.debugMode = options.debugMode || false;
        this.admins = options.admins || [];
        this.prefix = options.prefix || '!';
    }

    public globPromise = promisify(glob);

    public logger = new Logger();

    public footer(): EmbedFooterData {
        const user = client.users.cache.get('1004365048887660655');
        return {
            text: 'Produced by Harukoto',
            iconURL: user?.displayAvatarURL(),
        };
    }

    public start() {
        this.login(process.env.CLIENT_TOKEN)
            .then(() => {
                this.logger.info('ログインしました');
            })
            .catch((e) => {
                this.logger.error(e);
            });

        this.registerCommands().then(() => {
            this.logger.info('全てのコマンドが正常に登録されました');
        });

        this.registerEvents().then(() => {
            this.logger.info('全てのイベントが正常に登録されました');
        });

        this.connect().then(() => {
            this.logger.info(`MongoDBに接続しました`);
        });
    }

    private connect() {
        return mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_TABLE}`,
        );
    }

    public commands: Collection<string, CommandType> = new Collection();

    public async importFile<T>(filePath: string): Promise<T> {
        const file = await import(filePath);
        if (!file) {
            this.logger.error(`File ${filePath} not found`);
        }

        return file.default;
    }

    private async registerCommands() {
        const commands: CommandType[] = [];
        const commandFiles = await this.globPromise(
            __dirname + '/../../Handlers/commands/**/*{.ts,.js}',
        );

        for (const file of commandFiles) {
            const command: CommandType = await this.importFile(file);

            if (
                command.type === ApplicationCommandType.ChatInput ||
                !command.type
            ) {
                this.logger.info(`"/${command.name}"を読み込みました`);
            } else {
                this.logger.info(`"${command.name}"を読み込みました`);
            }

            commands.push(command);
            this.commands.set(command.name, command);
        }

        this.once('ready', () => {
            this.application?.commands
                .set(commands)
                .then(() =>
                    this.logger.info(
                        `${commands.length}個のスラッシュコマンドを${this.guilds.cache.size}個のサーバーで登録しました`,
                    ),
                )
                .catch((e) => {
                    this.logger.error(`Failed to register slash commands`);
                    this.logger.error(e);
                });
        });
    }

    private async registerEvents() {
        const eventFiles = await this.globPromise(
            `${__dirname}/../../handlers/events/**/*{.ts,.js}`,
        );

        for (const filePath of eventFiles) {
            const event =
                await this.importFile<Event<keyof ClientEvents>>(filePath);
            if (event && 'event' in event) {
                this.on(event.event, event.run);
            }
        }
    }
}
