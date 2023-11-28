const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const userVoteSchema = new mongoose.Schema({
  chatId: Number, // Ідентифікатор чату
  subscribed: Boolean, // Підписаний чи ні
});

const UserVote = mongoose.model("UserVote", userVoteSchema);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/userVotes", async (req, res) => {
  try {
    const userVotes = await UserVote.find().exec();
    res.json(userVotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
