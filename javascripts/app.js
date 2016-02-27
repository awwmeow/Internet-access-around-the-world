var mapSvg = d3.select('#map').append("svg").attr("width", "100%").attr("height", "100%").attr("class","worldMap");
var projection = d3.geo.mercator(); 
var path = d3.geo.path().projection(projection);
var height = mapSvg.attr("height");
var width = mapSvg.attr("width");
// var populationScale = d3.scale.linear().domain([0, 100]).range([ "#f5f5f5", "#5ab4ac"]);
var populationScale = d3.scale.linear().domain([0, 100]).range([ "#00f", "#000"]);
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
