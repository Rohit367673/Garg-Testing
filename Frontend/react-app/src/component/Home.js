import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Footer from './Footer';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import toast from 'react-hot-toast';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch slider images from backend on mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/slider`);
        // Use the Cloudinary URL directly from the database
        const slideUrls = res.data.map(slide => slide.imageUrl);
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

  useEffect(() => {
    // Fetch products for homepage
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products?limit=12`);
        setProducts(res.data.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#222',
        color: '#fff',
        fontWeight: 600,
        border: '2px solid #333',
      },
      iconTheme: {
        primary: '#333',
        secondary: '#fff',
      },
    });
    // Add your cart logic here
  };

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

      {/* Product Grid Section (orange/black theme) */}
      <div style={{ maxWidth: 1300, margin: '2.5rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#333', fontWeight: 700, fontSize: '2.2rem', marginBottom: '2rem', letterSpacing: '0.04em', textAlign: 'center', textShadow: '0 2px 8px rgba(51,51,51,0.08)' }}>Featured Products</h2>
        {loadingProducts ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4}>
            {products.map((product, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || idx}>
                <div style={{ position: 'relative', height: '100%' }}>
                  {/* Discount badge */}
                  {product.oldPrice && product.oldPrice > product.price && (
                    <div style={{
                      position: 'absolute',
                      top: 18,
                      left: 18,
                      background: '#333',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: 8,
                      padding: '0.25em 0.8em',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(51,51,51,0.12)'
                    }}>
                      {Math.round(100 - (product.price / product.oldPrice) * 100)}% OFF
                    </div>
                  )}
                  <Card sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 24px rgba(34,34,34,0.10)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 8px 32px rgba(51,51,51,0.18)',
                    },
                  }}>
                    <div style={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={product.images?.[0] || '/Images/placeholder.png'}
                        alt={product.name}
                        sx={{ height: 240, objectFit: 'cover', background: '#faf9f6', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                      />
                      {/* Quick Add to Cart button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          minWidth: 0,
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: '#333',
                          color: '#fff',
                          boxShadow: '0 2px 8px rgba(51,51,51,0.12)',
                          '&:hover': { background: '#222', color: '#333' },
                          zIndex: 2,
                        }}
                        aria-label="Add to cart"
                      >
                        <ShoppingCartIcon />
                      </Button>
                    </div>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Playfair Display, serif', mb: 1, textAlign: 'center', fontSize: '1.1rem', color: '#222' }}>
                        {product.name}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#222' }}>
                          ₹{product.price}
                        </Typography>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#888', fontWeight: 500, fontSize: '1rem', ml: 1 }}>
                            ₹{product.oldPrice}
                          </Typography>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1, borderRadius: 2, fontWeight: 600, background: '#222', color: '#fff', '&:hover': { background: '#555', color: '#fff' } }}
                        onClick={() => window.location.href = `/product/${product._id || product.id}`}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      {/* Other sections of your home page remain unchanged */}
      <h1 className="flex justify-center mt-8 text-4xl border-l">Browse The Range</h1>
      <div className="Item-Container flex  justify-center mt-12">
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

      <h1 className="flex justify-center mt-16 text-2xl border-l">Upload Your Garg Collection</h1>
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
