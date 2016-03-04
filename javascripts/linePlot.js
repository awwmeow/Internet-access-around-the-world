var mapSvg = d3.select('#map').append("svg").attr("width", "100%").attr("height", "100%").attr("class","worldMap");
var projection = d3.geo.mercator(); 
var path = d3.geo.path().projection(projection);
var height = mapSvg.attr("height");
var width = mapSvg.attr("width");
var populationScale = d3.scale.linear().domain([0, 100]).range([ "#f00", "#5ab4ac"]);
// var populationScale = d3.scale.linear().domain([0, 100]).range([ "#00f", "#000"]);
var digitScale = d3.scale.category10()

d3.json("javascripts/worldPaths.json", function(error, world) {
	if(error) {
		console.log("after json");
	}
	var countries = world.features;
	var list = [];
		
	var countryPaths = mapSvg.append("g");
	countryPaths.selectAll("path").data(countries).enter()
	.append("path")
	.attr("d", path)
	.style("fill", function (country) { return digitScale(Math.floor(country.id)); }) // every county id is 5 digits
	.style("stroke", "none");
	// countries.forEach(function(country){
	// 	var countryPaths = mapSvg.append("g");
	// 	countryNames.push(country.properties.name);
	// 	countryPaths.append("path")
	// 	 .attr("d", path(country))
	// 	 .style("fill", "#d9d9d9")
	// 	 .style("stroke", "#eee")
	// });

	d3.json("javascripts/worldData.json", function (error, entireJSONData) {
		var rows = entireJSONData.data; 
		var countryNames = [];
		var dict = {};
		rows.forEach(function(country) {
			dict[country.location] = country.Value;
		})

		// if (error
		usdaAtlas = d3.map(rows, function (country) { return Number(country.location); });
		
		countryPaths.selectAll("path")
		.style("fill", function (country) {
			var countryName = country.properties.name;

			var value = dict[countryName];
			if(!value) return "none";
			return populationScale(value);
			// set fill based on county attributes
		})
		.on("mouseover", function(country) {
			console.log(country.properties.name);
		})

	});
});


// <--------------------
// END OF MAP - BEGINNING OF LINE PLOT
// -------------------->


var linePlotSvg = d3.select("#linePlot").append("svg")
.attr("width", "700").attr("height", "700").attr("class","linePlotClass");

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


