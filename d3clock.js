var w = 960,
    h = 500,
    x = d3.scale.ordinal().domain(d3.range(3)).rangePoints([0, w], 2);

var fields = [
  {name: "hours", value: 0, size: 24},
  {name: "minutes", value: 0, size: 60},
  {name: "seconds", value: 0, size: 60}
];

var arc = d3.svg.arc()
    .innerRadius(100)
    .outerRadius(140)
    .startAngle(0)
    .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

var svg = d3.select('#clock').append('svg:svg')
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(0," + (h / 2) + ")");
    
  // draw time labels
var text_group = svg.append("svg:g")
  .attr("class", "text_group");
  // .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; })

var identity = function(d) { return d.name; }

setInterval(function() {
  var now = new Date();

  fields[0].previous = fields[0].value; fields[0].value = now.getHours();
  fields[1].previous = fields[1].value; fields[1].value = now.getMinutes();
  fields[2].previous = fields[2].value; fields[2].value = now.getSeconds();

  var filteredData = fields.filter(function(d) { return d.value; })
  
  text_group.remove()
  text_group = svg.append("svg:g")
      .attr("class", "text_group");
  
  // draw arcs...
  var path = svg.selectAll("path")
      .data(filteredData, identity);

  path.enter().append("svg:path")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; })
    .transition()
      .ease("elastic")
      .duration(750)
      .attrTween("d", arcTween);

  path.transition()
      .ease("elastic")
      .duration(750)
      .attrTween("d", arcTween);

  path.exit().transition()
      .ease("bounce")
      .duration(750)
      .attrTween("d", arcTween)
      .remove();

  // draw time
  var timeLabels = text_group.selectAll("time").data(filteredData, identity);

  timeLabels.enter().append("svg:text")
      .attr("class", "time")
      .attr("dy", 7)
      .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; })
      .attr("text-anchor", "middle") // text-align: right
  
  // both enter and update    
  timeLabels
      .text(function(d, i) { return i == 0 ? d.value : ":" + d.value; });
      
  timeLabels.exit().remove()
}, 1000);

function arcTween(b) {
  var i = d3.interpolate({value: b.previous}, b);
  return function(t) {
    return arc(i(t));
  };
}

