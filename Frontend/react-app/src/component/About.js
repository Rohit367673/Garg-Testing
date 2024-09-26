import { useState } from 'react';
import React from 'react';
import './AboutProduct.css';
import { Link } from 'react-router-dom';

function AboutProduct() {
  const img1="/pic/mb-whey.webp";
  const img2="/pic/prd_2241268-MuscleBlaze-PRE-Workout-200-0.webp";
  const img3="/pic/prd_1484675-MuscleBlaze-Creatine-Monohydrate-0.55-lb-Unflavoured_o.jpg";
  const [Color, setColor] = useState('#B3E5FC');

  return (
    <body className="Ab-body">
      <div className="product-container">
        <div className="product-image-container">
          <img src={img1} alt="Product" className="product-image" />
        </div>
        <div className="product-info-container">
          <h1 className="product-title">Product 1</h1>
          <p className="product-subtitle">About Product</p>
          <p className="product-price">
            <span className="original-price">$150</span> <span className="discounted-price">$114.89</span>
          </p>
          <p className="product-description">
          Whey is the liquid remaining after milk has been curdled and strained. It is a byproduct of the manufacturing of cheese or casein and has several commercial uses
          </p>
          <div className="product-options">
            <div className="color-options">
              <span>Flavour</span>
              <div className="color-circle" style={{ backgroundColor: '#B3E5FC' }} onClick={() => setColor('#B3E5FC')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FFEB3B' }} onClick={() => setColor('#FFEB3B')}></div>
              <div className="color-circle" style={{ backgroundColor: '#8BC34A' }} onClick={() => setColor('#8BC34A')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FF7043' }} onClick={() => setColor('#FF7043')}></div>
            </div>
            <div className="size-options">
              <span>Items</span>
              <span className="size">1</span>
            </div>
          </div>
          <Link to="/Collection">
            <button className="add-to-cart-button" style={{ backgroundColor: Color }}>View Product</button>
          </Link>
        </div>
      </div>
      <div className="product-container">
        <div className="product-image-container">
          <img src={img2} alt="Product" className="product-image" />
        </div>
        <div className="product-info-container">
          <h1 className="product-title">Product 2</h1>
          <p className="product-subtitle">About Product</p>
          <p className="product-price">
            <span className="original-price">$150</span> <span className="discounted-price">$114.89</span>
          </p>
          <p className="product-description">
          Creatine is an organic compound with the nominal formula CNCH₂CO₂H. It exists in various tautomers in solutions. Creatine is found in vertebrates, where it facilitates recycling of adenosine triphosphate, primarily in muscle and brain tissue          </p>
          <div className="product-options">
            <div className="color-options">
              <span>Flavour</span>
              <div className="color-circle" style={{ backgroundColor: '#B3E5FC' }} onClick={() => setColor('#B3E5FC')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FFEB3B' }} onClick={() => setColor('#FFEB3B')}></div>
              <div className="color-circle" style={{ backgroundColor: '#8BC34A' }} onClick={() => setColor('#8BC34A')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FF7043' }} onClick={() => setColor('#FF7043')}></div>
            </div>
            <div className="size-options">
              <span>Items</span>
              <span className="size">1</span>
            </div>
          </div>
          <Link to="/Collection">
            <button className="add-to-cart-button" style={{ backgroundColor: Color }}>View Product</button>
          </Link>
        </div>
      </div>
      <div className="product-container">
        <div className="product-image-container">
          <img src={img3} alt="Product" className="product-image" />
        </div>
        <div className="product-info-container">
          <h1 className="product-title">Product 3</h1>
          <p className="product-subtitle">About Product</p>
          <p className="product-price">
            <span className="original-price">$150</span> <span className="discounted-price">$114.89</span>
          </p>
          <p className="product-description">
          As the name suggests, people take preworkout supplements before exercise or sport. They do this to boost energy levels, improve strength and endurance, and increase focus.          </p>
          <div className="product-options">
            <div className="color-options">
              <span>Flavour</span>
              <div className="color-circle" style={{ backgroundColor: '#B3E5FC' }} onClick={() => setColor('#B3E5FC')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FFEB3B' }} onClick={() => setColor('#FFEB3B')}></div>
              <div className="color-circle" style={{ backgroundColor: '#8BC34A' }} onClick={() => setColor('#8BC34A')}></div>
              <div className="color-circle" style={{ backgroundColor: '#FF7043' }} onClick={() => setColor('#FF7043')}></div>
            </div>
            <div className="size-options">
              <span>Items</span>
              <span className="size">1</span>
            </div>
          </div>
          <Link to="/Collection">
            <button className="add-to-cart-button" style={{ backgroundColor: Color }}>View Product</button>
          </Link>
        </div>
      </div>
    </body>
  );
}

export default AboutProduct;
