const shortid = require('shortid');
const { validate } = require('jsonschema');
const db = require('../db/db');

const getCosts = (req, res, next) => {
  let costs = [];
  try {
    costs = db.get('costs');
  } catch (error) {
    throw new Error(error);
  }
  res.json({ status: 'OK', data: costs });
};

const getCost = (req, res, next) => {
  const { id } = req.params;

  const cost = db
    .get('costs')
    .find({ id })
    .value();

  if (!cost) {
    throw new Error('COST_NOT_FOUND');
  }

  res.json({ status: 'OK', data: cost });
};

const createCost = (req, res, next) => {
  const costSchema = {
    type: 'object',
    properties: {
      category: { type: 'string' },
      comment: { type: 'string' },
      value: { type: 'string' },
      date: { type: 'string' }
    },
    required: ['category', 'comment', 'value', 'date'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, costSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { category, comment, value, date } = req.body;
  const cost = {
    id: shortid.generate(),
    category,
    comment,
    value,
    date
  };

  try {
    db.get('costs')
      .push(cost)
      .write();
  } catch (error) {
    throw new Error(error);
  }

  res.json({
    status: 'OK',
    data: cost
  });
};

const editCost = (req, res, next) => {
  const { id } = req.params;

  const editedCost = db
    .get('costs')
    .find({ id })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK', data: editedCost });
};

const deleteCost = (req, res, next) => {
  db.get('costs')
    .remove({ id: req.params.id })
    .write();

  res.json({ status: 'OK' });
};

module.exports = {
  getCosts,
  getCost,
  createCost,
  editCost,
  deleteCost
};
