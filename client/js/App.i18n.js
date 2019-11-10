//  Extends App class with all i18n related properties and methods for the client side
//
//  getLabel.property and getLabel.item use the maps generated when data is queried from Wikidata

import {App} from './App.base';
    
App.getLabel = {
    property: function(property) {
        return PROPERTY_LABELS[property] || property;
    },
    item: function(item) {
        return ITEM_LABELS[item] || item;
    }
}
