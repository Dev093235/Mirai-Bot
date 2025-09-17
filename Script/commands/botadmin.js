module.exports.config = {
	name: "botadmin",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "Rudra",
	description: "Manage bot admins",
	commandCategory: "config",
	usages: "[list/add/remove] [userID]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.languages = {
	en: {
		listAdmin: '[Rudra] Admin list:\n\n%1',
		notHavePermssion: '[Rudra] You do not have permission to use "%1"',
		addedNewAdmin: '[Rudra] Added %1 admin(s):\n\n%2',
		removedAdmin: '[Rudra] Removed %1 admin(s):\n\n%2'
	}
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
	const content = args.slice(1);
	const { threadID, messageID, mentions } = event;
	const { configPath } = global.client;
	const { ADMINBOT } = global.config;
	const { writeFileSync } = global.nodemodule["fs-extra"];
	const mention = Object.keys(mentions);

	delete require.cache[require.resolve(configPath)];
	let config = require(configPath);

	switch (args[0]) {
		case "list":
		case "all":
		case "-a": {
			const listAdmin = ADMINBOT || config.ADMINBOT || [];
			let msg = [];

			for (const idAdmin of listAdmin) {
				if (parseInt(idAdmin)) {
					const name = await Users.getNameUser(idAdmin);
					msg.push(`- ${name} (https://facebook.com/${idAdmin})`);
				}
			}

			return api.sendMessage(getText("listAdmin", msg.join("\n")), threadID, messageID);
		}

		case "add": {
			if (permssion != 2) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);

			if (mention.length !== 0 && isNaN(content[0])) {
				let listAdd = [];

				for (const id of mention) {
					if (!ADMINBOT.includes(id)) {
						ADMINBOT.push(id);
						config.ADMINBOT.push(id);
						listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
					}
				}

				writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
				return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
			}
			else if (content.length !== 0 && !isNaN(content[0])) {
				if (!ADMINBOT.includes(content[0])) {
					ADMINBOT.push(content[0]);
					config.ADMINBOT.push(content[0]);
					const name = await Users.getNameUser(content[0]);
					writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
					return api.sendMessage(getText("addedNewAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
				} else {
					return api.sendMessage("User is already an admin.", threadID, messageID);
				}
			}
			else return global.utils.throwError(this.config.name, threadID, messageID);
		}

		case "remove":
		case "rm":
		case "delete": {
			if (permssion != 2) return api.sendMessage(getText("notHavePermssion", "delete"), threadID, messageID);

			if (mention.length !== 0 && isNaN(content[0])) {
				let listRemove = [];

				for (const id of mention) {
					const index = config.ADMINBOT.findIndex(item => item == id);
					if (index !== -1) {
						ADMINBOT.splice(index, 1);
						config.ADMINBOT.splice(index, 1);
						listRemove.push(`[ ${id} ] » ${event.mentions[id]}`);
					}
				}

				writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
				return api.sendMessage(getText("removedAdmin", listRemove.length, listRemove.join("\n").replace(/\@/g, "")), threadID, messageID);
			}
			else if (content.length !== 0 && !isNaN(content[0])) {
				const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
				if (index !== -1) {
					ADMINBOT.splice(index, 1);
					config.ADMINBOT.splice(index, 1);
					const name = await Users.getNameUser(content[0]);
					writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
					return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
				} else {
					return api.sendMessage("User is not in admin list.", threadID, messageID);
				}
			}
			else return global.utils.throwError(this.config.name, threadID, messageID);
		}

		default: {
			return global.utils.throwError(this.config.name, threadID, messageID);
		}
	}
};
