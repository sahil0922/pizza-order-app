import { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";


const Cart = () => {
    let GrandTotal = 0;
    const [products, setProducts] = useState([]);
    const {cart, setCart} = useContext(CartContext);


    const [priceFetched, togglePriceFetched] = useState(false);
    
    useEffect(() => {
        if(!cart.items) return;

        if(priceFetched) return;
        
        fetch(`https://star-spark-pasta.glitch.me/api/products/cart-items`, {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },

            body: JSON.stringify({ids : Object.keys(cart.items)})
        }).then(res => res.json())
        .then(products => {
            setProducts(products)
            togglePriceFetched(true)
        })
        
    },[cart, priceFetched])

    const getQuantity = (productID) => {
        return cart.items[productID];
    }

    const increment = (productID) => {
        const existingQuantity = cart.items[productID];
        const _cart = {...cart}
        _cart.items[productID] = existingQuantity + 1;
        _cart.totalItems += 1;

        setCart(_cart)
    }

    const decrement = (productID) => {
        const existingQuantity = cart.items[productID];

        if(existingQuantity === 1) return;

        const _cart = {...cart}
        _cart.items[productID] = existingQuantity - 1;
        _cart.totalItems -= 1;

        setCart(_cart)
    }

    const getSum = (productID, price) => {
        const sum = price * getQuantity(productID);
        GrandTotal += sum;
        return sum;
    }

    const handleDelete = (productID) => {
        const _cart = {...cart};
        const qty = _cart.items[productID];
        delete _cart.items[productID];

        _cart.totalItems -= qty;

        setCart(_cart)

        //we are iterating over all products and filtering out those which are not deleted
        // and updating it in our product
        const updatedProductsList = products.filter((product) => product._id !== productID)
        setProducts(updatedProductsList)
    }

    const handleOrderNow = () => {
        window.alert('Order placed successfully!');
        setProducts([]);
        setCart([])
    }

    return (

        !products.length
        ? <img className="mx-auto w-1/2 mt-12" src="/images/empty-cart.png" alt="emptycart" />
        
        :

        <div className="container mx-auto lg:w-1/2 w-full pb-24">
            <h1 className="my-12 font-bold">Cart Items</h1>

            <ul>

                {
                    products.map(product => {
                        return (
                            <li className="mb-12" key={product._id}>
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center">
                                        <img className="h-16" src={product.image} alt="img" />
                                        <span className="font-bold ml-4 w-48">{product.name}</span>
                                    </div>

                                    <div>
                                        <button onClick={() => {decrement(product._id)}} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">-</button>
                                        <b className="px-4">{getQuantity(product._id)}</b>
                                        <button onClick={() => {increment(product._id)}} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">+</button>
                                    </div>

                                    <span>₹ {getSum(product._id, product.price)}</span>
                                    <button onClick={() => {handleDelete(product._id)}} className="bg-red-500 px-4 py-2 rounded-full leading-none text-white">Delete</button>

                                </div>
                            </li>
                        )
                    })
                }

                
            </ul>

            <hr className="my-6" />

            <div className="text-right ">
                <b>Grand Total:</b> ₹ {GrandTotal}
            </div>

            <div className="text-right mt-6">
                <button onClick={handleOrderNow} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">Order Now</button>
            </div>

        </div>
    )
}

export default Cart;
