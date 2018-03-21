FROM node:carbon
# Install mongodb
RUN apt-get update -y && apt-get install -y mongodb
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
RUN cp dockerDump/webConfig.json webConfig.json && cp dockerDump/dbImport.sh dbImport.sh && chmod 755 ./dbImport.sh && ./dbImport.sh
#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]