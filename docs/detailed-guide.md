# Detailed installation guide
## Prerequisites
- You need to have Git installed to clone the repository. You can install Git [here](https://git-scm.com/downloads).
- You need to have Docker Desktop installed. You can install Docker Desktop [here](https://www.docker.com/products/docker-desktop/).
- Given that this app only uses static files, you do not need to have Docker Compose installed.

## Get the project set up
```
git clone https://github.com/OWelton-Rosie/stationery
```

Navigate to the project:
```
cd stationery
```

## Build the Docker image
Use the provided Dockerfile to build the image:
```
docker build -t whs-stationery-app .
```

## Run the server
Start a container from the image:
```
docker run -p 8080:80 whs-stationery-app
```

## Open the app
In your browser, navigate to [http:localhost:8080](http:localhost:8080).

## Stopping the server
To stop the container, press Ctrl+C in the terminal window, or stop it manually:
```
docker ps          # shows running containers
docker stop <id>   # replace <id> with container ID
```