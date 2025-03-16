// Imports.
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { FaThumbsUp, FaThumbsDown, FaSearch } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


// Frontend.
const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState({
    title: "",
    description: "",
    iframeUrl: "",
    category: "",
    imageUrl: "",
  });

  // Fetch.
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Search.
  const searchGames = async () => {
    if (searchTerm.trim() === "") {
      fetchGames();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/games/title/${searchTerm}`);
      if (!response.ok) throw new Error("No games found");

      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error searching games:", error);
      setGames([]);
    }
  };

  // Edit.
  const openEditModal = (game) => {
    setCurrentGame(game);
    setIsModalOpen(true);
  };

  // Delete.
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Game deleted successfully! 🚀");
        fetchGames();
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Something went wrong! ❌");
    }
  };

  // Update.
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", currentGame.title);
      formData.append("description", currentGame.description);
      formData.append("iframeUrl", currentGame.iframeUrl);
      formData.append("category", currentGame.category);

      if (currentGame.imageFile) {
        formData.append("image", currentGame.imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/games/${currentGame._id}`, {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Game updated successfully! 🎮");
        fetchGames();
        setIsModalOpen(false);
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating game:", error);
      toast.error("Something went wrong! ❌");
    }
  };

  return (
    <div className="relative min-h-screen p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-white font-semibold">Dashboard ⭐</h1>

        {/* Search Bar */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchGames}
            className="w-full p-2 pr-10 border rounded bg-gray-700 text-white"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Games List */}
      <div className="mt-4">
        {games.map((game) => (
          <div
            key={game._id}
            className="flex items-center bg-gray-800 p-4 rounded-lg mb-4"
          >
            {/* Image */}
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />

            {/* Title + Description */}
            <div className="flex-1">
              <h2 className="text-white font-semibold">{game.title}</h2>
              <p className="text-gray-400 text-sm">{game.description}</p>
            </div>

            {/* Category + Like & Dislike */}
            <div className="flex flex-col items-center space-y-2 px-4">
              {/* Category */}
              <h3 className="text-yellow-400 text-xs font-bold">
                {game.category}
              </h3>

              <div className="flex items-center space-x-6">
                {/* Like */}
                <div className="flex flex-col items-center">
                  <FaThumbsUp className="text-green-400 text-xl cursor-pointer" />
                  <span className="text-white text-sm">
                    {game.likes.toLocaleString()}
                  </span>
                </div>

                {/* Dislike */}
                <div className="flex flex-col items-center">
                  <FaThumbsDown className="text-red-400 text-xl cursor-pointer" />
                  <span className="text-white text-sm">
                    {game.dislikes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit & Delete Buttons */}
            <div className="ml-auto flex space-x-2">
              <button
                onClick={() => openEditModal(game)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(game._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal bg-gray-900 p-5 rounded-lg"
      >
        <h2 className="text-xl text-white mb-4">Edit Game</h2>
        <input
          type="text"
          value={currentGame.title}
          onChange={(e) =>
            setCurrentGame({ ...currentGame, title: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
          placeholder="Title"
        />
        <textarea
          value={currentGame.description}
          onChange={(e) =>
            setCurrentGame({ ...currentGame, description: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
          placeholder="Description"
        ></textarea>
        <input
          type="text"
          value={currentGame.iframeUrl}
          onChange={(e) =>
            setCurrentGame({ ...currentGame, iframeUrl: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
          placeholder="iFrame URL"
        />

        {/* Dropdown for Category */}
        <select
          value={currentGame.category}
          onChange={(e) =>
            setCurrentGame({ ...currentGame, category: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
        >
          <option value="" disabled>
            Select Category
          </option>
          {["Featured", "New", "Driving", "Casual", "2 Player"].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) =>
            setCurrentGame({ ...currentGame, imageFile: e.target.files[0] })
          }
          className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
        />
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Update
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default Dashboard;
