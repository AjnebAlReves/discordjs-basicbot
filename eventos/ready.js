module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({ activities: [{ name: 'MbejuBot | vDEV_1' }], status: 'idle' });
		console.log(`Conectado como ${client.user.tag}`);
	},
};
