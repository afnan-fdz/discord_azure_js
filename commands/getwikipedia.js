const fetch = require("node-fetch");
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getwikipedia")
    .setDescription("Tries to fetch the first paragraph of a Wikipedia page")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Enter a search word")
        .setRequired(true)
    ),
  async execute(interaction) {
    const search = interaction.options.getString("search");
    await interaction.deferReply();
    await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${search}&srprop=size|wordcount&srlimit=2&utf8=&format=json`
    )
      .then((resp) => resp.json())
      .then((result) =>
        result.query.search.map((search) => search.pageid).join("|")
      )
      .then((ids) =>
        fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories&pageids=${ids}&formatversion=2`
        )
      )
      .then((resp) => resp.json())
      .then((result) => {
        if (
          !result.query.pages[0].categories
            .map((item) => item.title.toLowerCase().includes("disambiguation"))
            .some((element) => element === true)
        ) {
          return fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${result.query.pages[0].pageid}&formatversion=2&exsentences=10&exlimit=1&explaintext=1`
          );
        } else {
          return fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${result.query.pages[1].pageid}&formatversion=2&exsentences=10&exlimit=1&explaintext=1`
          );
        }
      })
      .then((resp) => resp.json())
      .then((result) => {
        extract = `**${result.query.pages[0].title}**\n${result.query.pages[0].extract}`;
        if (extract.length < 2000) {
          interaction.editReply(`${extract}`);
        } else {
          interaction.editReply(`${extract.substring(0, 1990)}...`);
        }
      })
      .catch((error) => console.log(error));
  },
};
