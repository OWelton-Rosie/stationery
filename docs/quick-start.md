# Detailed Installation Guide

## Prerequisites
- **Git** – needed to clone the repository. Install from [here](https://git-scm.com/downloads).  
- **Docker Desktop** – needed to run containers. Install from [here](https://www.docker.com/products/docker-desktop/).  
  - Make sure Docker Desktop is **open and the Docker daemon is running** before using Docker Compose.  
- **Docker Compose** – usually included with Docker Desktop. If not, install it [here](https://github.com/docker/compose/releases).  

---

## Clone the project
```
git clone https://github.com/OWelton-Rosie/stationery
cd stationery
```

---

## Start the app with Docker Compose
The project comes with a `docker-compose.yml` that handles running Nginx and serving the static files. To build and run the project, run:
```
docker-compose up
```

This will:
- Pull the Nginx image.  
- Mount your local `src` folder into the container so changes appear live.  
- Serve your site on [http://localhost:8080](http://localhost:8080).  

---

## Open the app
In your browser, go to:  
[http://localhost:8080](http://localhost:8080)

Any changes you make in the `src` folder will appear immediately on refresh.  

---

## Stop the server
Press **Ctrl+C** in the terminal where Docker Compose is running, or stop manually:
```
docker-compose down
```

This will stop and remove the container(s) cleanly.
