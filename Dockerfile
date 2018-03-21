FROM mongo
FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
RUN cp dockerDump/webConfig.json webConfig.json
RUN cp dockerDump/dbImport.sh dbImport.sh 
RUN ./dbImport.sh
#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]