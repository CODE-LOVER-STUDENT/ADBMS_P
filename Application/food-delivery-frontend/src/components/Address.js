import React, { useEffect, useState } from "react";
import axios from "axios";

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", zip: "" });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = () => {
        axios.get("http://localhost:5000/addresses")
            .then(response => setAddresses(response.data))
            .catch(error => console.error("Error fetching addresses:", error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            axios.put(`http://localhost:5000/addresses/${editId}`, form)
                .then(() => {
                    fetchAddresses();
                    setEditId(null);
                    setForm({ name: "", phone: "", street: "", city: "", zip: "" });
                })
                .catch(error => console.error("Error updating address:", error));
        } else {
            axios.post("http://localhost:5000/addresses", form)
                .then(() => {
                    fetchAddresses();
                    setForm({ name: "", phone: "", street: "", city: "", zip: "" });
                })
                .catch(error => console.error("Error adding address:", error));
        }
    };

    const handleEdit = (address) => {
        setEditId(address.id);
        setForm({ name: address.name, phone: address.phone, street: address.street, city: address.city, zip: address.zip });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/addresses/${id}`)
            .then(() => fetchAddresses())
            .catch(error => console.error("Error deleting address:", error));
    };

    return (
        <div>
            <h2>Manage Addresses</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input type="text" name="street" placeholder="Street" value={form.street} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                <input type="text" name="zip" placeholder="Zip Code" value={form.zip} onChange={handleChange} required />
                <button type="submit">{editId ? "Update" : "Add"} Address</button>
            </form>

            <h3>Saved Addresses</h3>
            <ul>
                {addresses.map(address => (
                    <li key={address.id}>
                        <p>{address.name}, {address.phone}</p>
                        <p>{address.street}, {address.city}, {address.zip}</p>
                        <button onClick={() => handleEdit(address)}>Edit</button>
                        <button onClick={() => handleDelete(address.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Address;
