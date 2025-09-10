This guide assumes that you are an experienced developer. Refer to the [detailed installation guide](https://github.com/OWelton-Rosie/stationery/blob/main/docs/detailed-guide.md) if you need more information.  

# Get the project set up
Clone and navigate to the project using Git:

```
git clone https://github.com/OWelton-Rosie/stationery &&
cd stationery
```

## Run it locally
To bring the project up on [http://localhost:8080](http://localhost:8080), use Docker Compose to run the server:

```
docker-compose up
```

This will start Nginx and serve the `src` folder, with live updates when you edit files.

## Stop the server
Press **Ctrl+C** in the terminal where Docker Compose is running, or stop containers manually:

```
docker-compose down
```
