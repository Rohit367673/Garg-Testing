import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { deleteCart } from '../redux/CartSlice'

function Order() {
    const dispatch= useDispatch()
    const deleteHandler=(id)=>{
        dispatch(deleteCart(id))
        
      }
    

    const OItem=useSelector((state)=>state.cart.cartItems)
    const OrderItem =({imgsrc,name,id,qty,price,deleteHandler})=>(
        <div className="OrderItem">
          <img src={imgsrc} alt={name} />
          <article>
            <h3 className='ml-14'>{name}</h3>
            <p className="-mt-8 ml-56">{price}$</p>
          </article>
          <p>{qty}</p>
        
          <button onClick={()=>deleteHandler(id)}>Cencel Order </button>
        </div>
      )
  return (
    <div className="Ocontainer">
        <h2>Your Orders</h2>
        {
  

  OItem.length>0 ?(
     OItem.map((i)=>( 
       <OrderItem key={i.id}
       imgsrc={i.imgsrc}
       name={i.name}
       price={i.price}
       qty={i.quantity}
       id={i.id}
       
     
       deleteHandler={deleteHandler}
     
     /> 
     ))
  ):( <h1 className='flex justify-center mt-8 text-2xl'>No Order</h1>)
   
  }
    </div>
  )
}

export default Order
