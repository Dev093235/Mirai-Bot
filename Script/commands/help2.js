module.exports.config = {
  name: "help2",
  version: "3.0-rudraStyle",
  hasPermssion: 0,
  credits: "Rudra",
  description: "📚 Show all commands in decorated desi style",
  commandCategory: "🛠 System",
  usages: "all",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    allCmds:
`📚 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗟𝗜𝗦𝗧
━━━━━━━━━━━━━━━━━━━━
%1
━━━━━━━━━━━━━━━━━━━━
📌 Total Commands: %2  
📂 Total Events: %3  
👨‍💻 Coded by: Rudra`
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const { commands, events } = global.client;

  if (args[0] !== "all")
    return api.sendMessage("❌ Bhai, use like this: help all", threadID, messageID);

  const allCmds = Array.from(commands.values()).map((cmd, i) =>
`━❮●❯━【 ${i + 1}. ★ ${cmd.config.name} ★ 】━❮●❯━`
  ).join("\n");

  const msg = getText(
    "allCmds",
    allCmds,
    commands.size,
    events.size
  );

  return api.sendMessage(msg, threadID, messageID);
};
