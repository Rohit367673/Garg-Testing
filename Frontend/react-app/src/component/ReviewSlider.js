import React from 'react';
import './Review.css';
import { FaRegCircleUser } from "react-icons/fa6";

const Reviews = () => {
  return (
    <div className="Review-Container mt-12 mb-12">
      <div className="reviews-section">
        <p className="subheading">100+ people have said how good Gerg Exclusive is</p>
        <h2 className="heading">Our happy users say about us</h2>
        <div className="reviews-container ">
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">
                "Garg Exclusive in Kangra is the perfect shopping spot for everyone! Whether you’re looking for stylish festive wear, classy formal outfits, or even casual options, this store has it all. What makes it special is the variety they offer. From trendy outfits for boys and girls to elegant dresses for women and sharp suits for men, there’s something for every occasion. They even have an adorable kids' section with unique designs that you won't find anywhere else."
            </p>
           
            <div className="reviewer">
            <FaRegCircleUser className="text-3xl"/>
              <p className="reviewer-name">Dr Sakshi Supehia</p>
            </div>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">
                "So nice collection ...a wide range of varity for all family. High Quality staff is very friendly
                please visit. I am sure you will love it. I am very happy with the collection and the staff is very helpful. I will recommend this store to everyone."
             </p>
            <div className="reviewer">
            <FaRegCircleUser className="text-3xl"/>
              <p className="reviewer-name">Sandeep Kumar</p>
            </div>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">
              “They are best in customer experience, they have a wide range of collection for all age groups. Every time I visit them I find something new and unique. I would recommend everyone to come and visit them."
            </p>
            <div className="reviewer">
            <FaRegCircleUser className="text-3xl" />
              <p className="reviewer-name">Rohit KUmar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
