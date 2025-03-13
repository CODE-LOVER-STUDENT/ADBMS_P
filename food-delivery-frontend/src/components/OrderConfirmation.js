import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, deliveryPerson } = location.state || {};

    if (!orderId || !deliveryPerson) {
        navigate("/");
        return null;
    }

    return (
        <div>
            <h2>Order Placed!</h2>
            <h3>Delivery Person Details:</h3>
            <p><strong>Name:</strong> {deliveryPerson.delivery_person_name}</p>
            <p><strong>Phone:</strong> {deliveryPerson.phone_number}</p>
            
            <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
    );
};

export default OrderConfirmation;
