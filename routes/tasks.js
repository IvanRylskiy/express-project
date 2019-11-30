const express = require('express');
const { validate } = require('jsonschema');
const shortid = require('shortid');
const db = require('../db/db');

const router = express.Router();

// const tasks = [
//     { id: 1, title: 'first', completed: true },
//     { id: 2, title: 'completed', completed: true }
// ];

router.get('/', (req, res, next) => {
    const tasks = db.get('tasks');
    res.json({ status: 'OK', data: tasks });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const data = tasks.find(task => String(task.id) === id);

    res.json({ status: 'OK', data });
    console.log(req.params);
});

router.post('/', (req, res, next) => {
    const { body } = req;
    const id = shortid.generate();
    const newTask = { id, title: body.title, completed: false };
    // здесь мы будем добавлять задачу в БД
    try {
        db.get('tasks')
            .push(newTask)
            .write();
    } catch (error) {
        throw new Error(error);
    }

    // валидатор
    const taskSchema = {
        type: 'object',
        properties: {
            title: { type: 'string' }
        },
        required: ['title'],
        additionalProperties: false
    };

    const validationResult = validate(body, taskSchema);
    if (!validationResult.valid) {
        // вероятно самое время выкинуть ошибку
        return next(new Error('INVALID_JSON_OR_API_FORMAT'));
        // throw new Error('INVALID_JSON_OR_API_FORMAT');
        // console.log(validationResult);
    }

    res.json({ status: 'OK', data: newTask });
});

module.exports = router;
