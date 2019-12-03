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

const getTodayCosts = (req, res, next) => {
  const dateToday = new Date().toLocaleDateString();
  let costs = [];
  try {
  costs = db
    .get('costs')
    .filter({date: dateToday})
    .value();
  } catch (error) {
    throw new Error(error);
  }
  res.json({ status: 'OK', data: costs });
};

const getMonthCosts = (req, res, next) => {
  const dateToday = new Date().toLocaleDateString();
  let year = dateToday.split('-')[0];
  let month = dateToday.split('-')[1];
  let monthToday = new RegExp (year + '-' + month + '-.');
  let costs = [];

  try {
    costs = db
      .get('costs')
      .filter(({date}) => date.match(monthToday))
      .value();
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
  const date = new Date().toLocaleDateString();
  const costSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      category: {type: 'string'},
			value: { type: 'string' }
    },
    required: ['title', 'description', 'category', 'value'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, costSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { title, description, category, value } = req.body;
  const cost = {
    id: shortid.generate(),
    title,
    description,
    category,
    value,
    date: date
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
  getTodayCosts,
  getMonthCosts,
  getCost,
  createCost,
  editCost,
  deleteCost
};
