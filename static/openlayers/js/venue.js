// For marker 
var locationLonLat = [120.7969677, 23.6729523];

var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(locationLonLat)),
    name: 'GSROC2017'
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '/static/openlayers/img/marker-venue.png'
    }))
});

iconFeature.setStyle(iconStyle);

var destination = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [iconFeature]
    })
});

// For routes
var vectorLayers = new ol.layer.Group({
    title: 'Overlays'
})

// For basemap
var baseMaps = new ol.layer.Group({
    title: 'Base maps',
    layers: [
        new ol.layer.Tile({
            title: 'Aerial(Bing Maps)',
            type: 'base',
            visible: 'false',
            source: new ol.source.BingMaps({
                key: 'AlxFuAqoN4uAZePt2rRG-Dv2pSkpmLVUY_1WvZyJiq4UlfOeHKnvyCXDq-z0Oh2A',
                imagerySet: 'AerialWithLabels',
                maxZoom: 19
            }),
        }),
        new ol.layer.Tile({
            title: 'Landscape',
            type: 'base',
            visible: 'false',
            source: new ol.source.OSM({
                url: 'https://c.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
                attributions: [
                    new ol.Attribution({
                        html: 'Maps © <a href="http://www.thunderforest.com">Thunderforest</a>, Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                    })
                ]
            }),
        }),
        new ol.layer.Tile({
            title: 'OpenCycleMap',
            type: 'base',
            visible: 'false',
            source: new ol.source.OSM({
                url: 'https://c.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
                attributions: [
                    new ol.Attribution({
                        html: 'Maps © <a href="http://www.thunderforest.com">Thunderforest</a>, Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                    })
                ]
            }),
        }),
        new ol.layer.Tile({
            title: 'OpenStreetMap',
            type: 'base',
            visible: 'true',
            source: new ol.source.OSM(),
        })
    ]
});

var map = new ol.Map({
    layers: [vectorLayers, baseMaps, destination],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat(locationLonLat),
        zoom: 16
    }),
    controls: ol.control.defaults({attribution: true})
});

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Layer Switcher'
});
map.addControl(layerSwitcher);

// For marker popup
var element = document.getElementById('popup');

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});

map.addOverlay(popup);


// Display popup on click
map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        $(element).popover({
            'placement': 'top',
            'html': true,
            'content': feature.get('name')

        });
        $(element).popover('show');

    } else {
        $(element).popover('destroy');

    }

});

// Change mouse cursor when over marker
map.on('pointermove', function(e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
