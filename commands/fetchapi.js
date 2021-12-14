const fetch = require("node-fetch");
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fetch")
    .setDescription("Tries to fetch data from an API link!")
    .addStringOption((option) =>
      option.setName("url").setDescription("Enter a link").setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    await fetch(interaction.options.getString("url"))
      .then((response) => response.json())
      .then((json) => JSON.stringify(json))
      .then((str) => {
        if (str.length < 2000) {
          interaction.editReply(str);
        } else {
          fs.writeFile("out.json", str, (err) => {
            if (err) throw err;
          });
          interaction.editReply({
            files: ["./out.json"],
          });
        }
      })
      .catch((error) => interaction.editReply(`Invalid: ${error}`));
  },
};
