module.exports.config = {
  name: "setprefix",
  version: "1.0.2",
  hasPermssion: 1,
  credits: "Rudra",
  description: "🔧 Change group prefix or reset to default",
  commandCategory: "config",
  usages: "[prefix/reset]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    successChange: "✅ Prefix changed to: %1",
    missingInput: "⚠️ Please provide a prefix to set.",
    resetPrefix: "🔄 Prefix reset to default: %1",
    confirmChange: "🛠️ Are you sure you want to change prefix to: %1"
  }
};

module.exports.handleReaction = async function ({ api, event, Threads, handleReaction, getText }) {
  try {
    if (event.userID != handleReaction.author) return;
    const { threadID, messageID } = event;
    const data = (await Threads.getData(String(threadID))).data || {};
    data["PREFIX"] = handleReaction.PREFIX;
    await Threads.setData(threadID, { data });
    await global.data.threadData.set(String(threadID), data);
    api.unsendMessage(handleReaction.messageID);
    return api.sendMessage(getText("successChange", handleReaction.PREFIX), threadID, messageID);
  } catch (e) {
    console.log("❌ Error in handleReaction:", e);
  }
};

module.exports.run = async ({ api, event, args, Threads, getText }) => {
  if (!args[0]) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
  const prefix = args[0].trim();
  if (!prefix) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

  if (prefix.toLowerCase() === "reset") {
    const data = (await Threads.getData(event.threadID)).data || {};
    data["PREFIX"] = global.config.PREFIX;
    await Threads.setData(event.threadID, { data });
    await global.data.threadData.set(String(event.threadID), data);
    return api.sendMessage(getText("resetPrefix", global.config.PREFIX), event.threadID, event.messageID);
  }

  return api.sendMessage(getText("confirmChange", prefix), event.threadID, (error, info) => {
    global.client.handleReaction.push({
      name: "setprefix",
      messageID: info.messageID,
      author: event.senderID,
      PREFIX: prefix
    });
  });
};
