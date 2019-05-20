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
    filters: {
        P21: {enLabel: "gender", cyLabel: "rhyw"}, 
        P106: {enLabel: "gender", cyLabel: "galwedigaeth"}
    },
    colorCode: {
        properties: [],    // list of Wikidata properties
        colors: [       // default list of colours to use
        '#0c0', '#c00', '#00c', '#0cc', '#c0c', '#F1C4D7', '#F199B1', '#EA6B85', '#E14F67', '#00B1EC', '#007DC8', '#00A386',
        '#ddaa00', '#6677ff', '#333333', '#33ffee', '#33bbff', '#8888ff', '#ffaaee', '#553344', '#994488', '#dd66bb', '#eeaadd',
        '#eebbdd', '#ddccdd', '#bbaaaa', '#aa88aa', '#886688', '#776677', '#665566', '#443344', '#661155', '#bb3399', '#ee44cc', '#eeffcc', '#ddffbb',
        '#ccffbb', '#55ff66', '#44ff22', '#00ee77', '#550011', '#990099', '#dd00ff', '#dd66ff'
        ]
    }
    
}