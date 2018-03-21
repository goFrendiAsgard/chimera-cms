FROM mongo
# Create app directory
WORKDIR /usr/src/app
# Copy app source code
COPY . .
RUN cp dockerDump/dbImport.sh dbImport.sh && chmod 755 dbImport.sh
# Expose port and start application
EXPOSE 27017
CMD ['./dbImport.sh']