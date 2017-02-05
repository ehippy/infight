# TeamTanks
A little slack game based on [this presentation](https://www.youtube.com/watch?v=t9WMNuyjm4w)

Fire up some local dynamodb with `docker run -d -p 8080:8080 vsouza/dynamo-local --port 8080`

Setup with `npm install`

You need to provide a few environment variables:
 - `SLACK_OAUTH_CLIENT_ID` 
 - `SLACK_OAUTH_CLIENT_SECRET`
 - `COOKIE_SECRET`


Run it with `npm start`

