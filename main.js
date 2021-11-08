let url = 'https://raw.githubusercontent.com/VenkataRevanthNaidu/DatavizG14/a436bfd78eb409f4a616a75bab4e474a942a6f3a/Crime2012.geojson';

const apiKey = 'pk.eyJ1IjoidmVua2F0YS1yZXZhbnRoIiwiYSI6ImNrdms0cHo2ZjJyOGQyb3AxazYydjVxcjMifQ.ZW6cs3QPRLVI3h32yzBDpw';

const mymap = L.map('map').setView([39.324, -76.612 ], 11.5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    minZoom:11,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);
	

d3.json(url).then(function (data) {
    console.log(data);
    L.geoJSON(data, {
        
        onEachFeature: onEachFeature,
        // Creating circle marker
        pointToLayer: function (feature, latlng) {
            console.log('Creatin marker');
            return new L.marker(latlng,{
            }).addTo(mymap);   
        }
    });
});

function onEachFeature(feature, layer) {
    // console.log('Creating pop up'),
    //Pop up layer using title, title and magnitude
    var popupText = (layer.bindPopup('<h2>'+'Baltimore city'+'</h2>'+'<h3>' + 'Location : ' + feature.properties.Neighbourhood + '</h3>'+'<h3>'+'Crime:'+feature.properties.Description+'</h3>' + '<h3>' + 'Impact of crime : '+feature.properties.Impact + '</h3>'+'<h3>' + 'Intensity of crime : '+feature.properties.Intensity + '</h3>'
    )).addTo(mymap)
};



