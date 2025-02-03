const healthCheckController = require('./controllers/health-check.controller');
const chatController = require('./controllers/chat.controller');

export function initializeControllers(app) {
    app.get('/healthcheck',
        /* 
          #swagger.tags = ['Health Check']
          #swagger.summary = 'Health Check'
          #swagger.description = 'Perform a health check'
        */
        healthCheckController.get);

    app.post('/chat',
        /* 
            #swagger.tags = ['Chat']
            #swagger.summary = 'Chat using KB articles'
            #swagger.description = 'Chat with AI using KB articles'
            #swagger.parameters['query'] = {
              in: 'body',
              description: 'KbCollection payload',
              required: true,
              schema: {
                  query: "query text",
                  collection: "Collection to get kb articles for",
                  model: "OpenAI model to use"
              }
          }
        */
        chatController.post);
}
