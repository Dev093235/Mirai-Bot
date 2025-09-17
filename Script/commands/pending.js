module.exports.config = {
  name: "pending",
  version: "1.0.6",
  credits: "Rudra",
  hasPermssion: 2,
  description: "Manage pending group requests for bot access",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    invaildNumber: "❌ %1 is not a valid number.",
    cancelSuccess: "🚫 Removed from %1 group(s).",
    notiBox: "✅ Your group has been approved to use the bot!",
    approveSuccess: "🎉 Approved %1 group(s) successfully!",
    cantGetPendingList: "⚠️ Unable to fetch pending list!",
    returnListPending: "📥 Pending Approval List (%1 total):\n\n%2",
    returnListClean: "✅ No pending groups found!"
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, getText }) {
  if (String(event.senderID) !== String(handleReply.author)) return;
  const { body, threadID, messageID } = event;
  let count = 0;

  if ((isNaN(body) && body.startsWith("c")) || body.startsWith("cancel")) {
    const indexList = body.slice(1).trim().split(/\s+/);
    for (const singleIndex of indexList) {
      if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length)
        return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
      api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
      count++;
    }
    return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
  } else {
    const indexList = body.trim().split(/\s+/);
    for (const singleIndex of indexList) {
      if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length)
        return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
      api.sendMessage(getText("notiBox"), handleReply.pending[singleIndex - 1].threadID);
      count++;
    }
    return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, getText }) {
  const { threadID, messageID } = event;
  const commandName = this.config.name;
  let msg = "", index = 1;

  try {
    const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) {
      msg += `${index++}. ${single.name} (${single.threadID})\n`;
    }

    if (list.length > 0) {
      return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (error, info) => {
        global.client.handleReply.push({
          name: commandName,
          messageID: info.messageID,
          author: event.senderID,
          pending: list
        });
      }, messageID);
    } else {
      return api.sendMessage(getText("returnListClean"), threadID, messageID);
    }
  } catch (e) {
    return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
  }
};
