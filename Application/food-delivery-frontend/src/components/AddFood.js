import React, { useState } from "react";
import axios from "axios";

const AddFood = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image_url, setImageUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/foods", { name, price, description, image_url });
        alert("Food Added!");
    };

    return (
        <div>
            <h2>Add Food</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="text" placeholder="Image URL" value={image_url} onChange={(e) => setImageUrl(e.target.value)} />
                <button type="submit">Add Food</button>
            </form>
        </div>
    );
};

export default AddFood;
