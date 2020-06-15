//  General utitlities and helpers

import {App} from './App.base'; 


// Jump to zoom level that will fit matching articles within the timeline width
// Then animate to correct start position
// Todo: remove when next HistropediaJS version is live with pan & zoom function built in
Histropedia.Timeline.prototype.fitArticles = function (options) {
    var options = options || {};
    var margin = (typeof options.margin === "number") ? options.margin : 40;
    var startOffsetX = options.startOffsetX || 0;
    var articleFilter = options.articleFilter || function(article) {return !article.isHiddenByFilter && !article.data.isContextEvent};
    var withAnimation = options.withAnim;

    var earliestDmy,
        latestDmy,
        articlesLength = this.articles.length;

    for (var i=0; i<articlesLength; i++) {
        var article = this.articles[i];
        if (!articleFilter(article)) continue;

        var fromDmy = article.period.from;
        if (!earliestDmy) earliestDmy = fromDmy;
        if (!latestDmy) latestDmy = fromDmy;

        if (earliestDmy.isAfter(fromDmy)) earliestDmy = fromDmy;
        if (fromDmy.isAfter(latestDmy)) latestDmy = fromDmy;
    }
    var defaultArticleStyle = this.options.article.defaultStyle,
    connectorOffset = defaultArticleStyle.connectorLine.offsetX;

    var currentPixelSpan = this.timescaleManager.getPixelsBetween(earliestDmy, latestDmy);
    var finalPixelSpan = this.options.width - startOffsetX - defaultArticleStyle.width - margin * 2;
    var zoomChange = Math.log(finalPixelSpan / currentPixelSpan) / Math.log(this.options.zoom.ratio);
    this.setZoom(this.timescaleManager.zoom + zoomChange);
    var offsetX = margin + startOffsetX + connectorOffset;
    if (withAnimation) {
        this.goToDateAnim(earliestDmy, {offsetX: offsetX})
    } else {
        this.setStartDate(earliestDmy, offsetX)
    }
}