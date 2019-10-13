/*************** TIMELINE OPTIONS ***************/
var TIMELINE_OPTIONS = {
    
    //default options for all screen sizes
    default: {
        initialDate: {
            year: 1913,
            month: 1
        },
        zoom: {
            initial: 35.6,
            max: 53,
            unitSize: {
                initial: 105
            }
        },
        draggingVicinity: {
            up: 1200,
            down: 100
        },
        article: {
            density: Histropedia.DENSITY_LOW,
            showStar: false,
            defaultStyle: {
                color: '#222',
                header: {
                    text: {
                        color: '#fff'
                    }
                },
                subheader: {
                    color: '#444'
                }
            },
            periodLine: {
                defaultHide: function(article) {
                    return !(article.isStarred || article.isActive)
                }
            }
        },
        onArticleClick: function(article) {
            DWB.contentPanel.setArticle(article);
            DWB.setSearchInputValue(article.data.title);

            // todo: hack
            if ( !$('#show-search-btn').hasClass("active") ) $('#show-search-btn').click()
        },
        onArticleDoubleClick: function(article) {
            DWB.contentPanel.open()
        }
    },
    
    //overrides for small height timeline (e.g. landscape mobile)
    small: { 
        article: {
            distanceToMainLine: 180,
            autoStacking: {
                topGap: 80
            },
            defaultStyle: {
                width: 80,
                maxImageHeight: 100,
                header: {
                    height: 30,
                    text: {
                        font: "10px 'Open Sans'",
                        lineHeight: 11,
                        margin: 3
                    }
                },
                subheader: {
                    height: 0,
                    text: {
                        font: "0px 'Open Sans'"
                    }
                }
            }
        }
    },
    
    //overrides for large height timeline
    large: { 
        article: {
            distanceToMainLine: 380,
            autoStacking: {
                topGap: 90
            },
            defaultStyle: {
                width: 175,
                maxImageHeight: 250,
                header: {
                    height: 50,
                    text: {
                        font: "14px 'Open Sans'",
                        lineHeight: 20,
                        margin: 10
                    }
                },
                subheader: {
                    height: 25,
                    text: {
                        font: "10px 'Open Sans'"
                    }
                }
                
            }
        }
    }
    
    //can add mobile portrait/landscape overrides here too if needed
}

var APP_OPTIONS = {
    //todo: remove labels and store all in single map file
    filters: {
        Rhyw: {label: "Rhyw"}, 
        Galwedigaeth: {label: "Galwedigaeth"},
        Man_geni: {label: "Man_geni"},
        Man_marw: {label: "Man_marw"}
    },
    colorCode: {
        properties: ["Rhyw", "Galwedigaeth"],    // list of Wikidata properties
        colors: ['#1a5d1f', '#7b1fa2', '#b78617', '#d66f6f', '#56ab6c', '#377f9a']
    },
    contentPanel: {
        
    }
    
}