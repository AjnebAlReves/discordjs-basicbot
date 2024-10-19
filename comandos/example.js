const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hola")
    .setDescription("Saluda"),
  async execute(interaction) {
    return interaction.reply(
      `¡Hola! Soy un bot de ejemplo`
    );
  },
};
