# About

A React Pokédex built using React on the frontend and Express with MongoDB on
the backend. See video below for the full list of features!

Try the live app [here](https://react-express-pokedex.herokuapp.com/)!

Here's a [YouTube video](https://www.youtube.com/watch?v=9VjhjTBxgmg) covering all the
features of this app!

# Getting Started

## Prerequisites

Install the latest versions of these programs from here:

- [NodeJS v14 or higher](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Installation

1. Clone this repository from GitHub:

```bash
git clone https://github.com/RogueArt/pokedex.git
cd pokedex # All commands will be executed from this folder
```

2. Install the packages for the client and server:
```
npm run build
```

3. Replace the .env.example with a .env file.
   1. Change the `MONGO_URI` value to the URI for where your MongoDB instance is
      hosted.
   2. Change the `SECRET` value to a randomly generated hash. This is used for
      encrypting passwords.

## Running

Run both the client and server using `npm run start` from the `pokedex` folder.

# TO-DO

My goal is to refactor this code some point in time. A lot of this was written
in a matter of days so I hope to make this more maintainable for the future.
