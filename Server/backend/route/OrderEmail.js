
import nodemailer from "nodemailer";
import express from "express"
const router = express.Router();

router.post ("/sendOrderEmail" ,async (req, res) => {
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
      <li>
        <strong>${item.productName}</strong><br/>
        Price: ₹${item.price}<br/>
        Qty: ${item.quantity}<br/>
        ${item.selectedSize ? `Size: ${item.selectedSize}<br/>` : ""}
        ${item.selectedColor ? `Color: ${item.selectedColor}<br/>` : ""}
      </li>
    `
    )
    .join("");

  const mailOptions = {
    from: "gargexclusive@gmail.com",
    to: "rohit673367@gmail.com",
    subject: `New Order from ${user.name}`,
    html: `
      <h3>New Order Received</h3>
      <p><strong>User:</strong> ${user.name} (${user.email})</p>
      <p><strong>Address:</strong> ${order.shippingAddress}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <ul>${itemsHtml}</ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
)

export default router
