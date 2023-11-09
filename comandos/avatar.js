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
    /*.addOption((option) =>
      option
        .setName("hidden")
        .setDescription("¿Mostrar en oculto?")
    ),*/

  async execute(interaction) {
    const user = interaction.options.getUser("objetivo");
    //const hidden = int
    if (user)
      return interaction.reply(
        `[¡](${user.displayAvatarURL({
          dynamic: true,
        })})Aquí tienes el avatar de ${user.username}!:`
      );
    return interaction.reply(
      `[¡](${interaction.user.displayAvatarURL({
        dynamic: true,
      })})Aquí tienes tu avatar, ${interaction.user.username}!:`
    );
  },
};
