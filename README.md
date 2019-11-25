# Dictionary of Welsh Biography
Wikidata and HistropediaJS driven interactive timeline of people in the Dictionary of Welsh Biography.
Developed by Histropedia for The National Library of Wales, with grant funding from the My-D Foundation.
Timeline data like dates, names and filter options are all sourced directly from Wikidata. Images are from Wikimedia Commons, with articles from Wikipedia and the Dictionary of Welsh Biography.

See the live running version at http://welsh-biography.histropedia.com

# Local setup instructions
1. Install dependencies using `npm install` from the root folder
2. Copy `server/sample.env` to `server/.env` (adjust if needed for local environment)
3. Start app and watch for changes using `npm start`
   
   If preferred, you can start the app with separate client and server consoles:
   - `cd client && npm run dev`
   - `cd server && npm start`

Note: All files in the `client` folder are either bundled or copied over to the relevant
locations in the `server` folder during the build process.

# Server setup and Deployment
The app runs entirely from the `server` folder once the front end assets have been bundled.
So this is the only folder you need to deploy to the server.
- Run `npm run build:production` locally to bundle all front end assets for production
- Copy the contents of the `server` folder to the desired folder on the server, excluding the 
  `node_modules` folder and `.env` file
- If it's the first time setup:
  - Create a new `.env` in the root folder of the application on the server, using a copy of `sample.env`
  - Set `NODE_ENV` to `production` in the new file
  - Make any other required changes to the `.env` for the environment you've deployed to
  - install dependencies using `npm install` from the newly copied folder
- Launch the app on the server with `npm start`

# Translations
Translations are extracted automatically from source code as it runs.
- Template format: `<%= __("String to translate) =>` (Note: start with `<%-` instead of `<%=` if string contains HTML)
- Node format: `i18n.__('String to translate')`

Extracted messages are stored in `server/locales` folder as .json files.
Translations can then be added to the .json locale files, either manually or using a translation tool.
New strings found are merged into existing files, keeping all existing translations intact.

The app's language is set from the `accept-language` header in the request sent by the client.
It can be set manually by appending `?lang=<language code>` to the url.

You can add new languages and change other settings using the `i18n.configure` options in `server/app.js`.
For more info, see the i18n library documentation: https://github.com/mashpie/i18n-node

Note: All timeline data is localised separately using Wikidata labels. Further details below.

# Wikidata labels
The app uses Wikidata properties (e.g. P21) and items (e.g. Q84) for all filter and colour code data.
When labels need to be rendered in the UI, the following methods are used:
- `App.getLabel.property(property)`
- `App.getLabel.item(item)`

Labels for each language are stored in `server/public/data/<lang>/wikidata-labels`.
Labels for properties are set manually to allow deviation from the label used on Wikidata if desired.
Todo: fallback to Wikidata label if no custom label defined

Labels for items are generated using a Wikidata query at the time of each timeline data update.

# Timeline data
All timeline data is generated via Wikidata queries.
Core timeline data is different for each avaialable language:
- Core data (English): https://w.wiki/CgM
- Core data (Welsh): https://w.wiki/CgK

Filter data is the same for all languages as it does not include labels:
- Filter data (All languages): https://tinyurl.com/ssy9sxo

Filter labels are different for each avaialable language:
- Filter labels (English): https://w.wiki/CgS
- Filter labels (Welsh): https://w.wiki/CgU

# Application Settings
All options for the timeline and other front end components can be found in `client/js/options.js`.

## TIMELINE_OPTIONS
Options for the HistropdiaJS timeline interface:
- `TIMELINE_OPTIONS.default`are options that apply to all timeline sizes
- `TIMELINE_OPTIONS.small` are extra options and overrides for *small* height timelines (i.e. mobile landscape)
- `TIMELINE_OPTIONS.large` are extra options and overrides for *large* height timelines

See http://histropedia.com/histropediajs/documentation.html for all available options.

## APP_OPTIONS
Options for the whole application:
  ### Filter options
  Provide a list of Wikidata properties to filter by, e.g. `["P21", "P106", "P69"]`.
  The filter panels, selection menus and filter search boxes are generated automatically from the array you provide.

  ### Colour code options
  Provide a list of Wikidata properties to colour code by.
  The colour code legends and colour code selection dropdown are generated automatically from the array you provide.
  
  Note: The Dictionary of Welsh Biography app does not use this feature at present. If you do use this in another project, make
  sure you un-comment the colour code setup lines in `client/index.js`, and add a button to show/hide the `#color-code-panel` element.

  ### Content Panel options
  These allow you to control the tabs listed and general functionality of the related content panel.
  They override the default settings shown in `client/js/ContentPanel.js`.
  You can add as many tabs as you like space perimitting. The `update` function is used to set what happens when it is opened, and the `elementId` sets which HTML element contains the tab's content.
  You can also define `onClose()`, `onOpen()` or `onSelectArticle(article)` handlers for the whole panel by adding these properties to the options object.

