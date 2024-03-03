import './App.css';
import Header from './Component/Header';
import View from './Component/View';
import Cart from './Component/Cart';
import Profile from './Component/Profile';
import Order from './Component/Order';
import { Routes, Route, BrowserRouter } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="" element={<View />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;