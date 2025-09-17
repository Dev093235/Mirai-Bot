module.exports.config = {
  name: "goiadmin",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Bot replies when someone tags an admin",
  commandCategory: "utility",
  usages: "",
  cooldowns: 1
};

module.exports.languages = {
  en: {
    message: "Bhai, admin ko bina reason tag mat karo!"
  }
};

module.exports.handleEvent = function({ api, event }) {
  const adminIDs = ["61550558518720"]; // Replace with actual admin UID(s)
  const mentionIDs = Object.keys(event.mentions || {});

  if (mentionIDs.some(id => adminIDs.includes(id))) {
    const responses = [
      "⚠️ Bhai, admin busy hai code likhne mein. Tag mat kar bina kaam ke!",
      "😤 Admin ko tag karne se kaam nahi hota, chai leke aa!",
      "🧘‍♂️ Rudra abhi UI/UX ke dhyaan mein hai. Disturb mat kar!",
      "💻 Admin kaam mein ghusa hua hai—branding, bugs, aur bot ka upgrade chal raha hai!",
      "📵 Aise hi tag karega toh ignore milne wala hai 😎"
    ];

    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function() {};
