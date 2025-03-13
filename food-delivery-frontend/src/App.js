import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Restaurants from "./components/Restaurants";
import Menu from "./components/Menu";
import Bag from "./components/Bag";
import Address from "./components/Address";
import Payment from "./components/Payment";
import Receipt from "./components/Receipt"; // Added Receipt

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/restaurants">Restaurants</Link>
                <Link to="/bag">My Bag</Link>
                <Link to="/address">Address</Link>
            </nav>
            <Routes>
                <Route path="/" element={<h1>Welcome to Food Delivery App</h1>} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/menu/:restaurantId" element={<Menu />} />
                <Route path="/bag" element={<Bag />} />
                <Route path="/address" element={<Address />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/receipt" element={<Receipt />} /> {/* Added Receipt Route */}
            </Routes>
        </Router>
    );
};

export default App;
