module.exports.config = {
  name: "admin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Dev",
  description: "Show custom user info",
  commandCategory: "info",
  cooldowns: 1
};

module.exports.languages = {
  en: {
    message: `📱 USER INFO
╔══❀══◄░❀░►══❀══╗

🔹 Phone ➪ 8950386412  
🔹 Facebook UID ➪ 61550558518720  
🔹 Profile Link ➪ https://www.facebook.com/profile.php?id=61550558518720

🔹 Status ➪ Active | Verified  
🔹 Note ➪ For bot testing & command integration

╚══❀══◄░❀░►══❀══╝`
  }
};

module.exports.run = async function ({ api, event, getText }) {
  return api.sendMessage(getText("message"), event.threadID, event.messageID);
};
