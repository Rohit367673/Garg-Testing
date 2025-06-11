import nodemailer from "nodemailer";
import express from "express"
const router = express.Router();

router.post("/sendOrderEmail", async (req, res) => {
  const { order, user } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gargexclusive@gmail.com",
      pass: "kjyfkyzmlzvthhch",
    },
  });

  const itemsHtml = order.cartItems
    .map(
      (item) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
        <div style="display: flex; gap: 20px;">
          <img src="${item.imgsrc}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;">
          <div>
            <h3 style="margin: 0 0 10px 0;">${item.productName}</h3>
            <p style="margin: 5px 0;"><strong>Price:</strong> ₹${item.price}</p>
            <p style="margin: 5px 0;"><strong>Quantity:</strong> ${item.quantity}</p>
            ${item.selectedSize ? `<p style="margin: 5px 0;"><strong>Size:</strong> ${item.selectedSize}</p>` : ""}
            ${item.selectedColor ? `<p style="margin: 5px 0;"><strong>Color:</strong> ${item.selectedColor}</p>` : ""}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const mailOptions = {
    from: "gargexclusive@gmail.com",
    to: "rohit673367@gmail.com",
    subject: `New Order from ${user.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">New Order Received</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #444; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #444; margin-top: 0;">Shipping Address</h3>
          <p><strong>Address:</strong> ${order.addressInfo.address}</p>
          <p><strong>City:</strong> ${order.addressInfo.city}</p>
          <p><strong>Pincode:</strong> ${order.addressInfo.pincode}</p>
          <p><strong>Phone:</strong> ${order.addressInfo.phone}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #444; margin-top: 0;">Order Details</h3>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <h3 style="color: #444; margin-top: 0;">Ordered Items</h3>
          ${itemsHtml}
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
