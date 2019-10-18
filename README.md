# Gitea Drone Integration

This project enables tight integration between gitea and drone. It listens to the gitea webhooks and calls drone whenever it needs to to make sure everything happens automatically. Bellow you will find the definition of "Everything".

## Development

The project uses gulp with autoreloading. Once you've done the steps bellow you can start editing code and it'l become available for testing as-you-save.

1. Clone te repository
1. run ```> npm install```
1. run ```> DRONE_URL=<your drone server> DRONE_TOKEN=<your admin user token> npm start```
