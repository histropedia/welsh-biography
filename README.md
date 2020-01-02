# Dictionary of Welsh Biography Timeline
Wikidata and HistropediaJS driven interactive timeline of people in the Dictionary of Welsh Biography.
Developed by Histropedia for The National Library of Wales, with grant funding from the My-D Foundation.
Timeline data like dates, names and filter options are all sourced directly from Wikidata. Images are from Wikimedia Commons, with articles from Wikipedia and the Dictionary of Welsh Biography.

See the live running version at http://welsh-biography.histropedia.com

# Licence
The code for this application is open source, with terms of re-use covered by:
1. The GNU Affero General Public License v3, and
2. The Profit Contribution Agreement between Licensee and MY-D Foundation 

Details are shown in the COPYING file in the repository.
Important: Dependencies used in the application have their own licences. They are all open source except for the HistropediaJS library used for rendering the timeline, which is free for non-commercial use (see http://histropedia.com/histropediajs/licence.html). See the "Using another timeline library" section below for instructions on linking to another open source timeline library.

# Local setup instructions
1. Install dependencies using `npm install` from the root folder
2. Copy `server/sample.env` to `server/.env` (adjust if needed for local environment)
3. Generate local timeline data using `npm run data-update`
4. Start app and watch for changes using `npm start`
   
   If preferred, you can start the app with separate client and server consoles:
   - `npm run build:dev`
   - `npm run start:server`

Note: All files in the `client` folder are either bundled or copied over to the relevant
locations in the `server` folder during the build process.

# Server setup and Deployment
The app runs entirely from the `server` folder once the front end assets have been bundled.
So this is the only folder you need to deploy to the server.
1. Run `npm run build:production` locally to bundle all front end assets for production
2. (optional) Run `npm run data-update` to get latest timeline data
3. Copy the contents of the `server` folder to the desired folder on the server, excluding the 
  `node_modules` folder and `.env` file
4. If it's the first time setup:
  - Create a new `.env` in the root folder of the application on the server, using a copy of `sample.env`
  - Set `NODE_ENV` to `production` in the new file
  - Make any other required changes to the `.env` for the environment you've deployed to
  - install dependencies using `npm install` from the newly copied folder
5. Launch app on the server with `npm start`

# Data update process
You can manually trigger an update of all timeline data using `npm run data-update`.
This will update the `server/public/data/<lang>/timeline-data.json` files for each UI language.
Before updating the files, all previous timeline data is backed up to the `server/data-backup` folder.
You can rollback to the backed up timeline data files using `npm run data-rollback`.

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
When labels need to be rendered in the UI, the following methods are used from the App() instance:
- `DWB.getLabel.property(property)`
- `DWB.getLabel.item(item)`

During the data update process, item labels for each language are generated from Wikidata queries, while 
property labels are taken from a manual list in `server/data-update/options.js`.
The resulting label data is stored as part of the main `timeline-data.json` file (see below).

# Timeline data
All timeline data is generated via the Wikidata queries in `server/data-update/queries.js`.
The resulting data for the timeline is stored in `server/public/data/<lang>/timeline-data.json`,
with `articles` and `labels` properties.
Links to run the queries on the Wikidata Query Service are shown below:

Timeline data for Biography events
- English: https://w.wiki/CgM
- Welsh: https://w.wiki/CgK

Timeline data for Welsh History events
- English: https://tinyurl.com/rl2uvwv
- Welsh: https://tinyurl.com/uk3q4j8

Filter data for Biography Events
- All languages: https://tinyurl.com/ssy9sxo

Filter value labels:
- English: https://w.wiki/EhL
- Welsh: https://w.wiki/EhT

# Application Settings
- Timeline and other front end components: `client/js/options.js`
- Data update process: `server/data-update/options.js`

## TIMELINE_OPTIONS
Options for the HistropdiaJS timeline interface:
- `TIMELINE_OPTIONS.default`: Options that apply to all timeline sizes
- `TIMELINE_OPTIONS.small`: Extra options and overrides for *small* height timelines (i.e. mobile landscape)
- `TIMELINE_OPTIONS.large`: Extra options and overrides for *large* height timelines

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

# Using another timeline library
You can link this application to another timeline library with the following changes:
- Load the chosen library using your preferred method (script tag, npm etc)

## client/js/ folder
App.base 
- Update the `App.createTimeline` method as required to initialise the new timeline

options.js 
- Update TIMELINE_OPTIONS for each specified size (default, small, large) according to the options for the library used

App.filter.js, App.colorCode.js, App.search.js
- Update references to functions and properties of `this.timeline` where needed.

## server/data-update/ folder
generate-timeline-data.js
- Change output to the required format for the timeline library used

Contact info@histropedia.com or post questions to https://github.com/histropedia/welsh-biography/issues for further assistance.