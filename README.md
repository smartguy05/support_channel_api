# Support Channel API

## Getting Started
1. Run Redis
2. Run MongoDB
3. Set up .env file
4. Run API

### Run Redis
I use Docker Desktop
1. pull the image: `redis:latest`
2. Start the container (you may want to configure options for retaining data)

### Run MongoDB
I use Docker Desktop
1. pull the image: `mongodb/mongodb-community-server:latest`
2. Start the container (you may want to configure options for retaining data)

### Set up .env file
1. Add a new file to root of project called .env (no file extension)
2. Add the properties found in env.d.ts to the file along with the corresponding dev values:
```
PORT=8080
KB_API_URL=http://0.0.0.0:3000
SWAGGER_ENABLED=true
OPEN_AI_KEY=sk-your-api-key
SYSTEM_PROMPT="You are an expert in answering accurate questions about the video game Risk of Rain 2. Give brief, accurate answers. If you don't know the answer, say so. Do not make anything up if you haven't been provided with relevant context."
MESSAGE_CACHE_TIMEOUT=600000
MONGO_DB_URL=mongodb://0.0.0.0:27017
MONGO_DB_SCHEMA=support_channel_api
MONGO_DB_PASSWORD=password
```

To run locally:
npm run serve
```
To generate Swagger Docs:
```
npm run swagger-gen
```
To debug Node.js
```
npm run debug
```