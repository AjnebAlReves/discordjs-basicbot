const { Canvas } = require("@napi-rs/canvas");

module.exports = {
	name: 'guildMemberAdd',
	once: true,
	execute() {
        member.guild.channels.get(config.welcome.channelid).send(config.welcome.message);
		/*const embed = new EmbedBuilder()
		*/
        }
	
};
