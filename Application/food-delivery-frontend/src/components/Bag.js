import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Bag = () => {
    const [bagItems, setBagItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        // Fetch bag items
        axios.get("http://localhost:5000/bag")
            .then(response => setBagItems(response.data))
            .catch(error => console.error("Error fetching bag:", error));
        
        // Fetch saved addresses
        axios.get("http://localhost:5000/addresses")
            .then(response => {
                setAddresses(response.data);
                if (response.data.length > 0) {
                    setSelectedAddress(response.data[0].id); // Default to first address
                }
            })
            .catch(error => console.error("Error fetching addresses:", error));
    }, []);

    // Function to update quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity >= 1) {
            axios.put(`http://localhost:5000/bag/${itemId}`, { quantity: newQuantity })
                .then(() => {
                    setBagItems(prevItems =>
                        prevItems.map(item =>
                            item.id === itemId ? { ...item, quantity: newQuantity } : item
                        )
                    );
                })
                .catch(error => console.error("Error updating quantity:", error));
        } else {
            removeItem(itemId); // If quantity is 0, remove item
        }
    };

    // Function to remove item from bag
    const removeItem = (itemId) => {
        axios.delete(`http://localhost:5000/bag/${itemId}`)
            .then(() => {
                setBagItems(prevItems => prevItems.filter(item => item.id !== itemId));
            })
            .catch(error => console.error("Error removing item:", error));
    };

    // Function to navigate to Payment page
    const handleContinue = () => {
        if (selectedAddress) {
            const selectedAddressObject = addresses.find(addr => addr.id === selectedAddress);
            navigate("/payment", { state: { selectedAddress: selectedAddressObject } });
                    }
    };

    return (
        <div>
            <h2>My Bag</h2>
            {bagItems.length === 0 ? (
                <p>Your bag is empty</p>
            ) : (
                <ul>
                    {bagItems.map(item => (
                        <li key={item.id}>
                            <h3>{item.food_name}</h3>
                            <p>💲{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Address Selection using Radio Buttons */}
            <h3>Select Delivery Address</h3>
            {addresses.length === 0 ? (
                <p>No saved addresses.</p>
            ) : (
                <div>
                    {addresses.map((address) => (
                        <label key={address.id} style={{ display: "block", marginBottom: "8px" }}>
                            <input
                                type="radio"
                                name="address"
                                value={address.id}
                                checked={selectedAddress === address.id}
                                onChange={(e) => setSelectedAddress(Number(e.target.value))}
                            />
                            {address.name}, {address.street}, {address.city}, {address.zip}
                        </label>
                    ))}
                </div>
            )}

            <br />
            {/* Manage Addresses Button */}
            <Link to="/address">
                <button>Manage Addresses</button>
            </Link>

            {/* Continue Button */}
            <br /><br />
            <button onClick={handleContinue} disabled={!selectedAddress}>
                Continue
            </button>
        </div>
    );
};

export default Bag;
