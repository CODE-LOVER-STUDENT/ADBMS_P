const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming you have a MySQL database connection file

// Assign a delivery person when an order is confirmed
router.post("/assign-delivery", async (req, res) => {
    try {
        const { order_id } = req.body;

        // Get an available delivery person (who is not assigned yet)
        const [deliveryPerson] = await db.promise().query(
            "SELECT * FROM delivery_person WHERE assigned_order_id IS NULL LIMIT 1"
        );

        if (deliveryPerson.length === 0) {
            return res.status(400).json({ message: "No available delivery person" });
        }

        const selectedPerson = deliveryPerson[0];

        // Assign the delivery person to the order
        await db.promise().query(
            "UPDATE delivery_person SET assigned_order_id = ? WHERE delivery_person_id = ?",
            [order_id, selectedPerson.delivery_person_id]
        );

        res.json({ message: "Delivery assigned", deliveryPerson: selectedPerson });
    } catch (error) {
        console.error("Error assigning delivery person:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

