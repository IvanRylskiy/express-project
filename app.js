// const express = require('express');
// const morgan = require('morgan');
// const bodyParser = require('body-parser');

// const app = express();
// const tasksRoutes = require('./routes/tasks');

// // app.use(morgan('combined'));
// app.use(bodyParser.json()); // application/json

// app.use('/', (req, res, next) => {
//     console.log(req.headers);
//     next();
// });

// app.use('/', (req, res, next) => {
//     console.log('middleware 2');
//     next();
// });

// // app.get('/', (req, res) => {
// //     res.send('Hello JS');
// // });

// app.use('/tasks', tasksRoutes);

// app.use((err, req, res, next) => {
//     const { message } = err;
//     res.json({ status: 'ERROR', message });
// });

// app.listen(8080, () => console.log('listening on port 8080'));

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const accountsRotues = require('./routes/accounts');
const costsRoutes = require('./routes/costs');

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/accounts', accountsRotues);
app.use('/costs', costsRoutes);

// Error handling
app.use((err, req, res, next) => {
  const { message } = err;
  res.json({ status: 'ERROR', message });
});

app.listen(8080, () => console.log('listening on port 8080'));
