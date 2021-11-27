d3.csv("Main Crime.csv").then(function (dataset) {
  console.log(dataset)
  var dimensions = {
    width: 800,
    height: 550,
    margin: {
      top: 70,
      bottom: 40,
      right: 20,
      left: 50
    }
  }
  var data = dataset.map(d => {
    return {
      Impact1: d.Impact,
      Neighbourhood1: d.Neighbourhood,
      Intensity1: d.Intensity,
      Year: d.CrimeDate
    }
  })
  console.log(data)
  //console.log(unique)
  var svg = d3.select("#chart")
    .style("width", dimensions.width)
    .style("height", dimensions.height)

  const allGroup = new Set(data.map(d => d.Year))
  console.log(allGroup)
  d3.select("#year")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; })

  //d3.select("#years").selectAll("option")
  // .data(d3.map(data, function(d){return plit.Year;}).keys())
  //.enter()
  //.append("option")
  //.text(function(d){return d;})
  //.attr("value",function(d){return d;});
  //viewof years=Inputs.select({
  //	options: years,
  //	value:"2012"
  //})
  //var Unique=_.uniqBy([].concat(...plit))

  var xAccessor = d => +d.Impact1
  var yAccessor = d => +d.Intensity1
  var xAccessorNew = d => d.Neighbourhood1
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor)).nice()
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
  var yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor)).nice()
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
  /*var dots = svg.selectAll("circle")
               .data(data.filter(function(d){return d.Year=="2012"}))
                .enter()
               .append("circle")
               .attr("cx", d => xScale(xAccessor(d)))
              .attr("cy", d => yScale(yAccessor(d)))
             .attr("fill","#3357C0")
               .attr("r", 5)     */
  var xAxisgen = d3.axisBottom().scale(xScale)
  var yAxisgen = d3.axisLeft().scale(yScale)
  var xAxis = svg.append("g")
    .call(xAxisgen)
    .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
  var yAxis = svg.append("g")
    .call(yAxisgen)
    .style("transform", `translateX(${dimensions.margin.left}px)`)
  function update(selectedGroup) {
    var datafliter = data.filter(function (d) { return d.Year == selectedGroup })
    console.log(datafliter, selectedGroup)
    var dots = svg.selectAll("circle")
      .data(datafliter)
      .enter()
      .append("circle")
      //.transition()
      //.duration(1000)
      .attr("fill", "#3357C0")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 5);


  }
  d3.select("#year").on("change", function (event, d) {
    let selectedOption = d3.select(this).property("value")
    update(selectedOption)
  })
  svg.node();
})
