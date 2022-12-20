export const getCart = () => {
    const cart = window.localStorage.getItem('cart');
    return cart;
}

export const storeCart = (cart) => {
    window.localStorage.setItem('cart', JSON.stringify(cart))
}