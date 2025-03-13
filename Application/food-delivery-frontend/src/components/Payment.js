import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedAddress = location.state?.selectedAddress;
    const [paymentMethod, setPaymentMethod] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [bagItems, setBagItems] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/bag")
            .then(response => {
                setBagItems(response.data);
                if (response.data.length > 0) {
                    const restaurantId = response.data[0].restaurant_id;
                    setRestaurantId(restaurantId);
                    axios.get(`http://localhost:5000/restaurants/${restaurantId}`)
                        .then(res => setRestaurantName(res.data.name))
                        .catch(err => console.error("Error fetching restaurant:", err));
                }
            })
            .catch(error => console.error("Error fetching bag:", error));
    }, []);

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleProceed = () => {
        if (!paymentMethod) {
            alert("Please select a payment method!");
            return;
        }

        const totalPrice = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setReceipt({ restaurantName, bagItems, totalPrice });
    };

    const handleCancelOrder = () => {
        navigate("/bag");
    };

    // const handleConfirmOrder = () => {
    //     const totalPrice = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
        
    //     axios.post("http://localhost:5000/orders/place", {
    //         restaurant_id: restaurantId,
    //         restaurant_name: restaurantName,
    //         total_price: totalPrice,
    //         address: `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}`
    //     })
    //     .then(response => {
    //         alert(`Order placed! Delivery assigned to ${response.data.deliveryPerson.delivery_person_name}`);
    //         navigate("/");
    //     })
    //     .catch(error => console.error("Error placing order:", error));
    // };
  
    const handleConfirmOrder = () => {
        axios.post("http://localhost:5000/orders", {
            restaurant_id: restaurantId,  // Now using it
            restaurant_name: restaurantName,
            total_price: bagItems.reduce((total, item) => total + item.price * item.quantity, 0),
            address: selectedAddress ? `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}` : "N/A"
        })
        .then(response => {
            const orderId = response.data.order_id;
            navigate("/order-confirmation", { state: { orderId } });
        })
        .catch(error => console.error("Error confirming order:", error));
    };
    
    
    return (
        <div>
            <h2>Payment</h2>

            {receipt ? (
                <div>
                    <h3>Receipt</h3>
                    <p><strong>Restaurant:</strong> {receipt.restaurantName}</p>
                    <ul>
                        {receipt.bagItems.map(item => (
                            <li key={item.id}>
                                {item.food_name} - {item.quantity} x 💲{item.price}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total Price:</strong> 💲{receipt.totalPrice}</p>

                    <button onClick={handleConfirmOrder}>Continue</button>
                    <button onClick={handleCancelOrder}>Cancel Order</button>
                </div>
            ) : (
                <div>
                    <h3>Delivery Address</h3>
                    {selectedAddress ? (
                        <p>{selectedAddress.name}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.zip}</p>
                    ) : (
                        <p>No address selected.</p>
                    )}

                    <h3>Select Payment Method</h3>
                    <label>
                        <input type="radio" name="payment" value="Card" onChange={handlePaymentChange} />
                        Card
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="payment" value="UPI" onChange={handlePaymentChange} />
                        UPI
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="payment" value="Cash on Delivery" onChange={handlePaymentChange} />
                        Cash on Delivery
                    </label>
                    <br />
                    <button onClick={handleProceed}>Proceed to Payment</button>
                </div>
            )}
        </div>
    );
};

export default Payment;
