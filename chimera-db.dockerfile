FROM mongo
# Install mongodb
# RUN apt-get update -y && apt-get install -y mongodb
# Create app directory
WORKDIR /usr/src/app
# Copy app source code
COPY . .
RUN cp dockerDump/dbImport.sh dbImport.sh && chmod 755 ./dbImport.sh && ./dbImport.sh
# Expose port and start application
# EXPOSE 27018
# CMD [ "mongod"]