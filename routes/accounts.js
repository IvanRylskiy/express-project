const express = require('express');

const router = express.Router();

const accountsController = require('../controllers/accounts');

// GET /accounts
router.get('/', accountsController.getAccounts);

// POST /accounts
router.post('/', accountsController.createAccount);

// PATCH /accounts/:id
router.patch('/:id', accountsController.editAccount);

// DELETE /accounts/:id
router.delete('/:id', accountsController.deleteAccount);

module.exports = router;
