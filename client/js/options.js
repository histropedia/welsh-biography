/*************** TIMELINE OPTIONS ***************/
export var TIMELINE_OPTIONS = {
    
    //default options for all screen sizes
    default: {
        initialDate: {
            year: 1820,
            month: 1
        },
        zoom: {
            initial: 36.7,
            maximum: 52,
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
                },
                star: {
                    width: 0,
                }	
            },
            defaultActiveStyle: {
                color: '#222',
                border: {
                    color: "#ab363a"
                }
            },
            defaultHoverStyle: {
                color: '#111',
                subheader: {
                    color: '#333'
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
            if ( !$('#show-search-btn').hasClass("active") && DWB.isMobile) $('#show-search-btn').click()
        },
        onArticleDoubleClick: function(article) {
            DWB.contentPanel.open()
        }
    },
    
    //overrides for small height timeline (e.g. landscape mobile)
    small: {
        verticalOffset: 25,
        style: {
            mainLine: {
                size: 4
            },
            marker: {
                minor: {
                    height: 8               
                },
                major: {
                    height: 24
                }
            },
            dateLabel: {
                minor: {
                    font: "normal 9px Calibri"
                },
                major: {
                    font: "normal 12px Calibri",
                    offset: {
                        x: 4,
                        y: -5
                    },	
                }
            }
        },
        article: {
            distanceToMainLine: 160,
            autoStacking: {
                topGap: 50
            },
            periodLine: {
                thickness: 4
            },
            defaultStyle: {
                width: 80,
                maxImageHeight: 95,
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
                },
                connectorLine: {                         
                    offsetX: 9,                   
                    offsetY: -10,
                    thickness: 1,
                    arrow: {
                        width: 8, 
                        height: 22 
                    }
                },
            },
            defaultActiveStyle: {
                border: {
                    width: 2
                }
            }
        }
    },
    
    //overrides for large height timeline
    large: {
        verticalOffset: 40,
        style: {
            mainLine: {
                size: 8
            },
            marker: {
                minor: {
                    height: 12               
                },
                major: {
                    height: 30
                }
            },
            dateLabel: {
                minor: {
                    font: "normal 10px Calibri"
                },
                major: {
                    font: "normal 16px Calibri",
                    offset: {
                        x: 4,
                        y: 0
                    },	
                }
            }
        },
        article: {
            distanceToMainLine: 390,
            autoStacking: {
                topGap: 100
            },
            periodLine: {
                thickness: 8
            },
            defaultStyle: {
                width: 175,
                maxImageHeight: 260,
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
                },
                connectorLine: {                         
                    offsetX: 18,                   
                    offsetY: -20,
                    thickness: 1,
                    arrow: {
                        width: 16, 
                        height: 45 
                    }
                }
            },
            defaultActiveStyle: {
                border: {
                    width: 3
                }
            }
        }
    }
    
    //can add mobile portrait/landscape overrides here too if needed
}

export var APP_OPTIONS = {
    filters: ["P21", "P106", "P19", "P20", "P69", "P140", "P735", "P734"],
    colorCode: {
        properties: [],
        colors: ['#1a5d1f', '#7b1fa2', '#b78617', '#d66f6f', '#56ab6c', '#377f9a']
    },
    contentPanel: {
        tabs: {
            // Setup the dictionary of Welsh Biography related content tab
            dwb: {
				elementId: 'reading-panel-iframe',
				isButtonVisible: function(article) {
					return !!article.data.dwbUrl;
				},
				update: function(article) {
					$('#' + this.elementId).prop( 'src', article.data.dwbUrl)
				}
            }
            // Wikipedia tab already in default ContentPanel.js options
        }
    }
}