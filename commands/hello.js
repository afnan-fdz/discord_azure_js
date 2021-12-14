const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Greet the bot!"),
  async execute(interaction) {
    await interaction.reply(`Hello ${interaction.user.username}!`);
  },
};
