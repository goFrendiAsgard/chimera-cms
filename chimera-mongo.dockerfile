FROM mongo:jessie
# Create app directory
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y nano vim
# Install app dependencies
COPY package*.json ./
# Copy app source code
COPY ./dockerDump/ ./dockerDump/
RUN cp dockerDump/dbImport.sh dbImport.sh && chmod 755 dbImport.sh
#Expose port and start application
EXPOSE 3000