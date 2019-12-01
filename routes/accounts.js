const express = require('express');

const router = express.Router();

const accountsController = require('../controllers/accounts');

// GET /accounts
router.get('/', accountsController.getAccounts);

// GET /accounts/:id
router.get('/:id', accountsController.getAccount);

// POST /accounts
router.post('/', accountsController.createAccount);

// PATCH /accounts/:id
router.patch('/:id', accountsController.editAccount);

// DELETE /accounts/:id
router.delete('/:id', accountsController.deleteAccount);

module.exports = router;
