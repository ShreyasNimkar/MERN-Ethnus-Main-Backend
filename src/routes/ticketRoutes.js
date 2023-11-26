const express = require("express");
const {
  getTickets,
  createTickets,
  getSingleTicket,
  deleteTicket,
  updateTicket,
  getAllTickets,
} = require("../controllers/ticketController");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const noteRouter = require("./noteRoutes");

router.use("/:ticketId/notes", noteRouter);

// Route to get all tickets (for admin users only)
router.route("/all").get(protect, isAdmin, getAllTickets);

router.route("/").get(protect, getTickets).post(protect, createTickets);

router
  .route("/:id")
  .get(protect, getSingleTicket)
  .delete(protect, deleteTicket)
  .put(protect, updateTicket);

module.exports = router;
