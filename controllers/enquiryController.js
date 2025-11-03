// controllers/enquiryController.js
const { Enquiry, Employee } = require('../models');

// ============ SUBMIT PUBLIC ENQUIRY ============
// POST /api/enquiries/public
// Public route - no authentication required
const submitPublicEnquiry = async (req, res) => {
    try {
        const { name, email, courseInterest } = req.body;

        // Validation: Check if all required fields are provided
        if (!name || !email || !courseInterest) {
            return res.status(400).json({
                message: 'Please provide name, email, and courseInterest'
            });
        }

        // Create new enquiry
        // claimed defaults to false, counselorId defaults to null
        const newEnquiry = await Enquiry.create({
            name: name,
            email: email,
            courseInterest: courseInterest,
            claimed: false,
            counselorId: null
        });

        // Return success response
        res.status(201).json({
            message: 'Enquiry submitted successfully',
            enquiry: {
                id: newEnquiry.id,
                name: newEnquiry.name,
                email: newEnquiry.email,
                courseInterest: newEnquiry.courseInterest,
                claimed: newEnquiry.claimed,
                counselorId: newEnquiry.counselorId,
                createdAt: newEnquiry.createdAt
            }
        });

    } catch (error) {
        console.error('Submit Enquiry Error:', error);
        res.status(500).json({
            message: 'Server error while submitting enquiry',
            error: error.message
        });
    }
};

// ============ FETCH PUBLIC ENQUIRIES (UNCLAIMED LEADS) ============
// GET /api/enquiries/public
// Protected route - authentication required
// Returns all unclaimed leads (visible to all counselors)
const getPublicEnquiries = async (req, res) => {
    try {
        // Query for all unclaimed enquiries
        // Either claimed is false OR counselorId is null (or both)
        const publicEnquiries = await Enquiry.findAll({
            where: {
                claimed: false
            },
            include: [
                {
                    model: Employee,
                    as: 'counselor',
                    attributes: ['id', 'name', 'email'] // Don't expose password
                }
            ],
            order: [['createdAt', 'DESC']] // Most recent first
        });

        res.status(200).json({
            message: 'Public enquiries retrieved successfully',
            count: publicEnquiries.length,
            enquiries: publicEnquiries
        });

    } catch (error) {
        console.error('Get Public Enquiries Error:', error);
        res.status(500).json({
            message: 'Server error while fetching public enquiries',
            error: error.message
        });
    }
};

// ============ FETCH PRIVATE ENQUIRIES (CLAIMED LEADS) ============
// GET /api/enquiries/private
// Protected route - authentication required
// Returns all enquiries claimed by the logged-in counselor
const getPrivateEnquiries = async (req, res) => {
    try {
        const counselorId = req.user; // Set by protect middleware

        // Query for all enquiries claimed by this counselor
        const privateEnquiries = await Enquiry.findAll({
            where: {
                claimed: true,
                counselorId: counselorId
            },
            include: [
                {
                    model: Employee,
                    as: 'counselor',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']] // Most recent first
        });

        res.status(200).json({
            message: 'Private enquiries retrieved successfully',
            count: privateEnquiries.length,
            enquiries: privateEnquiries
        });

    } catch (error) {
        console.error('Get Private Enquiries Error:', error);
        res.status(500).json({
            message: 'Server error while fetching private enquiries',
            error: error.message
        });
    }
};

// ============ CLAIM LEAD ============
// PATCH /api/enquiries/:id/claim
// Protected route - authentication required
// CRITICAL BUSINESS LOGIC: Check if enquiry is already claimed
const claimLead = async (req, res) => {
    try {
        const enquiryId = req.params.id;
        const counselorId = req.user; // Set by protect middleware

        // Find the enquiry by ID
        const enquiry = await Enquiry.findByPk(enquiryId);

        // If enquiry doesn't exist
        if (!enquiry) {
            return res.status(404).json({
                message: 'Enquiry not found'
            });
        }

        // ===== CRITICAL BUSINESS LOGIC =====
        // Check if the enquiry is already claimed
        if (enquiry.claimed === true) {
            return res.status(409).json({
                message: 'This lead has already been claimed by another counselor',
                enquiry: {
                    id: enquiry.id,
                    name: enquiry.name,
                    email: enquiry.email,
                    claimed: enquiry.claimed,
                    claimedBy: enquiry.counselorId
                }
            });
        }
        // ===================================

        // Update the enquiry: mark as claimed and assign to counselor
        enquiry.claimed = true;
        enquiry.counselorId = counselorId;
        await enquiry.save();

        // Fetch the updated enquiry with counselor details
        const updatedEnquiry = await Enquiry.findByPk(enquiryId, {
            include: [
                {
                    model: Employee,
                    as: 'counselor',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(200).json({
            message: 'Lead claimed successfully',
            enquiry: updatedEnquiry
        });

    } catch (error) {
        console.error('Claim Lead Error:', error);
        res.status(500).json({
            message: 'Server error while claiming lead',
            error: error.message
        });
    }
};

module.exports = {
    submitPublicEnquiry,
    getPublicEnquiries,
    getPrivateEnquiries,
    claimLead
};
