import {
    ApplicationCommandData,
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Message,
    MessageContextMenuCommandInteraction,
    PermissionResolvable,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import { Bot } from '@/libraries/Classes/Bot';

type MessageExecuteType = ({
    client,
    message,
    args,
}: {
    client: Bot;
    message: Message;
    args: string[];
}) => any;

type AutoCompleteExecuteType = ({
    client,
    interaction,
}: {
    client: Bot;
    interaction: AutocompleteInteraction;
}) => any;

type CommandBase = {
    requiredPermissions?: PermissionResolvable[];
    ephemeral?: boolean;
    aliases?: string[];
    isOwnerCommand?: boolean;
    canUseUserCommand?: boolean;
};

type Command<
    T extends
        | ApplicationCommandType.ChatInput
        | ApplicationCommandType.Message
        | ApplicationCommandType.User,
> = {
    type: T;
    execute: {
        interaction?: ({
            client,
            interaction,
        }: {
            client: Bot;
            interaction: T extends ApplicationCommandType.ChatInput
                ? ChatInputCommandInteraction
                : T extends ApplicationCommandType.Message
                  ? MessageContextMenuCommandInteraction
                  : UserContextMenuCommandInteraction;
        }) => any;
        message?: MessageExecuteType;
        autoComplete?: AutoCompleteExecuteType;
    };
};

type CommandWithDefault = {
    type?: never;
    execute: {
        interaction?: ({
            client,
            interaction,
        }: {
            client: Bot;
            interaction: ChatInputCommandInteraction;
        }) => any;
        message?: MessageExecuteType;
        autoComplete?: AutoCompleteExecuteType;
    };
};

export type CommandType = CommandBase &
    ApplicationCommandData &
    (
        | (
              | Command<ApplicationCommandType.ChatInput>
              | Command<ApplicationCommandType.Message>
              | Command<ApplicationCommandType.User>
          )
        | CommandWithDefault
    );
