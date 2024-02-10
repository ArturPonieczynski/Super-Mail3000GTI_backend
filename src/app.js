import express from "express";
import "express-async-errors";
import {config} from "./config.js";
import {homeRouter} from "./routes/home.js";
import {loginRouter} from "./routes/login.js";
import {mailRouter} from "./routes/email.js";
import {AccessDeniedError, handleError} from "./utils/error.js";
import cors from "cors";
import {rateLimiter} from "./utils/rate-limiter.js";
import cron from 'node-cron';
import {deleteOldFiles} from "./utils/cron-task.js";

const {APP_ENV, APP_PORT, APP_DOMAIN, APP_IP} = config;

cron.schedule('0 0 0 1 * *', () => deleteOldFiles()); // ones per month

const app = express();

app.use(cors({origin: ['http://localhost:3000', APP_DOMAIN]}));
app.use(rateLimiter);

const allowedFetchHeaders = [
    'same-origin',
    'same-site',
    APP_ENV !== 'production' ? 'none' : '',
    APP_ENV !== 'production' ? 'cross-site' : '',
];

app.use((req, res, next) => {
    if (allowedFetchHeaders.includes(req.headers['sec-fetch-site'])) {
        next();
    } else {
        throw new AccessDeniedError('Brak dostępu.');
    }
});

app.use(express.json());

const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/home', homeRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/email', mailRouter);

app.use(handleError);
const port = APP_PORT || 3001;
const hostName = APP_ENV === 'production' ? APP_IP : '127.0.0.1';
app.listen( port, hostName, () => {
    console.log(`Server listen at ${hostName} and running on port ${port}`);
});
