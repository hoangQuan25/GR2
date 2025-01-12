import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuctionAPI from "../../api/AuctionAPI"; // The auction microservice
import { AuthContext } from "../../context/AuthContext";

const ProductForm = () => {
  const { auth } = useContext(AuthContext);
  const { productId } = useParams(); // if we are editing an existing product
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    estimatedPriceMin: "",
    estimatedPriceMax: "",
    imageFile: null
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      const res = await AuctionAPI.get(`/products/${id}`);
      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        estimatedPriceMin: res.data.estimatedPriceMin || "",
        estimatedPriceMax: res.data.estimatedPriceMax || "",
        imageFile: null
      });
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare multipart form data for file upload
      const formData = new FormData();
      formData.append("ownerId", auth.user.id);
      formData.append("ownerName", auth.user.firstName); // optional
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("estimatedPriceMin", form.estimatedPriceMin);
      formData.append("estimatedPriceMax", form.estimatedPriceMax);
      if (form.imageFile) {
        formData.append("imageFile", form.imageFile);
      }

      if (productId) {
        // Update existing product
        await AuctionAPI.put(`/products/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Create new product
        await AuctionAPI.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      navigate("/my-products");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {productId ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full border p-2"
          />
        </div>
        <div className="flex space-x-2 mb-4">
          <div>
            <label className="block font-medium text-gray-700">Min Price</label>
            <input
              name="estimatedPriceMin"
              type="number"
              value={form.estimatedPriceMin}
              onChange={handleChange}
              className="border p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Max Price</label>
            <input
              name="estimatedPriceMax"
              type="number"
              value={form.estimatedPriceMax}
              onChange={handleChange}
              className="border p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Image</label>
          <input
            name="imageFile"
            type="file"
            onChange={handleChange}
            className="border p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {productId ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
