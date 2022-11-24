# Sports Club API

OpenAPI: https://app.swaggerhub.com/apis/vtramo/SportsClubAPI/1.0.0

You can package and run the application using only Docker, without having to install any other tools.
1. Install [Docker](https://www.docker.com/)
2. Clone this repository
3. Go to the folder that contains the Dockerfile
4. Run this command to build the image:
~~~~
docker build -t sports-club-api .
~~~~
5. Run this command to start the app:
~~~~
docker container run -dp <host-port>:8083 sports-club-api
~~~~
