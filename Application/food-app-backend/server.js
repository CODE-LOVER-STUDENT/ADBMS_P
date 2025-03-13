const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "boot",
    database: "food_delivery_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Get all restaurants
app.get("/restaurants", (req, res) => {
    db.query("SELECT * FROM restaurants", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get menu items by restaurant ID
app.get("/menu/:restaurant_id", (req, res) => {
    const restaurantId = req.params.restaurant_id;
    db.query("SELECT * FROM menu WHERE restaurant_id = ?", [restaurantId], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add item to bag
app.post("/bag", (req, res) => {
    const { food_id, food_name, price, restaurant_id } = req.body;

    db.query("SELECT * FROM bag WHERE food_id = ?", [food_id], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            db.query(
                "UPDATE bag SET quantity = quantity + 1 WHERE food_id = ?",
                [food_id],
                (err) => {
                    if (err) throw err;
                    res.json({ message: "Quantity updated" });
                }
            );
        } else {
            db.query(
                "INSERT INTO bag (food_id, food_name, price, restaurant_id, quantity) VALUES (?, ?, ?, ?, 1)",
                [food_id, food_name, price, restaurant_id],
                (err) => {
                    if (err) throw err;
                    res.json({ message: "Item added to bag" });
                }
            );
        }
    });
});

// Get all bag items
app.get("/bag", (req, res) => {
    db.query("SELECT * FROM bag", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Remove item from bag
app.delete("/bag/:id", (req, res) => {
    db.query("DELETE FROM bag WHERE id = ?", [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: "Item removed from bag" });
    });
});

// Create Order & Store in Database
app.post("/orders", (req, res) => {
    const { restaurant_id, restaurant_name, address_id, total_price, items } = req.body;

    const insertOrderQuery = "INSERT INTO orders (restaurant_id, restaurant_name, address_id, total_price, status) VALUES (?, ?, ?, ?, 'Pending')";
    db.query(insertOrderQuery, [restaurant_id, restaurant_name, address_id, total_price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to create order" });
        }

        const orderId = result.insertId;

        const insertItemsQuery = "INSERT INTO order_items (order_id, food_name, quantity, price) VALUES ?";
        const itemsData = items.map(item => [orderId, item.food_name, item.quantity, item.price]);

        db.query(insertItemsQuery, [itemsData], (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to insert order items" });
            }
            res.status(201).json({ message: "Order created", orderId });
        });
    });
});

// Assign a delivery person to an order
app.post("/orders/assign-delivery", (req, res) => {
    const { order_id } = req.body;

    // Get a random available delivery person
    db.query("SELECT * FROM delivery_person WHERE assigned_order_id IS NULL ORDER BY RAND() LIMIT 1", (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ error: "No available delivery persons" });
        }

        const deliveryPerson = result[0];
        const deliveryPersonId = deliveryPerson.delivery_person_id;

        // Assign the delivery person
        db.query(
            "UPDATE delivery_person SET assigned_order_id = ? WHERE delivery_person_id = ?",
            [order_id, deliveryPersonId],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to assign delivery" });
                }

                res.json({
                    message: "Order assigned successfully",
                    deliveryPerson,
                });
            }
        );
    });
});

// Get all addresses
app.get("/addresses", (req, res) => {
    db.query("SELECT * FROM address", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add a new address
app.post("/addresses", (req, res) => {
    const { name, phone, street, city, zip } = req.body;
    db.query(
        "INSERT INTO address (name, phone, street, city, zip) VALUES (?, ?, ?, ?, ?)",
        [name, phone, street, city, zip],
        (err, result) => {
            if (err) throw err;
            res.json({ message: "Address added successfully", id: result.insertId });
        }
    );
});

// Update an address
app.put("/addresses/:id", (req, res) => {
    const { name, phone, street, city, zip } = req.body;
    db.query(
        "UPDATE address SET name=?, phone=?, street=?, city=?, zip=? WHERE id=?",
        [name, phone, street, city, zip, req.params.id],
        (err) => {
            if (err) throw err;
            res.json({ message: "Address updated successfully" });
        }
    );
});

// Delete an address
app.delete("/addresses/:id", (req, res) => {
    db.query("DELETE FROM address WHERE id=?", [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: "Address deleted successfully" });
    });
});

// Server Listening on Port 5000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
