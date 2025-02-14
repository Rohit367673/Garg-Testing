import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <>
  <footer className='mt-8'>
  <div className="footer-container">
    <div className="footer-section">
     <img src='./Images/Logo.jpeg' alt="nothing" className='footer-logo'/>
      <p>Birta,Kangra,Himachal Pradesh <br/>
         <b> FL 33134 INDIA</b></p>
    </div>
    <div className="footer-section">
      <h3>Links</h3>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Product">Product</Link></li>
        <li><Link to="/About">About</Link></li>
     
      </ul>
    </div>
    <div className="footer-section">
      <h3>Help</h3>
      <ul>
  
        <li><Link to="#">Returns</Link></li>
        <li><Link to="/Conatct">Contact</Link></li>
        
      </ul>
    </div>
    <div className="footer-section">
      <h3>News letter</h3>
      <form action="#">
        <input type="email" placeholder="Enter Your Email"/>
        <button className='ml-4' type="submit">SUBSCRIBE</button>
      </form>
    </div>
  </div>
  <div className="footer-bottom flex justify-center gap-3">
   
  <h1 className='text-xl'> Follow Us</h1> <Link to="https://www.facebook.com/gargmodwears"><FaFacebook  className='text-3xl cursor-pointer'/></Link>
   
  <Link to="https://www.instagram.com/garg_exclusive_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">  <FaInstagramSquare className='text-3xl cursor-pointer' /></Link>
  
    
  </div>
</footer>
    </>
  )
}

export default Footer
