const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestro el perfil de una persona.")
    .addUserOption((option) =>
      option
        .setName("objetivo")
        .setDescription("Usuario al que mostrar su imágen de perfil")
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("objetivo") || interaction.user;
    
    const embed = {
      color: 0x0099ff,
      title: user.id === interaction.user.id ? 'Tu avatar' : `Avatar de ${user.username}`,
      image: {
        url: user.displayAvatarURL({ dynamic: true, size: 4096 })
      },
      footer: {
        text: `Solicitado por ${interaction.user.username}`
      },
      timestamp: new Date()
    };

    return interaction.reply({ embeds: [embed] });
  },
};