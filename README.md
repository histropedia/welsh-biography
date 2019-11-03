# Dictionary of Welsh Biography

Wikidata and HistropediaJS driven timeline of people in the Dictionary of Welsh Biography


# Local setup instructions
- Install dependencies using `npm install`
- Copy `server/sample.env` to `server/.env` (adjust as needed for local environment)
- Start app using `npm start`

Note: If preferred, you can start the app with separate client and server consoles:
- `cd client && npm run dev`
- `cd server && npm start`


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


# Translations
Translations are extracted automatically from source code as it runs.
- Template format: `<%= __("String to translate) =>`
- Node format: `i18n.__('String to translate')`

Extracted messages are stored in `server/locales` folder as .json files.
Translations can then be added to the .json locale files, either manually or using a translation tool.
New strings found are merged into existing files, keeping all existing translations intact.

Language is set from the `accept-language` header in the request sent by the client.
It can be set manually by appending `?lang=<language code>` to the url.

For more info, see the i18n library documentation: https://github.com/mashpie/i18n-node 