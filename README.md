# Chimera CMS

## Prerequisites
Before run the application, you need to make sure you have following softwares installed in your computer:
* Node.Js + npm
* Mongodb

## Installation

### Using chimera-init-cms 

* Ensure you have Chimera-framework installed as global. You can install chimera-framework by invoking `npm install --global chimera-framework`
* Ensure you have git installed. You can install git by invoking `apt-get install git`
* Invoke `chimera-init-cms <your-project-name>`
* Start the server from inside `<your-project-name>` directory
  ```
  cd <your-project-name>
  npm start
  ```

### Using git clone

* Ensure you have git installed. You can install git by invoking `apt-get install git`
* Invoke `git clone git@github.com:goFrendiAsgard/chimera-cms.git`
* Do migration and start the server from inside `chimera-cms` directory
  ```bash
  cd chimera-cms
  npm run-script migrate up
  npm start
  ```

## Commonly used command
* Run migration by invoking `npm run-script migrate`
* Start the server by invoking `npm start`

# Quick Reference

## Run Migration
* Invoke `npm run-script migrate up` or `npm run-script migrate` to upgrade 
* Invoke `npm run-script migrate down` to downgrade 
* Invoke `npm run-script migrate up [version]` to upgrade to certain `[version]`
* Invoke `npm run-script migrate down [version]` to downgrade to certain `[version]`

## Run Server
* Invoke `npm start`
* Or invoke `node index.js`

## Testing
* Run migration (`npm run-script migrate up`)
* When prompted for superAdmin's username and password, please type `admin` and `admin`
* Run the test (`npm test`)

## Docker

## Compose docker images
* Install chimera-cms (refer to the installation guide)
* Start the server and do any necessary modifications.
* Ensure you have docker and docker-compose installed. You can compose those docker images by invoking `sudo apt-get install docker docker-compose`
* Compose docker images by invoking `chimera build-docker.chiml`

## Run docker containers
* Perform `docker-compose up -build`

## Stop docker containers
* Perform `docker-compose down`

## Access and run chimera-db-seed
* Run `docker container ls` to see list of containers
* Run `docker exec -it <container-id> bash`, where `<container-id>` is container id of `chimera-mongo`
* Run `./dbImport.sh`

## Reference
* [Docker compose with Node.js and MongoDB](https://medium.com/@kahana.hagai/docker-compose-with-node-js-and-mongodb-dbdadab5ce0a)