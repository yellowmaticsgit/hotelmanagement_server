const Contact = require('../models/Contact');
const sendEmail = require('../utils/emailService');

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Send confirmation email to user (optional)
    try {
      await sendEmail({
        email: email,
        subject: 'We received your message - Hotel Management',
        message: `Dear ${name},

Thank you for contacting us. We have received your message and will get back to you soon.

Best regards,
Hotel Management Team`,
      });
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/admin/contacts
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/admin/contacts/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    // Update status to 'read' if it's 'new'
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update contact message
// @route   PUT /api/admin/contacts/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
