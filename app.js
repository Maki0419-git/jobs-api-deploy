require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


//https://www.npmjs.com/package/express-rate-limit
const express = require('express');
const app = express();

//router
const mainRouter = require('./routes/main')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')


//DB
const connectDB = require('./db/connect');
//authenticateUser
const authenticateUser = require('./middleware/auth');

// error
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleWare = require('./middleware/err');

//middleware
app.set('trust proxy', 1);
app.use(rateLimiter({
    windows: 15 * 60 * 1000,
    max: 100
}))
app.use(cors());
app.use(xss());
app.use(helmet());
// app.use(express.static('./public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).send('<h1>jobs API</h1><a href="/api-docs">api-docs</a>');
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 3000;

const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server is listening on ${port}`))
    } catch (err) {
        console.log(err);
    }
}

start();