module.exports.config = {
	name: "info",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "RUDRA", //don't change the credits please
	description: "Admin and Bot info.",
	commandCategory: "info",
	cooldowns: 1,
	dependencies: {
		"request": "",
		"fs-extra": "",
		"axios": ""
	}
};

module.exports.run = async function({ api, event }) {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];
	const fs = global.nodemodule["fs-extra"];
	const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
	const moment = require("moment-timezone");
	const currentTime = moment.tz("Asia/Kolkata").format("📅 D/MM/YYYY | 🕒 hh:mm:ss A");

	const images = [
		"https://i.imgur.com/7vCTqbA.jpeg",
		"https://i.imgur.com/VoPlE0Q.jpeg",
		"https://i.imgur.com/5yHDG3r.jpeg",
		"https://i.imgur.com/6rlJUGk.jpeg"
	];

	const callback = () => {
		api.sendMessage({
			body: `📌 BOT & ADMIN INFO
━━━━━━━━━━━━━━━━━━━━━━━

🤖 Bot Name: ${global.config.BOTNAME}
👨‍💻 Bot Admin: Rudra
📍 Location: Haryana, India

━━━━━━━━━━━━━━━━━━━━━━━
📞 Contact:
🔹 Facebook ID: fb.com/rudra.dev.digital
🔹 Page: fb.com/rudra.bot.page
🔹 Prefix: ${global.config.PREFIX}
🔹 Owner: Rudra (Digital Devta)

━━━━━━━━━━━━━━━━━━━━━━━
🕒 Uptime: ${hours}h ${minutes}m ${seconds}s
📅 Current Time: ${currentTime}

🙏 Thanks for using ${global.config.BOTNAME} 💻🖤`,
			attachment: fs.createReadStream(__dirname + "/cache/info.jpg")
		}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/info.jpg"));
	};

	// Download random image
	request(encodeURI(images[Math.floor(Math.random() * images.length)]))
		.pipe(fs.createWriteStream(__dirname + "/cache/info.jpg"))
		.on("close", () => callback());
};
