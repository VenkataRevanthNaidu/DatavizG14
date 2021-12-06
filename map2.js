    // STEP 1: MAKE A MAP AND ADD LAYERS
   // var timeInput=document.getElementById('timeInput')
    var map = L.map('map').setView([39.324, -76.612], 12);
  
    L.esri.Vector.vectorBasemapLayer('ArcGIS:Community', {
      apikey: 'AAPK8259af609fad4afaad0554ebf97205c9ps9yDjujF4N1L4UjHBywwT-yYLQiyUni7Sca8I_7F5k9tJ6zImhOpMi4Pg62uX7w' // Replace with your API key - https://developers.arcgis.com
    }).addTo(map);
  
    //create and add a feature layer
    // features from this layer will appear in the Chart.js scatterplot
    var treesFeatureLayer = L.esri.featureLayer({
        url: 'https://services3.arcgis.com/bO7Hf5i6aZdITjmq/arcgis/rest/services/crime_2012/FeatureServer/0'

    }).addTo(map);

     treesFeatureLayer.bindPopup(function(layer){
	return L.Util.template('<p>Frequently occurred Crime:<strong>{Description}</strong><br>location:<strong>{Neighbourhood}</strong></p>',layer.feature.properties);
	});
    // STEP 2: DEFINE A CHART
    // this is a static scatterplot chart definition for now, but it will
    // soon become dynamic by responding to map and feature layer events
    var initialChartData = {
      datasets: [{
        label: 'Crime HotSpots in Baltimore 2012',
        // the data values are empty at this moment
        // and will be updated dynamically below
        data: []
      }]
    };
  
    var chartOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Impact'
          },
          ticks: {
            beginAtZero: true,
            max: 1,
            stepSize: 0.2
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Intensity'
          },
          ticks: {
            beginAtZero: true,
            max: 2000,
            stepSize: 200
          }
        }]
      },
      maintainAspectRatio: false,
      // turn off animations during chart data updates
      animation: {
        duration: 0
      },
      // see STEP 4 below
      onHover: handleChartHover
    };
  
    var chart = new Chart('chartCanvas', {
      type: 'scatter',
      data: initialChartData,
      options: chartOptions
    });
  
    // STEP 3: MAKE THE CHART DYNAMIC BY ESTABLISHING MAP-TO-CHART COMMUNICATION
    // show in the scatterplot only the features in the map's current extent
    // by handling several events from both the map and feature layer
    map.on('zoom move', updateChart);
    treesFeatureLayer.on('load', updateChart);
  
    function updateChart () {
      // reformat the features' attributes of interest into
      // the data array format required by the Chart.js scatterplot
      var scatterPlotDataArray = [];
  
      treesFeatureLayer.eachActiveFeature(function (e) {
        // loop over each active feature in the map extent and
        // push an object into the scatterPlotDataArray in this format:
  
        // {
        //   x: diameter attribute value,
        //   y: height attribute value,
        //   featureId: unique ID for chart-to-map communication in STEP 4
        // }
  
        scatterPlotDataArray.push({
          x: e.feature.properties.Impact,
          y: e.feature.properties.Intensity,
          featureId: e.feature.id
        });
      });
  
      // assign the new scatterPlotDataArray to the chart's data property
      chart.data.datasets[0].data = scatterPlotDataArray;
  
      // finally, instruct the chart to re-draw itself with the new data
      chart.update();
    }
  
    // STEP 4 (OPTIONAL): ESTABLISH CHART-TO-MAP COMMUNICATION
    // up until now the map and feature layer inform the chart what to render,
    // but interactions with the chart can also influence the map contents
    function handleChartHover (e) {
      var chartHoverData = chart.getElementsAtEvent(e);
  
      if (!chartHoverData.length) {
        // if there were no data elements found when hovering over the chart,
        // reset any previous styling overrides and return
        treesFeatureLayer.eachFeature(function (e) {
          e.setOpacity(1);
          e.setZIndexOffset(0);
        });
  
        return;
      }
  
      // otherwise, bring attention to the features on the map
      // that are currently being hovered over in the chart
      var hoverFeatureIds = chartHoverData.map(function (datum) {
        return chart.data.datasets[0].data[datum._index].featureId;
      });
  
      treesFeatureLayer.eachFeature(function (e, idx) {
        if (
          hoverFeatureIds.indexOf(e.feature.id) > -1
        ) {
          e.setOpacity(1);
          e.setZIndexOffset(1000);
        } else {
          e.setOpacity(0.01);
        }
      });
    }
