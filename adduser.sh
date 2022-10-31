#!/bin/sh

curl -X POST http://localhost:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"666","username":"gmiel","email":"graviermiel@free.fr"}'
curl -X POST http://localhost:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"777","username":"sviager","email":"sorryviager@42.fr"}'
curl -X POST http://localhost:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"888","username":"emacro","email":"emmentalmacro@elysee.fr"}'
curl -X POST http://localhost:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"999","username":"mlepeigne","email":"maritimelepeigne@faf.fr"}'
