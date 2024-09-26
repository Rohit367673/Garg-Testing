import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
   <footer>
  <div className="container">
    <div className="row">
      <div className="col-md-12 text-center">
        <ul className="list-inline social-links">
          <li className="list-inline-item"><Link to='/Twitter'className="twitter-link">Twitter</Link></li>
          <li className="list-inline-item"><Link to='/Facebook'className="facebook-link">Facebook</Link></li>
          <li className="list-inline-item"><Link to='/Linkdin'className="linkedin-link">LinkedIn</Link></li>
        </ul>
        <ul className="list-inline links">
          <li className="list-inline-item"><Link to="#">Shipping policy</Link></li>
          <li className="list-inline-item"><Link to="#">Payments</Link></li>
          <li className="list-inline-item"><Link to="#">Careers</Link></li>
        </ul>
        <p className="copyright">
          &copy; 2024 The RealShop Shop - All Rights Reserved
        </p>
        <p className="powered-by">
          Powered by <Link to="#" target="_blank">GateWay</Link>
        </p>
      </div>
    </div>
  </div>
</footer>
    </>
  )
}

export default Footer
