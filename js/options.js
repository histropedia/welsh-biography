/*************** TIMELINE OPTIONS ***************/
var TIMELINE_OPTIONS = {
    
    //default options for all screen sizes
    default: {
        initialDate: {
            year: 1600,
            month: 1
        },
        zoom: {
            initial: 43.5,
        },
        draggingVicinity: {
            up: 1200,
            down: 100
        },
        article: {
            density: Histropedia.DENSITY_LOW,
        },
        onArticleClick: function(article) {
            console.log("article clicked", article)
        },
        onArticleDoubleClick: function(article) {
            console.log("article double clicked", article)
        }
    },
    
    //overrides for small height timeline (e.g. landscape mobile)
    small: { 
        article: {
            distanceToMainLine: 200,
            defaultStyle: {
                width: 100
            }
        }
    
    },
    
    //overrides for large height timeline
    large: { 
        article: {
            distanceToMainLine: 500,
            defaultStyle: {
                width: 210
            }
        }
    }
    
    //can add mobile portrait/landscape overrides here too if needed
}

var APP_OPTIONS = {
    //todo: remove labels and store all in single map file
    filters: {
        P21: {label: "gender"}, 
        P106: {label: "occupation"}
    },
    colorCode: {
        properties: ["occupation", "gender"],    // list of Wikidata properties
        colors: ['#961111', '#1a5d1f', '#1565c0', '#7b1fa2', '#b78617', '#d66f6f', '#56ab6c', '#377f9a']
    }
    
}