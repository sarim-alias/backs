import React, { useState, useEffect } from "react";

const Categories = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Dummy Categories for Adding New Ones
  const dummyCategories = [
    { _id: "dummy1", name: "Action" },
    { _id: "dummy2", name: "Adventure" },
    { _id: "dummy3", name: "Puzzle" },
    { _id: "dummy4", name: "Strategy" },
  ];

  // Fetch Games
  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  // Fetch Categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Update Game with Category
  const updateGameCategory = async () => {
    if (!selectedGame || !selectedCategory) {
      alert("Please select both a game and a category.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/games/${selectedGame}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      });

      if (response.ok) {
        alert("Category updated successfully!");
      } else {
        alert("Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Add New Category to Backend
  const addNewCategory = async () => {
    if (!newCategory) {
      alert("Please select a category to add.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        alert("Category added successfully!");
        setCategories([...categories, { _id: Date.now(), name: newCategory }]); // Update state
      } else {
        alert("Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl text-white font-semibold mb-4">Manage Categories 📚</h2>

      {/* Game Dropdown */}
      <select
        className="p-2 bg-gray-700 text-white rounded-md w-full mb-4"
        onChange={(e) => setSelectedGame(e.target.value)}
        value={selectedGame}
      >
        <option value="">Select a Game</option>
        {games.map((game) => (
          <option key={game._id} value={game._id}>
            {game.title}
          </option>
        ))}
      </select>

      {/* Category Dropdown */}
      <select
        className="p-2 bg-gray-700 text-white rounded-md w-full mb-4"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
        disabled={!selectedGame}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Save Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full mb-6"
        onClick={updateGameCategory}
        disabled={!selectedGame || !selectedCategory}
      >
        Save Category to Game
      </button>

      {/* Add New Category Section */}
      <h3 className="text-lg text-white font-semibold mb-2">Add a New Category</h3>
      <select
        className="p-2 bg-gray-700 text-white rounded-md w-full mb-4"
        onChange={(e) => setNewCategory(e.target.value)}
        value={newCategory}
      >
        <option value="">Select a Category to Add</option>
        {dummyCategories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full"
        onClick={addNewCategory}
        disabled={!newCategory}
      >
        Add Category to Backend
      </button>
    </div>
  );
};

export default Categories;
