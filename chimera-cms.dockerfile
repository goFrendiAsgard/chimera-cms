FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y nano vim
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]