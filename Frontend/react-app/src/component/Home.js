import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Footer from './Footer';
import axios from 'axios';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  // Fetch slider images from backend on mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/slider');
        // IMPORTANT: Prepend '/uploads/' so that the URL becomes:
        // http://localhost:3001/uploads/filename.jpg
        const slideUrls = res.data.map(slide => 'http://localhost:3001/uploads/' + slide.imageUrl);
        setSlides(slideUrls);
      } catch (err) {
        console.error("Error fetching slider images:", err);
      }
    };

    fetchSlides();
  }, []);

  // Change slide every 3 seconds if slides exist
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const videoData = [
    { image: 'Images/WhatsApp Image 2025-01-15 at 12.20.18.jpeg', video: 'Images/video1.mp4' },
    { image: '/Images/Screenshot 2025-01-19 at 12.40.21 PM.png', video: '/Images/video2.mp4' },
    {
      image: '/Images/4a5ff91e23e9e92b94e2435b7409edf0.jpg',
      video: '/Images/AQM2InWqEYOkSI4JJI0LGNI7qbDQM-AXM9_XgsxaZpFr2AupNqB3eUA501LziPcNZ2t4PHaa4Qj-lBjAu-dsIpWS.mp4',
    },
  ];

  const videoRefs = useRef([null, null, null]);

  const handleMouseEnter = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
      videoRefs.current[index].style.visibility = 'visible';
    }
  };

  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
      videoRefs.current[index].style.visibility = 'hidden';
    }
  };

  const sliderRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); 
    };

    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <>
      <div className="slider-container" ref={sliderRef}>
        <div className="slider">
          {slides.length > 0 ? (
            <img
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="slider-image"
            />
          ) : (
            <p>Loading slider images...</p>
          )}
        </div>

        <div className="controllers">
          <button onClick={goToPrevSlide} className="prev-button">❮</button>
          <button onClick={goToNextSlide} className="next-button">❯</button>
        </div>

        <div className="indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Other sections of your home page remain unchanged */}
      <h1 className="flex justify-center mt-8 text-4xl border-l">Browse The Range</h1>
      <div className="Item-Container flex gap-8 justify-center mt-12">
        <div id="Item">
          <Link to="/Product">
            <img src="/Images/Catlog-Boys-kids-wear.jpg" alt="Kids" className="Item-Image" />
          </Link>
          <Link to="/Product">
            <h1 className="Item-Title">Kids</h1>
          </Link>
        </div>
        <div id="Item">
          <Link to="/Product">
            <img src="/Images/Catagory-Women.jpg" alt="Women" className="Item-Image" />
          </Link>
          <Link to="/Product">
            <h1 className="Item-Title">Womens</h1>
          </Link>
        </div>
        <div id="Item">
          <Link to="/Product">
            <img src="/Images/Catagory-men.jpg" alt="Men" className="Item-Image" />
          </Link>
          <Link to="/Product">
            <h1 className="Item-Title">Mens</h1>
          </Link>
        </div>
      </div>

      <div className="Branding-Container mt-20">
        <div className="Branding-Text mt-12">
          <h1 className="text-3xl">1000+ Trending Fashion wears</h1>
          <p className="text-lg">A Universe of Brands, A World of Fashion.</p>
          <Link to="/About">
            <button className="Branding-btn mt-4">Learn More</button>
          </Link>
        </div>
        <div className="Branding-Image mt-12 flex justify-center">
          <img src="/Images/Logo.jpeg" alt="Brand Logo" className="Branding-Image" />
        </div>
      </div>

      <div className="Share-Container">
        <h1>Share your setup with</h1>
        <div className="hashtag">#FuniroFashion</div>
        <div className="gallery">
          <img src="/Images/Catagory-men.jpg" alt="Cloth 1" className="img1" />
          <img src="/Images/97070024_1370980763087475_1040959850458120192_n.jpg" alt="Cloth 2" className="img2 mt-12" />
          <img
            src="/Images/multicolor-mens-silk-embroidered-sequins-jacquard-print-indowestern-sherwani-shmambe10013-u.webp"
            alt="Cloth 3"
            className="img3"
          />
          <img src="/Images/467585011_2643580265827512_8846459061125627297_n.jpg" alt="Cloth 4" className="img4" />
          <img src="/Images/467532386_2643580382494167_4181361751190901817_n.jpg" alt="Cloth 5" className="img5" />
          <img src="/Images/467567704_2643580439160828_4854701135367940069_n.jpg" alt="Cloth 6" className="img6" />
          <img src="/Images/Catagory-Women.jpg" alt="Cloth 7" className="img7 mt-16" />
          <img src="/Images/467639506_2643580125827526_5941753001087811788_n.jpg" alt="Cloth 8" className="img8" />
        </div>
      </div>

      <h1 className="flex justify-center mt-16 text-4xl border-l">Upload Your Garg Collection</h1>
      <div className="video-container mt-16">
        {videoData.map((data, index) => (
          <div
            key={index}
            className="video-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <img
              src={data.image}
              alt={`Hover to play video ${index + 1}`}
              className="video-image"
            />
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={data.video}
              className="video-player"
              muted
              loop
            ></video>
          </div>
        ))}
      </div>
      <Footer/>
    </>
  );
}

export default Home;
