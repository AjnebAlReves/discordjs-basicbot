const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hola")
    .setDescription("Saluda"),
  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Crear Ticket')
      .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder()
      .addComponents(button);

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Ejemplo de Embed')
      .setDescription(`
¡Gracias por ponerte en contacto con nosotros! Selecciona la categoría que mejor se ajuste a tu necesidad:

🔹 Soporte: Si necesitas ayuda con nuestros servicios o productos.
🔹 Realizar pedido: Para solicitar un trabajo, proyecto o personalización.
🔹 Reportar bug: Si encontraste un error o problema técnico en nuestras herramientas o servicios.
🔹 Postulaciones: Para postularte y ser parte del equipo

👉 Haz clic en el botón correspondiente para abrir un ticket. Nuestro equipo se pondrá en contacto contigo lo antes posible. 💬
`);

    await interaction.channel.send({ embeds: [embed], components: [row1] });
    await interaction.deferReply();
  },
};