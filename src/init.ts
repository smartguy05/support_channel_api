﻿const healthCheckController = require('./controllers/health-check.controller');
const chatController = require('./controllers/chat.controller');
const adminController = require('./controllers/admin.controller');

export function initializeControllers(app) {
    app.get('/healthcheck',
        /* 
          #swagger.tags = ['Health Check']
          #swagger.summary = 'Health Check'
          #swagger.description = 'Perform a health check'
        */
        healthCheckController.get);

    app.post('/chat/:uuid',
        /* 
            #swagger.tags = ['Chat']
            #swagger.summary = 'Chat using KB articles'
            #swagger.description = 'Chat with AI using KB articles'
            #swagger.parameters['uuid'] = {
              in: 'path',
              description: 'UUID of support channel kb',
              required: true,
              type: 'string'
            }
            #swagger.parameters['query'] = {
              in: 'body',
              description: 'KbCollection payload',
              required: true,
              schema: {
                  query: "query text"
              }
          }
        */
        chatController.post);

    app.get('/admin',
        /* 
            #swagger.tags = ['Admin']
            #swagger.summary = 'Get admin chat setting'
            #swagger.description = 'Get admin chat setting'
          }
        */
        adminController.get);
    
    app.post('/admin',
        /* 
            #swagger.tags = ['Admin']
            #swagger.summary = 'Add admin chat setting'
            #swagger.description = 'Add admin chat setting'
            #swagger.parameters['query'] = {
              in: 'body',
              description: 'Channel Config',
              required: true,
              schema: {
                  uuid: null,
                  model: "OpenAI model to use",
                  max_tokens: 150,
                  temperature: 0.7,
                  max_context_length: 4000,
                  kbs: [],
                  name: "The name of this support channel";
              }
          }
        */
        adminController.post);

    app.delete('/admin/:uuid',
        /* 
            #swagger.tags = ['Admin']
            #swagger.summary = 'Delete admin chat setting'
            #swagger.description = 'Delete admin chat setting'
            #swagger.parameters['uuid'] = {
              in: 'path',
              description: 'UUID of the setting value to delete',
              required: true,
              type: 'string'
            } 
          }
        */
        adminController.delete);
}
