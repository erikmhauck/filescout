# filescout

[![GitHub issues](https://img.shields.io/github/issues/erikmhauck/filescout)](https://github.com/erikmhauck/filescout/issues)
[![GitHub license](https://img.shields.io/github/license/erikmhauck/filescout)](https://github.com/erikmhauck/filescout/blob/main/LICENSE)

Indexes files and their contents for full-text search through a web-based (and mobile friendly!) UI.

![Animated gif of the desktop web interface](/docs/filescout-ui.gif)

## Features

- Full text search
- Scheduled re-indexing
- Custom re-indexing schedules via cron
- On-demand reindexing through web UI
- Mobile-first UI

## Installation

filescout leverages [docker volumes](https://docs.docker.com/storage/volumes/#use-a-volume-with-docker-compose) to add the desired paths to scan and index into a docker container. For a basic installation, `volumes` is the only section that requires configuration.

### Full docker-compose example

```yaml
version: '3.8'

services:
  # the node-based webserver
  filescout:
    build:
      context: .
    ports:
      - 8080:8080
    environment:
      - SERVER_PORT=8080
      - CONNECTIONSTRING=mongodb://mongo:27017/roots
      - ES_HOST=elasticsearch
      - NODE_ENV=production
    volumes:
      - ./test_data/test_1:/scan/test_1 # 1st example of a scan root
      - ./test_data/test_2:/scan/test_2 # 2nd example of a scan root
      - ./test_config:/config # not required -- store custom cron data for re-indexing
    links:
      - elasticsearch
      - mongo
    depends_on:
      - elasticsearch
      - mongo
    networks:
      - fsnet
  # the database that holds scan information
  mongo:
    image: mongo:4.2.8
    ports:
      - 27017:27017
    volumes:
      - mongodb:/data/db
      - mongodb_config:/data/configdb
    networks:
      - fsnet
  # the search index
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.1.1
    volumes:
      - esdata:/usr/share/elasticsearch/data
    environment:
      - bootstrap.memory_lock=true
      - 'ES_JAVA_OPTS=-Xms512m -Xmx512m'
      - discovery.type=single-node
    ports:
      - '9300:9300'
      - '9200:9200'
    networks:
      - fsnet

volumes:
  mongodb:
  mongodb_config:
  esdata:
networks:
  fsnet:
```

## Configuration

### Volumes

To add more paths to scan, extend the `volumes` section.

```yml
volumes:
  - /desired/path/to/be/scanned:/scan/scanPath1
  - /some/other/path:/scan/scanPath2
```

`scanPath1` is just an example, you can name it whatever makes the most sense to you. The required format is like this: `{pathToScan}:/scan/{volumeName}`

In other words, anything that you attach to `/scan/` will be indexed recursively and full-text-searchable.

### Schedules

By default, every path will be scanned at 3am every night. This is overridable via `schedules.json`.

For example, if you want your paths named "test_1" and "test_2" to be scanned every 30 minutes:

1. Create a `schedules.json`

```json
{
  "test_1": "30 * * * *",
  "test_2": "30 * * * *"
}
```

1. Put `schedules.json` in a folder on your host machine (eg: `~/filescout/config`) and then add a docker volume to map that to `/config`

```yml
volumes:
  - ~/filescout/config:/config
```

## Development

### Requirements

[Docker](https://docs.docker.com/get-docker/)

[Node v14](https://nodejs.org/en/download/)

### Setup

From the root of the project run the following commands:

1. `yarn install`
1. `docker compose -f docker-compose.dev.yml up` to start the mongo and elasticsearch containers
1. `yarn start:dev` to start the webserver in hot-reload mode
