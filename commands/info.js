const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Get info about a user or a server!")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("user")
      .setDescription("Info about a user")
      .addUserOption((option) =>
        option.setName("target").setDescription("The user")
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("server").setDescription("Info about the server")
  );

module.exports = {
  data,
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      // Run this code for the 'user' subcommand
      case "user":
        if (interaction.options.getUser("target") != null) {
          const target = interaction.options.getUser("target");
          interaction.reply(
            `That user's tag is ${target.tag}\nTheir ID is ${target.id}`
          );
        } else {
          interaction.reply(
            `Your tag is ${interaction.user.tag}\nYour ID is ${interaction.user.id}`
          );
        }
        break;

      // Run this code for the 'server' subcommand
      case "server":
        interaction.reply(
          `This server is ${interaction.guild.name}\nIts member count is ${interaction.guild.memberCount}`
        );
        break;

      // Run this code if neither of the above were chosen
      default:
        interaction.reply("Invalid subcommand!");
    }
  },
};
