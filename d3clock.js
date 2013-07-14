(function() {
var w = 960,
    h = 500,
    r = 225,
    t = 62;

var fields = [
  {name: "hours", value: 0, size: 24},
  {name: "minutes", value: 0, size: 60},
  {name: "seconds", value: 0, size: 60}
];

// add prototypes to String
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

// arc related functions
var arc = d3.svg.arc()
    .innerRadius(function(d, i) { return r-((i+1)*t); })
    .outerRadius(function(d, i) { return r-(i*t); })
    .startAngle(0)
    .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

function arcTween(time, index) {
  var interp = d3.interpolate({value: time.previous}, time);
  return function(t) {
    return arc(interp(t), index);
  };
}

var identity = function(d) { return d.name; }

var svg = d3.select('#clock').append('svg:svg')
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(0," + (h / 2) + ")");
    
// draw time labels
var text_group = svg.append("svg:g")
  .attr("class", "text_group")
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(.55)" )

// render a date as HH:mm:ss
var formattedTime = function(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  hours = hours.toString().paddingLeft("00");
  minutes = minutes.toString().paddingLeft("00");
  seconds = seconds.toString().paddingLeft("00");

  return "{0}:{1}:{2}".format(hours, minutes, seconds);
};

var displayClock = function(now) {
  fields[0].previous = fields[0].value; fields[0].value = now.getHours();
  fields[1].previous = fields[1].value; fields[1].value = now.getMinutes();
  fields[2].previous = fields[2].value; fields[2].value = now.getSeconds();

  var filteredData = fields.filter(function(d) { return d.value; })
  
  text_group.remove()
  text_group = svg.append("svg:g");
  
  // draw arcs...
  var path = svg.selectAll("path")
      .data(filteredData, identity);

  path.enter().append("svg:path")
   .attr("transform", "translate(" + w / 2 + "," + 0 + ")")
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
  text_group.append("svg:text")
    .attr("class", "time")
    .attr("dy", 7)
    .attr("transform", "translate(" + w / 2 + "," + 0 + ")")
    .attr("text-anchor", "middle")
    .text(formattedTime(now));	
}

setInterval(function() {
  var now = new Date();
  displayClock(now);
}, 1000);
})();
