# FREE-ROMS

A complete CRUD with classic ROMS modeling over MongoDB database using Node JS express and EJS as the view engine.

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Improvements included

- safer session defaults (`resave: false`, `saveUninitialized: false`, secure cookie settings)
- file upload size limit to avoid oversized uploads
- better controller error handling for empty random query, missing game, and invalid search
- new informational pages: About, Contact, FAQ, and dedicated 404 page
- ROM file upload + download route with download counter
- automatic cover lookup from game name with placeholder fallback
- input validation for missing uploaded image when submitting a game
- cleanup of duplicate MongoDB text index definition

# Screenshot

<img src="free-roms.herokuapp.com_.png">
