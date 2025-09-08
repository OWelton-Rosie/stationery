This guide assumes that you are an experienced developer. Refer to the detailed installation guide if you need more information.  

# Get the project set up
Clone and navigate to the project using Git:

```
git clone https://github.com/OWelton-Rosie/stationery && cd stationery
```

## Run it locally
To bring the project up on http://localhost:8080, we will use Docker to run the server.

Build the image:
```
docker build -t whs-stationery-app .
```

Run the container:
```
docker run -p 8080:80 whs-stationery-app
```

To stop the server, press Ctrl+C in the terminal window where the container is running,
or list and stop containers with:
```
docker ps
docker stop container_id
```
