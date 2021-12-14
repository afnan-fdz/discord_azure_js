const fetch = require("node-fetch");
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getwikipedia")
    .setDescription("Tries to fetch the first paragraph of a Wikipedia page")
    .addStringOption((option) =>
      option.setName("title").setDescription("Enter a title").setRequired(true)
    ),
  async execute(interaction) {
    const title = interaction.options.getString("title");
    await interaction.deferReply();
    await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${title}&formatversion=2&exsentences=10&exlimit=1&explaintext=1`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        console.log(json.query.pages);
        const key = Object.keys(json.query.pages)[0];
        return json.query.pages[key].extract;
      })
      .then((str) => {
        console.log(str);

        if (str.length <= 0) {
          interaction.editReply("Article does not exist.");
        } else if (str.length < 2000) {
          interaction.editReply(str);
        } else {
          fs.writeFile("out.txt", str, (err) => {
            if (err) throw err;
          });
          interaction.editReply({
            files: ["./out.txt"],
          });
        }
      })
      .catch((error) => interaction.editReply(`Invalid: ${error}`));
  },
};
