import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/restaurants")
            .then(response => setRestaurants(response.data))
            .catch(error => console.error("Error fetching restaurants:", error));
    }, []);

    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map(restaurant => (
                    <li key={restaurant.id}>
                        <h3>{restaurant.name}</h3>
                        <p>📍 {restaurant.location}</p>
                        <p>⭐ Rating: {restaurant.rating}</p>
                        <img src={restaurant.image_url} alt={restaurant.name} width="150" />
                        <br />
                        <Link to={`/menu/${restaurant.id}`}>
                            <button>View Menu</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Restaurants;
