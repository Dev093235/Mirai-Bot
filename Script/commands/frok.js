module.exports.config = {
  name: "frok",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Rudra",
  description: "📦 Show Rudra's bot forks and GitHub links (no prefix needed)",
  commandCategory: "system",
  usages: "Just type: frok, forklink, github...",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    title: "🚀 Rudra's GitHub Bot Forks",
    list: `🔹 Mirai-Bot (Rudra Edition)\n🌐 https://github.com/Dev093235/Mirai-Bot

🔹 GoatBot - Rudra Custom\n🌐 https://github.com/Dev093235/GoatBot-Rudra

🔹 Auto-Bot (Mobile Ready)\n🌐 https://github.com/Dev093235/Auto-Bot

🔹 Rudra Tools Pack\n🌐 https://github.com/Dev093235/Rudra-Tools`,
    footer: `📌 Facebook: https://facebook.com/rudra.dev.digital
📌 GitHub: https://github.com/Dev093235`
  }
};

module.exports.handleEvent = async function ({ event, api, getText }) {
  const body = event.body?.toLowerCase() || "";
  const triggers = ["frok", "forklink", "myfrok", "githublink", "github", "rudralink"];

  if (triggers.some(trigger => body.startsWith(trigger))) {
    const message = `╭━〔 ${getText("title")} 〕━╮\n\n${getText("list")}\n\n━━━━━━━━━━━━━━━\n${getText("footer")}`;
    api.sendMessage(message, event.threadID, event.messageID);
  }
};

module.exports.run = () => {}; // No prefix needed
