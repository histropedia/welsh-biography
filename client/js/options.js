/*************** TIMELINE OPTIONS ***************/
export var TIMELINE_OPTIONS = {
    
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
            distanceToMainLine: 380,
            autoStacking: {
                topGap: 90
            },
            defaultStyle: {
                width: 175,
                maxImageHeight: 250
            }
        }
    }
    
    //can add mobile portrait/landscape overrides here too if needed
}

export var APP_OPTIONS = {
    //todo: remove labels and store all in single map file
    filters: {
        gender: {label: "gender"}, 
        occupation: {label: "occupation"}
    },
    colorCode: {
        properties: ["gender"],    // list of Wikidata properties
        colors: ['#1a5d1f', '#1565c0', '#7b1fa2', '#b78617', '#d66f6f', '#56ab6c', '#377f9a']
    },
    contentPanel: {
        
    }
    
}