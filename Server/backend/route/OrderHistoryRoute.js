import express from "express";
import OrderModel from"../Models/Order.js"

const router = express.Router();

// ✅ Fetch Order History (Only Completed Orders)
router.get("/order-history", async (req, res) => {
  try {
    const historyOrders = await OrderModel.find({ orderStatus: "Completed" }).sort({ archivedAt: -1 });
    res.json(historyOrders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Error fetching order history" });
  }
});

// ✅ Move Completed Orders to Order History
router.put("/order-history/:id/complete", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = "Completed";
    order.archivedAt = new Date(); // Store the completion date
    await order.save();

    res.json({ message: "Order moved to history", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
});

// ✅ Delete Orders Older Than 7 Days
router.delete("/order-history/cleanup", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await OrderModel.deleteMany({ archivedAt: { $lte: sevenDaysAgo } });

    res.json({ message: "Old orders deleted successfully" });
  } catch (error) {
    console.error("Error deleting old orders:", error);
    res.status(500).json({ message: "Error deleting old orders" });
  }
});

export default router;
