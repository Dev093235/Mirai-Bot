const axios = require("axios");

module.exports.config = {
  name: "gemini",
  aliases: ["ai", "ask"],
  version: "2.0.1",
  author: "Rudra",
  cooldowns: 5,
  role: 0,
  shortDescription: "Ask Gemini AI anything",
  longDescription: "Chat with Gemini AI using Aryan API and get stylish replies"
};

module.exports.languages = {
  en: {
    noQuestion: "❌ Bhai, pehle question toh daal!\n📌 Example:\n- gemini Hi\n- gemini koi story suna",
    noResponse: "⚠️ Gemini ne kuch bola hi nahi...",
    apiError: "⚠️ Gemini se reply nahi aaya, kuch toh gadbad hai."
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID, senderName } = event;

  if (!args || args.length === 0) {
    return api.sendMessage(`🛑 ${getText("noQuestion")}`, threadID, messageID);
  }

  const question = args.join(" ");
  const geminiUrl = `https://aryan-nix-apis.vercel.app/api/gemini?prompt=${encodeURIComponent(question)}`;

  api.sendMessage(`💬 Gemini AI soch raha hai... 🤖`, threadID);

  try {
    const res = await axios.get(geminiUrl);
    const answer = res?.data?.response || getText("noResponse");

    const reply = 
`🌟 Gemini AI Reply 🌟
👤 User: ${senderName}
❓ Question: ${question}

💡 Answer:
${answer}

🚀 Powered by Rudra`;

    return api.sendMessage(reply, threadID, messageID);

  } catch (error) {
    console.error("❌ Gemini API Error:", error?.response?.data || error.message);
    return api.sendMessage(
      `⚠️ ${getText("apiError")}\n\nDetails: ${error.message}`,
      threadID,
      messageID
    );
  }
};
