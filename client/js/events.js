
// Links UI elements with app functions via clicks and other events
// Note: Some other modules have event handlers setup internally as well, but
// generally this file is what needs editing if you make changes/additions to the UI

export function registerEvents(app) {

    // Toggle display of Welsh History context events
    $('#btn-world-events').click(function () {
        var isActive = app.timeline.showContextEvents = !app.timeline.showContextEvents;
        if (isActive) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
        app.filtersChanged();

    });

    // Toggle to show/hide search box (only applicable on small screen device)
    $('#show-search-btn').click(function () {
        if (!$(this).hasClass("active")) {
            $('#timeline-title-container').css("display", "none");
            $('.event-title-container').css("display", "flex");
            $(this).addClass("active");
        } else {
            $('#timeline-title-container').css("display", "flex");
            $('.event-title-container').css("display", "none");
            $(this).removeClass("active");
        }
    });

    // Colour code panel
    $('#btn-open-color-code').click(function () {
        app.openColorCodePanel();
    });

    $('#btn-close-color-code-desktop, #btn-close-color-code-mobile').click(function () {
        app.closeColorCodePanel();
    });

    $('#color-code-select').on('change', function () {
        var selection = $(this).val();
        app.setColorCode(selection)
    })

    // Filter panel
    $('#btn-open-filters').click(function () {
        app.openFilterTypesPanel()
    })

    $('.btn-close-filter-types-panel').click(function () { //todo: temporary selector
        app.closeFilterTypesPanel()
    })

    $('.btn-close-filter-panel').click(function () {
        app.closeFilterSearchPanel();
    })

    $('#filter-types-list-container').on('click', 'button', function () {
        var filterProperty = $(this).attr('filter-property');
        app.openFilterSearchPanel(filterProperty);
    })

    $('#btn-clear-all-filters').click(function () {
        app.clearAllFilters();
    })

    // Share panel
    $('#btn-open-share').click(function () {
        app.openSharePanel();
        app.updateShareUrl();
    })

    $('.btn-close-share-panel').click(function () {
        app.closeSharePanel()
    })

    $('.share-checkbox input').on('change', function () {
        app.updateShareUrl();
    })

    // Info panel
    $('#btn-open-info').click(function () {
        app.openInfoPanel()
    })

    $('.btn-close-info-panel').click(function () {
        app.closeInfoPanel()
    })

    // Remove filter from click on 'x' in from filter tag
    $('#active-filters-container, #panel-active-filters-container').on('click', 'a', function () {
        var $tag = $(this).closest('.active-filter-tag'),
            property = $tag.attr('filter-property'),
            value = $tag.attr('filter-value');
        app.removeFilter(property, value);
    })

    // Floating timeline controls
    $('.timeline-controls-set').on("click", "a", function (ev) {
        var buttonId = $(this).attr("id");
        switch (buttonId) {
            case "zoom-in-btn":
                app.timeline.setZoom(app.timeline.timescaleManager.zoom - 1.5);
                break;
            case "zoom-out-btn":
                app.timeline.setZoom(app.timeline.timescaleManager.zoom + 1.5);
                break;
            case "fit-screen-btn":
                var offsetX = (!app.contentPanel.isOpen || app.isMobile)? 0 : 450;
                app.timeline.fitArticles({offsetX: offsetX});
        }
    })
    
    // Hide search 'x' button when empty
    $('#search-box').on('input js-input', function () {
        // 'input' for normal user input, 'js-input' for script updated input
        if ($(this).val() !== "") {
            $('#btn-close-reading-panel').css('visibility', 'visible')
        } else if (!app.contentPanel.isOpen) {
            // Do not hide clear search button if content panel is open
            // because it doubles as the close button
            $('#btn-close-reading-panel').css('visibility', 'hidden')
        }
    })
    
    // Close hamburger menu on 'touch' event outside the menu
    $(document).on('touchstart', function (event) {
        if (!$('#hamburger').is(":visible")) return;
        var $target = $(event.target);
        if (!$target.closest('#hamburger').length) {
            // Slight delay fixes issue with content panel tab clicks not registering
            // if they trigger a menu collapse
            // Todo: find better way to fix
            setTimeout(function () { $('#hamburger').collapse('hide') }, 100);
        }
    });
}