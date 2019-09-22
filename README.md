# Dictionary of Welsh Biography

Wikidata and HistropediaJS driven timeline of people in the Dictionary of Welsh Biography


# Local setup instructions

- Install dependencies using `npm install`
- Copy `server/sample.env` to `server/.env` (adjust as needed for local environment)
- Start app using `npm start`


# Server setup and Deployment

- Run `npm build` locally to bundle all front end assets for production
- Copy the contents of the `server` folder to the desired folder on the server,
excluding the node_modules and git folders (todo: automate or create build folder)
- If it's the first time setup,
  - set `NODE_ENV` to `production` in the server's .env file.
  - Make any other required changes to the .env file for the given environment.
    Note: the .env is left unchanged in future deployments
  - install dependencies using `npm install` from the newly copied folder 
  Note: *only* server dependencies are needed as front end assets have dendencies pre-bundled
