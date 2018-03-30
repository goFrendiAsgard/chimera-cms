FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y nano vim mongodb-clients
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
RUN echo "{\"mongoUrl\":\"mongodb://mongo:27017/cms\"}" >> webConfig.json
#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]