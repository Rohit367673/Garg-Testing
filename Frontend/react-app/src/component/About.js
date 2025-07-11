import React from "react";
import "./About.css";
import ReviewsSlider from "./ReviewSlider";
import "./Review.css";
import Footer from "./Footer";

const About = () => {
  const brandLogos = [
    "Images/MADAME_LOGO_page-0001.jpg",
    "Images/Beatnik.png",
    "Images/Levis.png",
    "Images/673142d5d85bd542e4e5937858478390.jpg",
    "/Images/Unknown.jpeg",
    "/Images/images.jpeg",

  ];

  return (
    <>
      <div className="about-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="animated-heading text-white">Welcome to Garg Exclusive</h1>
            <p className="animated-subtitle">
              Discover a world of achievements and multi-brand availability
              under one roof!
            </p>
          </div>
        </section>

        <section className="achievements-section">
          <h2 className="section-title">Our Achievements</h2>
          <p className="section-description">
            We take pride in offering the best quality clothing and have been
            awarded multiple times for customer satisfaction and innovation.
          </p>
          <div className="achievements">
            <div className="achievement">🏆 Best Quality Cloths</div>
            <div className="achievement">🎯 25+ Years of Excellence</div>
            <div className="achievement">💼 50K+ Happy Customers</div>
          </div>
        </section>

        <section className="brands-section mt-28">
          <h2 className="section-title"> Brands We Offer</h2>
          <div className="brands">
            {brandLogos.map((logo, index) => (
              <div className="brand-logo" key={index}>
                <img src={logo} alt={`Brand ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="promotion-container mt-28">
        {/* Left Side Content */}
        <div className="P-left-content">
          <h1>Advertisement Of Garg Exlusive & Garg Modwears</h1>
          <p>
            {" "}
            Our achievements and initiatives have been featured in media
            outlets.
          </p>
          <ul>
            <li>Advertisement Video With Influencers</li>
            <li>Promoting Our Brand In International Cricket Match </li>
          </ul>
        </div>

        {/* Right Side Image Slider */}
        <div className="P-right-slider">
          <div className="P-slider">
            <div className="P-slide">
              <img
                src="Images/255626130_1824205891098291_5098129749393588170_n.jpg"
                alt="Brand Ad 1"
              />
            </div>
            <div className="P-slide">
              <img
                src="Images/467660852_2643579949160877_1776732876143886933_n.jpg"
                alt="Brand Ad 2"
              />
            </div>
            <div className="P-slide">
              <img src="Images/41775177559.png" alt="Brand Ad 3" />
            </div>
          </div>
        </div>
      </div>
      <ReviewsSlider className="mt-28" />
      <Footer />
    </>
  );
};

export default About;
