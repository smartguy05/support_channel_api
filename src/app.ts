import {initializeControllers} from "./init";
import {RedisClient} from "./services/caching.service";
import {DbAdapter} from "./models/db-adapter.model";
import 'dotenv/config'; // This automatically loads dotenv
import express from 'express';

const app = express();

// Middleware
app.use(express.json());

if (process.env.SWAGGER_ENABLED) {
    const swaggerUi = require('swagger-ui-express');
    const swaggerDoc = require('./swagger_output.json');

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

initializeControllers(app);

console.log('Initializing redis client');
RedisClient.init().then(() => {
    console.log('Redis initialized');

    console.log('Initializing db adapter');
    DbAdapter.init(process.env.MONGO_DB_SCHEMA).then(() => {
        console.log('Db adapter initialized');
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Support Channel API server is running on port ${PORT}`);
        });
    });
});
