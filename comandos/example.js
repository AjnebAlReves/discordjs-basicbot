const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hola")
    .setDescription("Saluda"),
  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('t_create_ticket')
      .setPlaceholder('Selecciona una categoría')
      .addOptions([
        {
          emoji: '💬',
          label: 'Soporte',
          description: 'Ayuda con nuestros servicios o productos',
          value: 'soporte',
        },
        {
          emoji: '🛒',
          label: 'Realizar pedido',
          description: 'Solicitar un trabajo o proyecto',
          value: 'pedido',
        },
        {
          emoji: '🐛',
          label: 'Reportar bug',
          description: 'Reportar un error o problema técnico',
          value: 'bug',
        },
        {
          emoji: '💼',
          label: 'Postulaciones', 
          description: 'Postulate para ser parte del equipo',
          value: 'postulacion',
        },
        {
          emoji: '🗑️',
          label: 'Solo andaba mirando',
          description: 'Limpia el Menú de selección.',
          value: 'limpiar',
        }
      ]);

    const row1 = new ActionRowBuilder()
      .addComponents(menu);

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Sistema de Tickets | ByAlRevés Studio')
      .setDescription(`
¡Gracias por ponerte en contacto con nosotros! Selecciona la categoría que mejor se ajuste a tu necesidad:

🔹 Soporte: Si necesitas ayuda con nuestros servicios o productos.
🔹 Realizar pedido: Para solicitar un trabajo, proyecto o personalización.
🔹 Reportar bug: Si encontraste un error o problema técnico en nuestras herramientas o servicios.
🔹 Postulaciones: Para postularte y ser parte del equipo

👉 Haz clic en el botón correspondiente para abrir un ticket. Nuestro equipo se pondrá en contacto contigo lo antes posible. 💬
`)
      .setImage("https://media.discordapp.net/attachments/1337244243244220457/1351925553346908250/6.png?ex=67e40f49&is=67e2bdc9&hm=ba469d0c56d990ce37e491dfeea6fdaf55348f68597b2132a71e1c54975bc1c8&=&format=webp&quality=lossless");

    await interaction.channel.send({ embeds: [embed], components: [row1] });
    await interaction.deferReply();
  },
};