require('dotenv').config();
const path = require('path');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Support Channel API',
        description: 'API endpoints for Support Channel chat operations.',
    },
    host: 'localhost:' + process.env.PORT,
    schemes: ['http'],
};

// Build absolute paths relative to the location of this file
const outputFile = path.join(__dirname, '../swagger_output.json');
const endpointsFiles = [ path.join(__dirname, '../init.js') ];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
    // Optionally start your app automatically:
    // require(path.join(__dirname, '../../dist/app.js'));
});
