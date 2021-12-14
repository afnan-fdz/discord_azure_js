// Require the necessary discord.js classes
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Read the commands folder for all commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  // Set an activity for the client
  client.user.setActivity("I'm back!", { type: "STREAMING" });
});

// When a command is called, run this code
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  // TODO: Simply a check
  console.log(command);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login(token);
