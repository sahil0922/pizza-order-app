import { BrowserRouter as Router, Routes, Route, json } from 'react-router-dom';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Navigation from './components/Navigation';
import { CartContext } from './CartContext';
import { useEffect, useState } from 'react';
import { getCart, storeCart } from './helpers';


const App = () => {

    const [cart, setCart] = useState({});

    //fetch from local storage
    useEffect(() => {
        const cart = getCart();
        setCart(JSON.parse(cart))
    },[])

    useEffect(() => {
        storeCart(cart)
    },[cart])

    return (
        <>
            <Router>
                <CartContext.Provider value={{cart : cart, setCart : setCart}}>

                     <Navigation />
                    <Routes>
                            <Route path="/" element={<Home />} exact />
                            <Route path="/products" exact element={<ProductsPage />} />
                            <Route path="/products/:_id" element={<SingleProduct />} />
                            <Route path="/cart" element={<Cart />} />
                    </Routes>

                </CartContext.Provider>
            </Router>
        </>
    )
}

export default App;