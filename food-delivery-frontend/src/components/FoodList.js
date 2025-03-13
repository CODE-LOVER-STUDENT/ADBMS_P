import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodList = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/foods")
            .then(response => setFoods(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Food Menu</h2>
            <ul>
                {foods.map(food => (
                    <li key={food.id}>
                        {food.name} - ${food.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodList;
