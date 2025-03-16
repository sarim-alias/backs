import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  iframeUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ["Featured", "New", "Driving", "Casual", "2 Player"],
  },
  likes: {
    type: Number,
    default: 15000 
  },
  dislikes: {
    type: Number,
    default: 1000 
  }
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);

export default Game;