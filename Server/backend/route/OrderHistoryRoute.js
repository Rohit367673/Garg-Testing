import express from "express";
const router = express.Router();
import Order from "../Models/Order.js"




router.put("/:orderId/complete", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Update the order status to "completed"
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: "completed" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order marked as completed",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error marking order as complete:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE route to remove the order from the active orders collection (if ever needed)
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndRemove(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router
