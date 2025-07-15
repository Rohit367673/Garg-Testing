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
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);
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
    { image: '/Images/Screenshot 2025-01-19 at 12.40.21 PM.png', video: '/Images/video2.mp4' },
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
    // Fetch products by category for homepage
    const fetchProductsByCategory = async () => {
      try {
        setLoadingProducts(true);
        
        // Fetch products for each category
        const [menRes, womenRes, kidsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products?category=Men&limit=8`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products?category=Women&limit=8`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products?category=Kids&limit=8`)
        ]);

        setMenProducts(menRes.data.products || []);
        setWomenProducts(womenRes.data.products || []);
        setKidsProducts(kidsRes.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setMenProducts([]);
        setWomenProducts([]);
        setKidsProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsByCategory();
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

  // Component to render product cards
  const ProductCard = ({ product }) => (
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 2px 12px rgba(34,34,34,0.08)',
      p: 2.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: { xs: 160, sm: 180, md: 200 },
      transition: 'transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.15s',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.01)',
        boxShadow: '0 3px 12px rgba(51,51,51,0.12)',
      },
    }}>
      <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || '/Images/placeholder.png'}
          alt={product.name}
          sx={{
            height: { xs: 140, sm: 180, md: 220 },
            objectFit: 'cover',
            background: '#faf9f6',
            borderRadius: 2,
          }}
        />
      </div>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        pb: 0.25,
        px: 0.25,
        pt: 0.25,
        gap: 0.25,
        '&:last-child': { pb: 0.25 },
      }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            fontFamily: 'Playfair Display, serif',
            mb: 0.1,
            textAlign: 'left',
            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
            color: '#222',
            lineHeight: 1.1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}
        >
          {product.name}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 0 }}>
          <Typography variant="body2" sx={{
            fontWeight: 700,
            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
            color: '#222',
            width: 'auto'
          }}>
            ₹{product.price}
          </Typography>
          {product.oldPrice && product.oldPrice > product.price && (
            <Typography variant="caption" sx={{
              textDecoration: 'line-through',
              color: '#888',
              fontWeight: 500,
              fontSize: { xs: '0.55rem', sm: '0.6rem' },
              ml: 0.5
            }}>
              ₹{product.oldPrice}
            </Typography>
          )}
        </div>
        <Button
          variant="contained"
          size="small"
          fullWidth
          sx={{
            borderRadius: 0.5,
            fontWeight: 600,
            background: '#222',
            color: '#fff',
            fontSize: { xs: '0.5rem', sm: '0.55rem' },
            padding: { xs: '2px 0', sm: '3px 0' },
            minHeight: { xs: '18px', sm: '22px' },
            mt: 0.25,
            '&:hover': { background: '#555', color: '#fff' }
          }}
          onClick={() => window.location.href = `/product/${product._id || product.id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  // Component to render category section
  const CategorySection = ({ title, products, category }) => {
    // Responsive: horizontal scroll on mobile, grid on desktop
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          padding: '0 0.5rem'
        }}>
          <h3 style={{ 
            fontFamily: 'Playfair Display, serif', 
            color: '#333', 
            fontWeight: 700, 
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' }, 
            margin: 0,
            textShadow: '0 2px 6px rgba(51,51,51,0.08)'
          }}>
            {title}
          </h3>
          <Link to={`/Product?category=${category}`} style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#333',
                color: '#333',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                '&:hover': {
                  borderColor: '#555',
                  background: '#333',
                  color: '#fff'
                }
              }}
            >
              View All
            </Button>
          </Link>
        </div>
        {loadingProducts ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </div>
        ) : products.length > 0 ? (
          <div>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="product-row-scroll">
              {products.map((product, idx) => (
                <div className="product-row-card" key={product._id || idx}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#888',
            fontStyle: 'italic'
          }}>
            No {title.toLowerCase()} products available at the moment.
          </div>
        )}
      </div>
    );
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

      {/* Featured Products by Category */}
      <div style={{ maxWidth: 1300, margin: '2.5rem auto', padding: '0 1rem' }}>
        <h2 style={{ 
          fontFamily: 'Playfair Display, serif', 
          color: '#333', 
                      fontWeight: 700,
          fontSize: '2.2rem', 
          marginBottom: '2rem', 
          letterSpacing: '0.04em', 
          textAlign: 'center', 
          textShadow: '0 2px 8px rgba(51,51,51,0.08)' 
        }}>
          Featured Products
        </h2>
        
        {/* Men's Category */}
        <CategorySection 
          title="Men's Collection" 
          products={menProducts} 
          category="Men"
        />
        
        {/* Women's Category */}
        <CategorySection 
          title="Women's Collection" 
          products={womenProducts} 
          category="Women"
        />
        
        {/* Kids Category */}
        <CategorySection 
          title="Kids Collection" 
          products={kidsProducts} 
          category="Kids"
        />
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
          <img src="/Images/Screenshot-2025-01-19-at-12.40.21-PM.png" alt="Cloth 2" className="img2" />
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
