require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userVoteSchema = new mongoose.Schema({
  chatId: Number,
  subscribed: Boolean,
});

const UserVote = mongoose.model("UserVote", userVoteSchema);

bot.start((ctx) => {
  ctx.reply("Вітаємо в Телеграм-Боті");
});

bot.command("game", (ctx) => {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Підписатися",
            callback_data: "subscribe",
          },
          {
            text: "Відписатися",
            callback_data: "unsubscribe",
          },
        ],
      ],
    },
  };
  ctx.reply("Виберіть дію:", keyboard);
});

bot.action("subscribe", async (ctx) => {
  const chatId = ctx.chat.id;
  try {
    let userVote = await UserVote.findOne({ chatId }).exec();
    if (!userVote) {
      userVote = new UserVote({ chatId, subscribed: true });
    } else {
      userVote.subscribed = true;
    }
    await userVote.save();
    ctx.answerCbQuery("Ви підписалися");
  } catch (err) {
    console.error(err);
    ctx.reply("Помилка при обробці запиту.");
  }
});

bot.action("unsubscribe", async (ctx) => {
  const chatId = ctx.chat.id;
  try {
    let userVote = await UserVote.findOne({ chatId }).exec();
    if (!userVote) {
      userVote = new UserVote({ chatId, subscribed: false });
    } else {
      userVote.subscribed = false;
    }
    await userVote.save();
    ctx.answerCbQuery("Ви відписалися");
  } catch (err) {
    console.error(err);
    ctx.reply("Помилка при обробці запиту.");
  }
});

bot.command("vote", async (ctx) => {
  const chatId = ctx.chat.id;
  try {
    const userVote = await UserVote.findOne({
      chatId,
      subscribed: true,
    }).exec();
    if (userVote) {
      // Запишіть голос користувача в базу даних
    } else {
      ctx.reply("Ви повинні бути підписаним, щоб голосувати.");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("Помилка при обробці запиту.");
  }
});

bot.launch();
