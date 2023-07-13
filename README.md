# HowDusty

HowDusty collects data about contributors. it processes it into meaningful information to get to know contributors.

## Features

- Collect metrics about users on github.
- Compute a reputation score for a given user.

## Architecture

Look at the [NestJs documentation](https://docs.nestjs.com/) to learn more.

## Getting started

First, you need to fill the environment variables

```bash
# Connect to the howdusty database
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
# Connect to the github api
GITHUB_ACCESS_TOKEN=
# Connect to the onlydust database
ONLYDUST_DB_HOST=
ONLYDUST_DB_PORT=
ONLYDUST_DB_DATABASE=
ONLYDUST_DB_USERNAME=
ONLYDUST_DB_PASSWORD=
```

Then, launch the app

```bash
npm install
npm run start
```

## Modules

- `commands`: Define commands of the app. See the commands section for more informations.
- `config`: Define the configuration to communicate with our database, github and onlydust.
- `contributors`: Define the contributor entity and expose api endpoints to interact with them.
- `github`: Communicate with the github graphQL API.
- `metrics`: Define and get the metrics (from github and onlydust) for contributors.
- `onlydust`: Communicate with the onlydust database.
- `scorer`: Calculate the score from metrics for contributors.
- `synchronization`: Synchronize all informations (metrics, score, contributor info, etc) in our database.

## Commands

- `onlydust:import`: Import new OnlyDust users in the database
- `contributors:sync`: Synchronize contributors with the github API
- `contributors:score`: Calculate the score for every contributor in the database

### How to run a command

```bash
npm run build
node ./dist/main-cli [command-name]
```

## API Endpoints

- `/contributors`: Get all the contributors

## Roadmap

- add more metrics (e.g. social network influence)
- gamification (badge system / experience bar)
- make it work on a broader scale than OnlyDust
