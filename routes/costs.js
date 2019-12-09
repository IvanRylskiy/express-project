const express = require('express');

const router = express.Router();

const costsController = require('../controllers/costs');

// GET /costs
router.get('/', costsController.getCosts);

// GET /costs/:id
router.get('/:id', costsController.getCost);

// POST /costs
router.post('/', costsController.createCost);

// PATCH /costs/:id
router.patch('/:id', costsController.editCost);

// DELETE /costs/:id
router.delete('/:id', costsController.deleteCost);

module.exports = router;
