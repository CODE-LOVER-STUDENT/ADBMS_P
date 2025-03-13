import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Menu = () => {
    const { restaurantId } = useParams();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/menu/${restaurantId}`)
            .then(response => setMenuItems(response.data))
            .catch(error => console.error("Error fetching menu:", error));
    }, [restaurantId]);

    const addToBag = (food) => {
        axios.post("http://localhost:5000/bag", {
            food_id: food.id,
            food_name: food.name,
            price: food.price,
            restaurant_id: restaurantId
        })
        .then(response => alert("Added to bag!"))
        .catch(error => console.error("Error adding to bag:", error));
    };

    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {menuItems.map(item => (
                    <li key={item.id}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>💲{item.price}</p>
                        <img src={item.image_url} alt={item.name} width="150" />
                        <br />
                        <button onClick={() => addToBag(item)}>Add to Bag</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;
