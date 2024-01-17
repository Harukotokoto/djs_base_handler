"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../lib/classes/Command");
const getCommands_1 = require("../../lib/handlers/function/getCommands");
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../lib/handlers/component/Embed");
exports.default = new Command_1.Command({
  name: "help",
  description: "コマンドの使用方法を表示します",
  execute: {
    interaction: async ({ interaction }) => {
      const commands = await (0, getCommands_1.getCommands)();
      const categories = [
        ...new Set(commands.map((command) => command.category)),
      ];
      await interaction.followUp({
        embeds: [
          {
            title: "📪 Need help?",
            description:
              "カテゴリーとコマンドを選択してください\n\n現在のプレフィックス: `.`\nスラッシュコマンドも利用可能です。\nエイリアスはチャットコマンドにのみ対応しています。",
            color: discord_js_1.Colors.Gold,
            footer: (0, Embed_1.footer)(),
          },
        ],
        components: [
          new discord_js_1.ActionRowBuilder().addComponents(
            new discord_js_1.StringSelectMenuBuilder()
              .setOptions(
                categories.map((category) => {
                  const categoryName =
                    category.charAt(0).toUpperCase() + category.slice(1);
                  return {
                    label: categoryName,
                    value: category,
                  };
                }),
              )
              .setPlaceholder("カテゴリーを選択")
              .setCustomId("category_select"),
          ),
          new discord_js_1.ActionRowBuilder().addComponents(
            new discord_js_1.StringSelectMenuBuilder()
              .setCustomId("command_select")
              .setOptions([
                {
                  label: "command",
                  value: "command",
                },
              ])
              .setPlaceholder("コマンドを選択")
              .setDisabled(true),
          ),
        ],
      });
      const collecter = (
        await interaction.fetchReply()
      ).createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
      });
      collecter.on("collect", (i) => {
        if (!i.isStringSelectMenu()) return;
        if (i.customId === "category_select") {
          const selectedCategory = i.values[0];
          const categoryName =
            selectedCategory.charAt(0).toUpperCase() +
            selectedCategory.slice(1);
          const commandList = commands.filter(
            (cmd) => cmd.category === selectedCategory,
          );
          i.update({
            embeds: [
              {
                title: categoryName,
                fields: commandList.map((command) => {
                  return {
                    name: command.command.name,
                    value: command.command.description,
                    inline: true,
                  };
                }),
                color: discord_js_1.Colors.Gold,
                footer: (0, Embed_1.footer)(),
              },
            ],
            components: [
              new discord_js_1.ActionRowBuilder().addComponents(
                new discord_js_1.StringSelectMenuBuilder()
                  .setOptions(
                    categories.map((category) => {
                      const categoryName =
                        category.charAt(0).toUpperCase() + category.slice(1);
                      return {
                        label: categoryName,
                        value: category,
                      };
                    }),
                  )
                  .setPlaceholder("カテゴリーを選択")
                  .setCustomId("category_select"),
              ),
              new discord_js_1.ActionRowBuilder().addComponents(
                new discord_js_1.StringSelectMenuBuilder()
                  .setCustomId("command_select")
                  .setOptions(
                    commands
                      .filter(
                        (command) => command.category === selectedCategory,
                      )
                      .map((command) => {
                        return {
                          label: "/" + command.command.name,
                          value: command.command.name,
                          description: command.command.description,
                        };
                      }),
                  )
                  .setPlaceholder("コマンドを選択"),
              ),
            ],
          });
        }
        if (i.customId === "command_select") {
          const selectedCommand = i.values[0];
          const cmd = commands.find(
            (cmd) => cmd.command.name === selectedCommand,
          );
          const command = cmd?.command;
          if (!command) return;
          const commandName =
            command.name.charAt(0).toUpperCase() + command.name.slice(1);
          const aliases = command.aliases
            .map((alias) => "`" + alias + "`")
            .join(", ");
          const commandDescription = command.description;
          const commandUsage = command.usage;
          const isOwnerCommand = command.isOwnerCommand;
          const categoryName =
            cmd?.category.charAt(0).toUpperCase() + cmd?.category.slice(1);
          i.update({
            embeds: [
              {
                title: cmd?.category
                  ? categoryName + " - " + commandName
                  : commandName,
                description:
                  commandDescription +
                  "\n" +
                  (isOwnerCommand
                    ? "```fix\n※このコマンドは管理者限定です\n```"
                    : ""),
                fields: [
                  {
                    name: "エイリアス",
                    value:
                      aliases || "このコマンドにエイリアスは設定されていません",
                  },
                  {
                    name: "使用方法",
                    value: `\`\`\`\n${commandUsage}\n\`\`\``,
                  },
                ],
                color: discord_js_1.Colors.Gold,
                footer: (0, Embed_1.footer)(),
              },
            ],
          });
        }
      });
    },
  },
});
