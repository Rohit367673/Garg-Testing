import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineOrderedList, AiFillStar, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';

function Profile({ Hover, value }) {
  const [name, setName] = useState('');



  const location = useLocation();

  useEffect(() => {
    console.log("inside useeffect")
    const { Name = "" } = location.state || {};
    setName(Name);
  }, [location.state]);

  const signOutHandler = () => {
    localStorage.removeItem('token');
    window.location.href = '/Login';
  };

  return (
    <div>
      <div className="Ucontainer" style={Hover} ref={value}>
        
        <h1>My account</h1>
        <div className="welcome">
          Welcome, {name}
        </div>
    <ul>
        <li>  <Link to="/Order"><AiOutlineOrderedList/><p className='Uitemp'> Orders</p></Link></li>
        <li><Link to="/Collection"><AiFillStar/><p className='Uitemp'>Favourites</p></Link></li>
        <li><Link to="/Account"><AiOutlineUser/><p className='Uitemp'>Personal data</p></Link></li>
       
        <li><Link> <AiOutlineLogout/><p className='Uitemp'onClick={signOutHandler}>Sign out</p></Link></li>
    </ul>
    
</div>
</div>

    

 
  )
}

export default Profile
