const moment = require('moment-timezone');

module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermission: 2,
  credits: "Rudra",
  description: "Responds when someone sends 'prefix'",
  commandCategory: "bot prefix",
  usages: "prefix",
  cooldowns: 5,
};

module.exports.languages = {
  en: {
    title: "⚡ Rudra Bot Prefix Info ⚡",
    botName: "🤖 Bot Name",
    prefix: "📌 Prefix",
    cmdCount: "📦 Total Commands",
    time: "🕒 Current Time",
    group: "👥 Group Name"
  }
};

module.exports.handleEvent = async ({ api, event, getText }) => {
  const body = event.body ? event.body.toLowerCase() : '';
  if (body.startsWith("prefix")) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName || "Unnamed Group";
    const time = moment.tz("Asia/Kolkata").format("dddd, D MMMM YYYY • hh:mm A");

    const text = `
╭━━━〔 ${getText("title")} 〕━━━╮

${getText("botName")}: ${global.config.BOTNAME}
${getText("prefix")}: ｢ ${global.config.PREFIX} ｣
${getText("cmdCount")}: ｢ ${client.commands.size} ｣
${getText("time")}: ${time}
${getText("group")}: ${groupName}

╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    api.sendMessage({ body: text }, event.threadID, event.messageID);
  }
};

module.exports.run = () => {}; // No manual run needed
