//  Extends App class with methods related to sharing the timeline
//
//  Generates share URL according to UI options for filters and timerange

import {App} from './App.base';

App.prototype.updateShareUrl = function() {
    const shareUrl = this.getShareUrl();
    $('#share-url').val(shareUrl);

    const encodedUrl = encodeURIComponent(shareUrl)
    updateFacebookUrl(encodedUrl);
    updateTwitterUrl(encodedUrl);
}

App.prototype.getShareUrl = function() {
    const shareOptions = getShareOptions();
    let shareUrl = window.location.origin;
    let params = [];

    if (shareOptions.includeFilters) {
        let filterStrings = [];
        for (let prop in this.state.activeFilters) {
            const filtersForProp = this.state.activeFilters[prop];
            if (filtersForProp.length > 0) {
                filterStrings.push(prop + ':' + filtersForProp.join(','))
            }
        }
        if (filterStrings.length > 0) {
            params.push('filters=' + filterStrings.join('|'))
        }
    }

    if (shareOptions.includeTimeRange) {
        params.push('start=' + this.timeline.timescaleManager.startToken.value.toKeyString().replace(/\|/g, '-'));
        params.push('offset=' + this.timeline.repositionWindow);
        params.push('zoom=' + this.timeline.timescaleManager.zoom);
    }

    const paramString = params.join("&");
    if (paramString.length > 0) {
        shareUrl += '?' + paramString;
    }

    return shareUrl;
}

function getShareOptions() {
    const includeFilters = $('#share-filters-checkbox').prop('checked');
    const includeTimeRange = $('#share-timerange-checkbox').prop('checked');

    return {includeFilters, includeTimeRange};
}

function updateFacebookUrl(url) {
    const endpoint = $('.resp-sharing-button__link[aria-label="Facebook"').prop("href").split("u=")[0];
    $('.resp-sharing-button__link[aria-label="Facebook"').prop("href", endpoint + 'u=' + url)
}

function updateTwitterUrl(url) {
    const endpoint = $('.resp-sharing-button__link[aria-label="Twitter"').prop("href").split("url=")[0];
    $('.resp-sharing-button__link[aria-label="Twitter"').prop("href", endpoint + 'url=' + url)
}