import React, { useState } from "react";
import axios from "axios";
import "./Contact.css"
import Footer from "./Footer";

// import toast from 'react-hot-toast';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/send-email", formData);
      alert(response.data.message);
    } catch (error) {
      alert("Failed to send message. Please try again.");
      console.error(error);
    }
  };
  

  return (
    <>

      <div className="Contact-Container">
        <div></div>
      </div>
      <div className="Contact-form">
        <h1 className="flex justify-center text-4xl mb-4 mt-8">Get In Touch With Us</h1>
        <p className="flex justify-center -mb-5 text-lg">
          For More Information About Our Product & Services. Please Feel Free To Drop Us An Email.
        </p>
        <br />
        <p className="flex justify-center text-lg">
          Our Staff Always Be There To Help You Out. Do Not Hesitate!
        </p>
      </div>
      <div className="contact-form-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Write your message here..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
      <Footer/>
    </>
  );
}

export default Contact;
