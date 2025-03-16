// Imports.
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Game = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Validation.
  const gameSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    iframeUrl: Yup.string().url("Invalid URL format").required("iframeUrl is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.mixed().required("Image is required"),
  });

  // Handle file selection.
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Submit.
  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("iframeUrl", values.iframeUrl);
      formData.append("category", values.category)
      formData.append("image", selectedFile); // ✅ Append file

      const response = await fetch("http://localhost:5000/api/games/game/create", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Game added successfully! 🎮");
        resetForm();
        setSelectedFile(null);
      } else {
        setErrors({ server: data.error });
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating game:", error);
      setErrors({ server: "Something went wrong" });
      toast.error("Something went wrong! ❌");
    }
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl text-white font-semibold mb-4">Game 🍪</h1>

      <Formik
        initialValues={{ title: "", description: "", iframeUrl: "",  category: "", image: null }}
        validationSchema={gameSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, setFieldValue }) => (
          <Form className="max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            {errors.server && <p className="text-red-500 text-sm mb-4">{errors.server}</p>}

            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-300 mb-1">Title</label>
              <Field id="title" name="title" type="text" className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500" />
              <ErrorMessage name="title" component="p" className="text-red-400 text-sm mt-1" />
            </div>

            {/* iframe URL */}
            <div className="mb-4">
              <label htmlFor="iframeUrl" className="block text-gray-300 mb-1">iframes Url</label>
              <Field id="iframeUrl" name="iframeUrl" type="text" className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500" />
              <ErrorMessage name="iframeUrl" component="p" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-300 mb-1">Description</label>
              <Field as="textarea" id="description" name="description" className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500" />
              <ErrorMessage name="description" component="p" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-300 mb-1">Category</label>
              <Field as="select" id="category" name="category" className="w-full p-2 border rounded bg-gray-700 text-white">
                <option value="">Select Category</option>
                <option value="Featured">Featured</option>
                <option value="New">New</option>
                <option value="Driving">Driving</option>
                <option value="Casual">Casual</option>
                <option value="2 Player">2 Player</option>
              </Field>
              <ErrorMessage name="category" component="p" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-300 mb-1">Upload Image</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  handleFileChange(event);
                  setFieldValue("image", event.target.files[0]); // ✅ Update Formik field
                }}
                className="w-full p-2 border rounded bg-gray-700 text-white cursor-pointer"
              />
              <ErrorMessage name="image" component="p" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-[#6842ff] px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-[#5630d0] transition-all"
            >
              {isSubmitting ? "Adding..." : "Add Game"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Game;
