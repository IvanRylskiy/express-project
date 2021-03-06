const shortid = require('shortid');
const { validate } = require('jsonschema');
const db = require('../db/db');

const getAccounts = (req, res, next) => {
  let accounts = [];
  try {
    accounts = db.get('accounts');
  } catch (error) {
    throw new Error(error);
  }
  res.json({ status: 'OK', data: accounts });
};

const createAccount = (req, res, next) => {
  const accountSchema = {
    type: 'object',
    properties: {
      comment: { type: 'string' },
      value: { type: 'string' }
    },
    required: ['comment', 'value'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, accountSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { comment, value } = req.body;
  const account = {
    id: shortid.generate(),
    comment,
    value
  };

  try {
    db.get('accounts')
      .push(account)
      .write();
  } catch (error) {
    throw new Error(error);
  }

  res.json({
    status: 'OK',
    data: account
  });
};

const editAccount = (req, res, next) => {
  const { id } = req.params;

  const editedAccount = db
    .get('accounts')
    .find({ id })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK', data: editedAccount });
};

const deleteAccount = (req, res, next) => {
  db.get('accounts')
    .remove({ id: req.params.id })
    .write();

  res.json({ status: 'OK' });
};

module.exports = {
  getAccounts,
  createAccount,
  editAccount,
  deleteAccount
};
