import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { restaurantName, restaurantId, bagItems, totalPrice, addressId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!restaurantName || !bagItems || !totalPrice || !addressId) {
            navigate("/bag"); // Redirect back if data is missing
        }
    }, [restaurantName, bagItems, totalPrice, addressId, navigate]);

    const handleCancelOrder = () => {
        navigate("/bag");
    };

    const handleConfirmOrder = () => {
        setLoading(true);
        setError(null);

        // Step 1: Place the Order
        axios.post("http://localhost:5000/orders", {
            restaurant_id: restaurantId,
            restaurant_name: restaurantName,
            address_id: addressId,
            total_price: totalPrice,
            items: bagItems
        })
        .then(response => {
            const orderId = response.data.orderId;

            // Step 2: Assign Delivery Person (Fixed API call)
            return axios.put(`http://localhost:5000/orders/${orderId}/assign-delivery`)
                .then(deliveryResponse => ({ orderId, deliveryPerson: deliveryResponse.data.deliveryPerson }));
        })
        .then(({ orderId, deliveryPerson }) => {
            alert(`Order assigned to ${deliveryPerson.delivery_person_name}`);
            navigate("/order-confirmation", { state: { orderId, deliveryPerson } });
        })
        .catch(error => {
            console.error("Error processing order:", error);
            setError("Failed to place order. Please try again.");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div>
            <h2>Receipt</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><strong>Restaurant:</strong> {restaurantName}</p>
            <ul>
                {bagItems?.map(item => (
                    <li key={item.id}>
                        {item.food_name} - {item.quantity} x 💲{item.price}
                    </li>
                ))}
            </ul>
            <p><strong>Total Price:</strong> 💲{totalPrice}</p>

            <button onClick={handleConfirmOrder} disabled={loading}>
                {loading ? "Processing..." : "Continue"}
            </button>
            <button onClick={handleCancelOrder} disabled={loading}>
                Cancel Order
            </button>
        </div>
    );
};

export default Receipt;
