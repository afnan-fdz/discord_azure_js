// Welcome back, Vuc!
// Import the necessary discord.js classes
const fs = require("fs"); // File system stuff
const { Client, Collection, Intents } = require("discord.js"); // You know it
const { token } = require("./config.json"); // Private bot information

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
  client.user.setActivity("I'm back!", { type: "PLAYING" });
});

// When an interaction is created, run this code
// No I don't know what an interaction exactly is
client.on("interactionCreate", async (interaction) => {
  // And because I have no clue what it is let's exclude anything we don't know
  if (!interaction.isCommand()) return;

  // But hey we know what commands are! If it's a command we keep going!
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
      ephemeral: true, // This message only shows to the caller
    });
  }
});

// Login to Discord with your client's token
client.login(token);
