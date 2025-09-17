const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Rudra",
  description: "Shows full info of current group",
  commandCategory: "group",
  usages: "groupinfo",
  cooldowns: 0
};

module.exports.languages = {
  en: {
    info: `
📊 Group Info:
🔹 Name: %1
🔹 Group ID: %2
🔹 Approval Mode: %3
🔹 Emoji: %4
🔹 Total Members: %5
🔹 Males: %6
🔹 Females: %7
🔹 Admins: %8
🔹 Total Messages: %9

🛠 Powered by Rudra`
  }
};

module.exports.run = async function ({ api, event, getText }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const memLength = threadInfo.participantIDs.length;

  let genderMale = 0, genderFemale = 0;

  for (const user of threadInfo.userInfo) {
    if (user.gender === "MALE") genderMale++;
    else if (user.gender === "FEMALE") genderFemale++;
  }

  const approval = threadInfo.approvalMode ? "On ✅" : "Off ❌";
  const threadName = threadInfo.threadName || "No name";
  const emoji = threadInfo.emoji || "❔";
  const groupID = threadInfo.threadID;
  const totalMsg = threadInfo.messageCount;
  const adminCount = threadInfo.adminIDs.length;

  const messageText = getText("info", threadName, groupID, approval, emoji, memLength, genderMale, genderFemale, adminCount, totalMsg);

  const callback = () => {
    api.sendMessage({
      body: messageText,
      attachment: fs.existsSync(__dirname + '/cache/groupinfo.png') ? fs.createReadStream(__dirname + '/cache/groupinfo.png') : undefined
    }, event.threadID, () => {
      if (fs.existsSync(__dirname + '/cache/groupinfo.png')) {
        fs.unlinkSync(__dirname + '/cache/groupinfo.png');
      }
    }, event.messageID);
  };

  if (threadInfo.imageSrc) {
    request(encodeURI(threadInfo.imageSrc))
      .pipe(fs.createWriteStream(__dirname + '/cache/groupinfo.png'))
      .on('close', () => callback());
  } else {
    callback();
  }
};
