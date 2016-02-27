var mapSvg = d3.select('#map').append("svg").attr("width", "100%").attr("height", "100%").attr("class","worldMap");
var projection = d3.geo.mercator(); 
var path = d3.geo.path().projection(projection);
var g = mapSvg.append("g");
var height = mapSvg.attr("height");
var width = mapSvg.attr("width");

d3.json("javascripts/worldPaths.json", function(error, world) {
	worldObjects = world;
	if(error) {
		console.log("after json");
	}
	var countries = topojson.feature(world, world.objects.countries).features;

	countries.forEach(function(country){
		g.append("path")
		 .attr("d", path(country))
		 .style("fill", "#d9d9d9")
		 .style("stroke", "#eee")
	})
});