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
            max: 53
        },
        draggingVicinity: {
            up: 1200,
            down: 100
        },
        article: {
            density: Histropedia.DENSITY_LOW,
            defaultStyle: {
                header: {
                    text: {
                        color: '#fff'
                    }
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
        },
        onArticleDoubleClick: function(article) {
            DWB.contentPanel.open()
        }
    },
    
    //overrides for small height timeline (e.g. landscape mobile)
    small: { 
        article: {
            distanceToMainLine: 200,
            autoStacking: {
                topGap: 40
            },
            defaultStyle: {
                width: 100
            }
        }
    },
    
    //overrides for large height timeline
    large: { 
        article: {
            distanceToMainLine: 430,
            autoStacking: {
                topGap: 80
            },
            defaultStyle: {
                width: 185
            }
        }
    }
    
    //can add mobile portrait/landscape overrides here too if needed
}

var APP_OPTIONS = {
    //todo: remove labels and store all in single map file
    filters: {
        gender: {label: "gender"}, 
        occupation: {label: "occupation"}
    },
    colorCode: {
        properties: ["occupation", "gender"],    // list of Wikidata properties
        colors: ['#961111', '#1a5d1f', '#1565c0', '#7b1fa2', '#b78617', '#d66f6f', '#56ab6c', '#377f9a']
    },
    contentPanel: {
        
    }
    
}