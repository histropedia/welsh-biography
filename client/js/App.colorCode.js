//  Extends App class with all colour code related properties and methods
//  Includes private functions and variables, and click handlers for user changing the colour code
//
//  App.colorGroups stores all data for the active color code, populated by getcolorGroups(property)
//      - Each group uses Wikidata Q number as key (e.g. "Q49757" for a poet)
//      - Contains group label in en and cy
//      - visibleCount to show how many articles currently match
//      - complete list of actual articles objects on the timeline
//
//  App.colorGroups is then used for all further actions, like applying article colours,
//  rendering the legend or filtering the timeline

import {App} from './App.base';

var $colourCodePanel = $('#color-code-panel');

App.prototype.colorGroups = {}          // groups for currently applied colour code
App.prototype.orderedColorGroups = []   // used for assigning colours, and rendering the legend

App.prototype.setupColorCodeOptions = function() {
    // adds dropdown colour code options to UI
    var optionsHtml = '';
    var properties = this.options.colorCode.properties;
    for (var i=0; i < properties.length; i++) {
        var property = properties[i];
        var label = property.replace(/_/g," "); //todo: update once getLabel functions are ready
        var selected = (i === 0) ? ' selected=selected' : ''
        optionsHtml += '<option value=' + property + selected + '>' + label + '</option>';
    }
    $('.color-code-filter-panel-header select').html(optionsHtml);
}

App.prototype.setColorCode = function(property) {
    this.colorGroups = getcolorGroups(this.timeline, property);
    this.orderedColorGroups = getOrderedColorGroups(this.colorGroups);
    assignColorGroupColors(this);
    applyTimelineColors(this.colorGroups);
    renderLegend(this.orderedColorGroups);
    this.state.appliedColorCode = property;
}

// Assigns a rank colour scale without setting up any colour code options
App.prototype.setRankColorScale = function(hue, articleFilter) {
    var saturationTop = 90,
    saturationBottom = 35,
    lightnessTop = 35,
    lightnessBottom = 25,
    hoverLightnessChange = 5,
    hoverSaturationChange = 65,

    hue = hue || 139,
    saturation,
    lightness,

    articles = this.timeline.articles,
    maxArticleRank = getMaxRank(this.timeline, articleFilter);

    var articlesLength = articles.length;
    for (var i=0; i<articlesLength; i++) {
        var article = articles[i];
        if ( !doesArticleMatchFilter(article, articleFilter) ) continue;
        var fraction = article.data.rank / maxArticleRank,
            saturation = Math.round(saturationBottom + (saturationTop - saturationBottom) * fraction),
            lightness = Math.round(lightnessBottom + (lightnessTop - lightnessBottom) * fraction);
        var color = 'hsl(' + [hue, saturation + "%", lightness + "%"].join(',') + ')';
        lightness += hoverLightnessChange;
        saturation += hoverSaturationChange;
        saturation = Math.min(saturation, 100)
        var hoverColor = 'hsl(' + [hue, saturation + "%", lightness + "%"].join(',') + ')';

        setArticleColor(article, color, hoverColor);
    }
    this.timeline.defaultRedraw();
}

App.prototype.openColorCodePanel = function() {
    $colourCodePanel.show();
    this.state.colorCodePanel.isOpen = true;
}

App.prototype.closeColorCodePanel = function() {
    $colourCodePanel.hide();
    this.state.colorCodePanel.isOpen = false;
}

/****************** Private functions ******************/

// Get main colorGroups object used by all other colour code related functions
function getcolorGroups(timeline, property) {
    var colorGroups = {};
    var articles = timeline.articles;
    for (var i=0; i < articles.length; i++ ) {
        var article = articles[i];
        if (article.hiddenByFilter || article.data.isContextEvent) continue;
        var statement = article.data.statements[property];
        var statementValue = (statement && statement.values[0]) ?
            statement.values[0]: 
            "noValue"; // articles without a statement using selected property are stored with "noValue" key instead

        // add new empty colorGroups entry if not already found
        if (!colorGroups.hasOwnProperty(statementValue)) {
            colorGroups[statementValue] = {
                color: "",
                articles: [],
                visibleCount: 0,
                labelEn: statementValue,
                labelCy: ""
            };
        }

        // update colorGroups entry
        colorGroups[statementValue].articles.push(article);
        colorGroups[statementValue].visibleCount += 1;
    }

    return colorGroups;
}

// Convert colorGroups to array sorted by count of visible articles
function getOrderedColorGroups(colorGroups) {
    var sorter = function(a, b) {
        var result = b.visibleCount - a.visibleCount;
        if (result === 0) result = b.item > a.item;
        return result;
    };

    var orderedGroups = Object.entries(colorGroups).map(function(entry) {
        // Combine the two array elements of each entry returned by Object.entries()
        var item = entry[0];
        var cleanedEntry = entry[1];
        entry[1].item = item;
        return entry[1];
    });

    return orderedGroups.sort(sorter);
}

// Set the colour used for each colourGroup from list in options
function assignColorGroupColors(app) {
    var colorGroups = app.colorGroups;
    var orderedColorGroups = app.orderedColorGroups;
    var colors = app.options.colorCode.colors;
    for (var i=0; i < orderedColorGroups.length; i++) {
        var group = orderedColorGroups[i];
        var item = group.item;
        group.color = colorGroups[item].color = colors[ i % colors.length]
    }
}

// Colour articles on the timeline according to the current active colour code
function applyTimelineColors(colorGroups) {
   for (var group in colorGroups) {
       var groupArticles = colorGroups[group].articles;
       var groupColor = colorGroups[group].color;

       for (var i=0; i < groupArticles.length; i++) {
           setArticleColor(groupArticles[i], groupColor);
       }
   }
}

function setArticleColor(article, color, hoverColor) {
    // manual instead of article.setStyle for performance (no redraw between article changes)
    // set article.data.style as well or changes will revert if built in setOption or setStyle are run
    // Todo: fix 
    article.data.style = article.data.style || {};
    article.data.activeStyle = article.data.activeStyle || {};
    article.data.hoverStyle = article.data.hoverStyle || {};
    article.data.activeHoverStyle = article.data.activeHoverStyle || {}
    article.data.style.color =
        article.data.activeStyle.color = 
        article.style.color = 
        article.activeStyle.color = color;

    article.data.hoverStyle.color =
        article.data.activeHoverStyle.color =
        article.hoverStyle.color =
        article.activeHoverStyle.color = hoverColor;
}

// Render the legend in the colour code panel
function renderLegend(orderedClorGroups) {
    var colorGroupsHtml = '';
    for (var i=0; i < orderedClorGroups.length; i++) {
        var group = orderedClorGroups[i];
        if (group.visibleCount < 1) continue; // don't show groups with no articles
        var nextGroupHtml = '<tr> <th scope="row" style="background-color:{{color}}">&nbsp;</th> \
                <td>{{label}}&nbsp; <span class="color-group-count">{{count}}</span></td><td> </td></tr>';
        nextGroupHtml = nextGroupHtml.replace("{{label}}", group.labelEn)
            .replace("{{color}}", group.color)
            .replace("{{count}}", '(' + group.visibleCount + ')')

        colorGroupsHtml += nextGroupHtml;
    }
    $('#color-code-table tbody').html(colorGroupsHtml)
}


function getMaxRank(timeline, articleFilter) {
    var maxRank = 0;
    timeline.forLoadedArticles(function(article) {
        if ( doesArticleMatchFilter(article, articleFilter) ) {
            maxRank = Math.max(maxRank, article.rank);
        }
    })
    return maxRank;
}

function doesArticleMatchFilter(article, filter) {
    // Todo: make filter matching public in App.filter.js
    return (
        article.data.statements &&
        article.data.statements[filter.property] &&
        article.data.statements[filter.property].values.includes(filter.value)
    );
}