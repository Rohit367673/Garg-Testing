import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import Spline from '@splinetool/react-spline';
function Home() {
    const sliderRef = useRef(null);

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault(); 
        };

        const sliderElement = sliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (sliderElement) {
                sliderElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const imgS1="/pic/mb-whey.webp";
    const imgS2="/pic/prd_2241268-MuscleBlaze-PRE-Workout-200-0.webp";
    const imgS3="/pic/prd_1484675-MuscleBlaze-Creatine-Monohydrate-0.55-lb-Unflavoured_o.jpg";
    const initialSlider =[
        {
            img:imgS1,
            about:"MuscleBlaze Whey Protein ",
            idS:"cbkjewjebcbcjhcvvccdwcwcwcwcwvwv"
        },
        {
            img:imgS2,
            about:"Creatine monohydrate",
            idS:"dwecwdcvewvewvc"
        },
        {
            img:imgS3,
            about:"MuscleBlaze pre workout ",
            idS:"cbkjewjebcbcjhccdcwsdwedkjew123411ed"
        }
    ]
const AboutProducts=({img,about})=>(
    
    <div className="slides">
        <motion.div
          
            className="slide"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="img">
                <img src={img} alt="name" />
               
            </div>
            <h3>{about}</h3>
            <motion.div
                className="btnval ml-20 mt-12"
                whileHover={{ scale: 1.1 }}
            >
                <button>
                    <Link to="/About">About</Link>
                </button>
            </motion.div>
        </motion.div>
    
</div>
    
)


    return (
        <>
     

              <motion.div
                className="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="branding">

                    <motion.h1
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Brand Taglines
                    </motion.h1>

                    <div className="heading">
                        <motion.h1
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Website
                        </motion.h1>
                        <motion.h1
                            initial={{ x: 100 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Brand
                        </motion.h1>
                        <motion.h1
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Name
                        </motion.h1>
                    </div>
                    <div className="cta-container">
       <Link to="/Collection" class="cta-button">
        <span>Shop Now</span>
    </Link>
</div>

                    <div className='robot'>
                <Spline scene="https://prod.spline.design/s22Fw9tgi4vNpyrs/scene.splinecode" />
                </div>

                </div>

                <div className="aboutw">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
                        vel est minima libero, nisi mollitia asperiores velit a quam
                        eveniet! 
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
                    </p>
                </div>
                
                <div className="imageani">
                    <div className="aleft">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="felem"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <h3>Heading</h3>
                                <h1>About the Heading that is given</h1>
                                <h4> Design Development Product</h4>
                            </motion.div>
                        ))}
                    </div>

                    <div className="aright" ref={sliderRef}>
                        <motion.div
                            className="rimage"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src="/pic/top.jpg" alt="" />
                            <img src="/pic/t3.png" alt="" />
                            <img src="/pic/t2.jpg" alt="" />
                            <img src="/pic/index.jpg" alt="" />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="btnval p-16 flex justify-center"
                    whileHover={{ scale: 1.1 }}
                >
                    <button>
                        <Link to="/collection">All Product</Link>
                    </button>
                </motion.div>

                <div className="res">
                    <h1>Development Resources</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                        aperiam, nulla minus non quis quo odit!
                    </p>
                </div>

            </motion.div>
            <div className="flex p-12 flex-wrap ">
            {
                initialSlider.map((item, index) => (
                    <AboutProducts key={index} img={item.img} about={item.about} />
                    
                ))
            }
           </div>
            <Footer />
            
        </>
    );
}

export default Home;
