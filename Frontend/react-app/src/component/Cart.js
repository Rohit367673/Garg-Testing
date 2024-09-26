import React, { useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, calculatePrice, decrement, deleteCart, setCartItems } from '../redux/CartSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoginHandler = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      axios.get('http://localhost:3001/verifyToken', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.message === 'success') {
          navigate('/Address', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/login', { replace: true });
      });
    }
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const incrementHandler = (id) => {
    dispatch(addToCart({ id }));
    dispatch(calculatePrice());
  };

  const decrementHandler = (id) => {
    dispatch(decrement({ id }));
    dispatch(calculatePrice());
  };

  const deleteHandler = (id) => {
    dispatch(deleteCart(id));
    dispatch(calculatePrice());
  };

  const { subTotal, Total, shipping, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      dispatch(setCartItems(JSON.parse(storedItems)));
      dispatch(calculatePrice());
    }
  }, [dispatch]);

  useEffect(() => {
    saveToLocalStorage(cartItems);
  }, [cartItems]);

  const CartItem = ({ imgsrc, name, id, qty, price, deleteHandler, increment, decrement }) => (
    <div className="cartItem">
      <img src={imgsrc} alt={name} />
      <article>
        <h3>{name}</h3>
        <p className="ml-2">{price}Rs</p>
      </article>
      <div>
        <button onClick={() => decrement(id)}>-</button>
        <p>{qty}</p>
        <button onClick={() => increment(id)}>+</button>
      </div>
      <AiFillDelete onClick={() => deleteHandler(id)} />
    </div>
  );

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i) => (
            <CartItem
              key={i.id}
              imgsrc={i.imgsrc}
              name={i.name}
              price={i.price}
              qty={i.quantity}
              id={i.id}
              decrement={decrementHandler}
              increment={incrementHandler}
              deleteHandler={deleteHandler}
            />
          ))
        ) : (
          <h1>No Item</h1>
        )}
      </main>
      <aside>
        <h2>SubTotal: {subTotal} Rs</h2>
        <h2>Shipping: {shipping} Rs</h2>
        <h2>Total: {Total} Rs</h2>
        {cartItems.length > 0 ? (
          <div className='btnval ml-20 mt-11 z-0'>
            <button type="button" onClick={isLoginHandler}><Link>Payment</Link></button>
          </div>
        ) : (
          console.log("Add item")
        )}
      </aside>
    </div>
  );
}

export default Cart;
