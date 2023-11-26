const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const Ticket = require("../models/TicketModel");

// @desc Get all Tickets (for admin users)
// @route GET /api/tickets/all
// @access Private/Admin

const getAllTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized as an admin user");
  }

  const tickets = await Ticket.find({});
  res.status(200).json(tickets);
});

// @desc Get user Tickets
// @route GET /api/tickets
// @access Private

const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json(tickets);
});

// @desc Get single Ticket
// @route GET /api/tickets/:id
// @access Private

const getSingleTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if the user is the owner or an admin
  if (!(ticket.user.toString() === req.user.id || user.isAdmin)) {
    res.status(403);
    throw new Error("Not Authorized");
  }
  res.status(200).json(ticket);
});

// @desc create Tickets
// @route POST /api/tickets
// @access Private

const createTickets = asyncHandler(async (req, res) => {
  const { product, description } = req.body;
  if (!product || !description) {
    res.status(400);
    throw new Error("Please add a product and a description");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: "new",
  });
  res.status(201).json(ticket);
});

// @desc delete Tickets
// @route DELETE /api/tickets/:id
// @access Private

const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  if (ticket.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Not Authorized");
  }
  await ticket.remove();

  res.status(200).json({ success: "true" });
});

// @desc update Ticket
// @route PUT /api/tickets/:id
// @access Private

const updateTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if the user is the owner or an admin
  if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to update this ticket");
  }

  // Extract the fields to update from the request body
  const { product, description, status } = req.body;

  // Update the ticket fields if new values are provided
  if (product) ticket.product = product;
  if (description) ticket.description = description;
  if (status) ticket.status = status;

  // Save the updated ticket
  const updatedTicket = await ticket.save();

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  getSingleTicket,
  createTickets,
  deleteTicket,
  updateTicket,
  getAllTickets,
};
