//=========================//
//  🐐 CmdStore Command    //
//  Author: Rudra          //
//  Version: 1.0.2         //
//=========================//

const axios = require("axios");

module.exports.config = {
  name: "cmdstore",
  aliases: ["cs", "market"],
  version: "1.0.2",
  role: 0,
  author: "Rudra",
  description: "📌 Browse Rudra's commands from GitHub dynamically.",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const apiUrl = "https://my-api-show.vercel.app/api/cmdstore";

  const sendMsg = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  const formatDateIN = (date) =>
    new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  //================ Handlers ================//
  const handleShow = async (id) => {
    if (!id) return sendMsg("❌ Bhai, valid ID toh de.");
    try {
      const { data } = await axios.get(apiUrl, { params: { id } });
      if (!data.items || !data.items.length) return sendMsg("⚠️ Command nahi mila.");

      const cmd = data.items[0];
      sendMsg(`
💎 𝗖𝗺𝗱𝗦𝘁𝗼𝗿𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗜𝗻𝗳𝗼 💎

👑 Name       : ${cmd.itemName}
🆔 ID         : ${cmd.itemID}
⚙️ Type       : ${cmd.type || "Unknown"}
📝 Description: ${cmd.description || "No description"}
👨‍💻 Author    : ${cmd.authorName}
🔗 Code       : https://github.com/Dev093235/cmd-and-Api/raw/main/${cmd.rawID}
📅 Added      : ${formatDateIN(cmd.createdAt)}
👀 Views      : ${cmd.views || 0}
💝 Likes      : ${cmd.likes || 0}

💡 Tip: Use 'cmdstore search <query>' to find more commands!
      `);
    } catch (err) {
      console.error(err);
      sendMsg("❌ Command fetch karne mein error aaya.");
    }
  };

  const handleSearch = async (query) => {
    if (!query) return sendMsg("❌ Search query toh daal bhai.");
    try {
      const { data } = await axios.get(apiUrl, { params: { search: query } });
      if (!data.items || !data.items.length) return sendMsg("⚠️ Kuch bhi nahi mila.");

      const output = data.items
        .slice(0, 5)
        .map(
          (cmd, i) => `
💠 ${i + 1}. ${cmd.itemName}
🆔 ID         : ${cmd.itemID}
⚙️ Type       : ${cmd.type}
📝 Description: ${cmd.description || "No description"}
👨‍💻 Author    : ${cmd.authorName}`
        )
        .join("\n");

      sendMsg(`
🔍 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 for: "${query}"  

${output}

💡 Tip: Use 'cmdstore show <ID>' to see full details.
      `);
    } catch (err) {
      console.error(err);
      sendMsg("❌ Search karne mein error aaya.");
    }
  };

  //================ Command Router ================//
  try {
    const cmd = (args[0] || "").toLowerCase();
    const param = args.slice(1).join(" ");
    switch (cmd) {
      case "show":
        return handleShow(param);
      case "search":
        return handleSearch(param);
      default:
        return sendMsg(`
📌 𝗖𝗺𝗱𝗦𝘁𝗼𝗿𝗲 𝗛𝗲𝗹𝗽

🔹 Show Command Info:
▶ ${event.body} show <ID>
Example: show 1

🔹 Search Commands:
▶ ${event.body} search <query>
Example: search pinterest
        `);
    }
  } catch (err) {
    console.error(err);
    sendMsg("❌ Kuch toh gadbad ho gaya.");
  }
};
