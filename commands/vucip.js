const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { device } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vucip")
    .setDescription(
      "Returns Vuc's IP address (from where this bot is running)."
    ),
  async execute(interaction) {
    await fetch("https://api64.ipify.org?format=json")
      .then((resp) => resp.json().then((result) => result.ip))
      .then((ip) => {
        let response;
        switch (device) {
          case "laptop":
            response = `Running on a laptop, IP may not be the home IP:\n${ip}`;
            break;
          case "pc":
            response = `Showing home IP (where game servers run):\n${ip}`;
            break;
          default:
            response = `No clue what device this bot is on:\n${ip}`;
        }
        interaction.reply(response);
      });
  },
};
