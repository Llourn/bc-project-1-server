# Dog Finder - Server

## Description

Front end repo: https://github.com/Llourn/bc-project-1

I wrote this node app for 2 reasons:
* To keep my api key and secret safe.
* To make using the petfinder API more convenient. 

The petfinder API has a 60 minute duration on the oath token. This can get annoying when someone is using the app and then needs to manually refresh the token. 
So I built in an auto-refresh on API call. If the token has expired, a new one is generated and stored to be used for the next 60 minutes.

I learned a lot while making this app. I've used node before for local apps, so hosting this app was a new experience for me. Having to rely more heavily on VSCode's debugger when writing back end code was something new to me as well. Front end development has the browser's dev tools so it was fun to make something without relying on those tools. 

## Installation

* Install [Node.js](). I used v16.15.0
* cd into the project directory
* `npm install`
* `npm start`

## Usage

`/animals`
Searched for all animals. Accepts parameters to narrow search. See petfinder docs for more info. https://www.petfinder.com/developers/v2/docs/#get-animals

`/:type/breeds`
Returns possible breed values for a given animal type. See petfinder docs for more info. https://www.petfinder.com/developers/v2/docs/#get-animal-breeds

`/types`
Returns an array of animal types. This provides the possible values for the "type" parameter, covering species, color, coat, and gender. See petfinder docs for more info. https://www.petfinder.com/developers/v2/docs/#get-animal-types

`/`
Returns 🦄

## License

MIT License

## Badges

![Boot Camp Project](https://img.shields.io/badge/Boot%20Camp%20Project-%E2%9C%94%EF%B8%8F-green)
