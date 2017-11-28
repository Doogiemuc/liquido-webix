Web frontend for Liquido made with Webix
========================================

This is my HTML web frontend for my Liquid Democracy Voting and Decision Making framework "Liquido". 
This frontend uses www.liquido.com as UI Library. And it communicates with the liquido backend
via a REST interface.

Technical details
------------------

The frontend is built uppon the webix jet micro app framework.

### Run & Test

- `npm install` installs all necessary nodeJS modules
- `npm run dev` starts the frontend app
- The backend must be running!
- Then you can open `http://localhost:8080` in a browser

### Build & Deploy

- `npm run build` wil create .js and .css files for production in folder "./codebase"
- copy "index.html" and "./codebase" folder to the server

### Other gulp commands

- `npm run lint` - will validate all js code in the project


License
---------

All code in this repo created by me is available under the Apache 2.0 Open Source License

