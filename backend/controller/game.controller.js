// Imports.
import Game from "../models/game.model.js";
import mongoose from "mongoose";
const validCategories = ["Featured", "New", "Driving", "Casual", "2 Player"];

// gameCreate.
export const gameCreate = async (req, res) => {
  try {
      const { title, description, iframeUrl, category } = req.body;

      if (!title) {
          return res.status(400).json({ error: "Title is required" });
      }

      if (!req.file) {
          return res.status(400).json({ error: "No image uploaded" });
      }

      const validCategories = ["Featured", "New", "Driving", "Casual", "2 Player"]; 

      if (!category || !validCategories.includes(category)) {
          return res.status(400).json({ error: "Invalid category selected" });
      }

      const existingGame = await Game.findOne({ title });
      if (existingGame) {
          return res.status(400).json({ error: "Game title already exists" });
      }

      const newGame = new Game({
          title,
          description,
          iframeUrl,
          imageUrl: req.file.path,
          category,
      });

      await newGame.save();

      res.status(201).json({
          message: "Game created successfully!",
          _id: newGame._id,
          title: newGame.title,
          description: newGame.description,
          iframeUrl: newGame.iframeUrl,
          imageUrl: newGame.imageUrl,
          category: newGame.category,
          likes: newGame.likes,
          dislikes: newGame.dislikes,
      });

  } catch (error) {
      console.error("Error in gameCreate controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// getAllGames.
export const getAllGames = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const games = await Game.find(filter);
        res.status(200).json(games);
    } catch (error) {
        console.error("Error fetching games:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// getGameById.
export const getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findById(id);

        if (!game) return res.status(404).json({ error: "Game not found" });

        res.status(200).json(game);
    } catch (error) {
        console.error("Error fetching game by ID:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// deleteGameById.
export const deleteGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findByIdAndDelete(id);

        if (!game) return res.status(404).json({ error: "Game not found" });

        res.status(200).json({ message: "Game deleted successfully!" });
    } catch (error) {
        console.error("Error deleting game:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// updateGameById.
export const updateGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, iframeUrl, category } = req.body;
        const imageUrl = req.file ? req.file.path : undefined;

        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category selected" });
        }

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { title, description, iframeUrl, category, ...(imageUrl && { imageUrl }) },
            { new: true, runValidators: true }
        );

        if (!updatedGame) return res.status(404).json({ error: "Game not found" });

        res.status(200).json({
            message: "Game updated successfully!",
            updatedGame,
        });

    } catch (error) {
        console.error("Error updating game:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// getGameByTitle.
export const getGameByTitle = async (req, res) => {
  try {
      const { title } = req.params;

      if (!Game) {
          console.error("Game model is not defined");
          return res.status(500).json({ error: "Game model error" });
      }

      const foundGames = await Game.find({ title: { $regex: title, $options: "i" } });

      if (!foundGames || foundGames.length === 0) {
          return res.status(404).json({ error: "No matching games found" });
      }

      res.status(200).json(foundGames);
  } catch (error) {
      console.error("Error fetching game by title:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// likeGame.
export const likeGame = async (req, res) => {
    try {
      const { id } = req.params;
  

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Game ID" });
      }
  
      const game = await Game.findById(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
  
      game.likes += 1;
      await game.save();
  
      res.status(200).json({
        message: "Game liked successfully!",
        likes: game.likes,
        dislikes: game.dislikes,
      });
    } catch (error) {
      console.error("Error liking game:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
  
// dislikeGame.
export const dislikeGame = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Game ID" });
      }
  
      const game = await Game.findById(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
  
      game.dislikes += 1;
      await game.save();
  
      res.status(200).json({
        message: "Game disliked successfully!",
        likes: game.likes,
        dislikes: game.dislikes,
      });
    } catch (error) {
      console.error("Error disliking game:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
