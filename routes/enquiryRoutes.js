// routes/enquiryRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {
    submitPublicEnquiry,
    getPublicEnquiries,
    getPrivateEnquiries,
    claimLead
} = require('../controllers/enquiryController');

/**
 * @route   POST /api/enquiries/public
 * @desc    Submit a new public enquiry (prospective client)
 * @access  Public (no authentication required)
 * @params  name, email, courseInterest
 */
router.post('/public', submitPublicEnquiry);

/**
 * @route   GET /api/enquiries/public
 * @desc    Fetch all unclaimed enquiries (public leads visible to all counselors)
 * @access  Protected (authentication required)
 */
router.get('/public', protect, getPublicEnquiries);

/**
 * @route   GET /api/enquiries/private
 * @desc    Fetch enquiries claimed by the logged-in counselor
 * @access  Protected (authentication required)
 */
router.get('/private', protect, getPrivateEnquiries);

/**
 * @route   PATCH /api/enquiries/:id/claim
 * @desc    Claim an enquiry (mark as private and assign to counselor)
 * @access  Protected (authentication required)
 * @critical Business Logic: Prevent claiming already-claimed leads (409 Conflict)
 */
router.patch('/:id/claim', protect, claimLead);

module.exports = router;
