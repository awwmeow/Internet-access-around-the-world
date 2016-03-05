
var linePlotSvg = d3.select("#linePlot").append("svg")
.attr("width", "800").attr("height", "400").attr("class","linePlotClass");

var dataset;

d3.json("javascripts/worldData.json", function (error, JSONData) {
	if (error) return console.warn(error);
	dataset = JSONData;
});

		
var height = linePlotSvg.attr("height");
var width = linePlotSvg.attr("width");

var padding = 50;
var xScale = d3.scale.linear().domain([1990, 2015]).range([padding, width-padding]);
var yScale = d3.scale.linear().domain([0, 100]).range([height - padding, padding]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
.ticks(5).tickFormat(d3.format("d"));
var yAxis = d3.svg.axis().scale(yScale).orient("left");

linePlotSvg.append("g").attr("transform", "translate(0," + (height - padding) + ")").attr("class", "axis")
.call(xAxis);
linePlotSvg.append("g").attr("transform", "translate(" + padding + ", 0" + ")").attr("class", "axis")
.call(yAxis);


var line = d3.svg.line()
.x(function (d) { console.log(d); return xScale(d.Time); })
.y(function (d) { return yScale(d.Value); });

var dict = {};

d3.json("javascripts/worldData.json", function (error, entireJSONData) {
	var rows = entireJSONData.data; 

rows.forEach(function(country) {
		if(!dict[country.location]) {
			dict[country.location] = [];
		}
		currentRowDict = {}
		if(country.Value == null)
			currentRowDict.Value = 0;
		else
			currentRowDict.Value = country.Value;
		if(Number(country.Time.substring(0,4)) >= 1990) {
			currentRowDict.Time = Number(country.Time.substring(0,4));
			dict[country.location].push(currentRowDict);
		}
			
	});

	linePlotSvg.append("path").attr("d", line(dict["United States"]))
	.attr("class", "outline").style("stroke", "red");
	linePlotSvg.append("path").attr("d", line(dict["China"]))
	.attr("class", "outline").style("stroke", "blue");
	linePlotSvg.append("path").attr("d", line(dict["India"]))
	.attr("class", "outline").style("stroke", "green");
	linePlotSvg.append("path").attr("d", line(dict["Mexico"]))
	.attr("class", "outline").style("stroke", "purple");
	linePlotSvg.append("path").attr("d", line(dict["Germany"]))
	.attr("class", "outline").style("stroke", "black");
});


