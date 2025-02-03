import {initializeControllers} from "./init";
import {RedisClient} from "./services/caching.service";
require('dotenv').config(); 

const express = require('express');
const app = express();

// Middleware to parse JSON bodies
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
    
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {

        console.log(`Support Channel API server is running on port ${PORT}`);
    });
});
