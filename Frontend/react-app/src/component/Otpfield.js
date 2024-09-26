import React,{useEffect ,useState} from 'react'
import { Link, useLocation} from 'react-router-dom'

function Otpfield() {
    const [Email, setEmail] = useState('');



    const location = useLocation();
  
    useEffect(() => {
      console.log("inside useeffect")
      const { Email = "" } = location.state || {};
      setEmail(Email);
    }, [location.state]);
  return (
    <div className=''>
        
       <h1>Enter OTP</h1> 
        <p>We have sent a 6-digit OTP to your registered email address.{Email}</p>
        <input type="text" placeholder="Enter OTP"/>
        <button type="submit">Submit</button>
        <p>Didn't receive OTP? <Link href="#">Resend</Link></p> 
        
        <p>Back to <Link href="/Login">Login</Link></p>
        
      
        
        
        </div>
  )
}

export default Otpfield