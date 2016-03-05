var mapSvg = d3.select('#map').append("svg").attr("width", "100%").attr("height", "500px").attr("class","worldMap");
var projection = d3.geo.equirectangular().translate([600, 240]).scale(250); 
var path = d3.geo.path().projection(projection);
var height = mapSvg.attr("height");
var width = mapSvg.attr("width");
// var populationScale = d3.scale.linear().domain([0, 100]).range([ "#f5f5f5", "#5ab4ac"]);
var populationScale = d3.scale.linear().domain([0, 80]).range([ "#fff7f3", "#49006a"]);
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
	.attr("d", path);
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
		var max =0, min =100;
		var maxCountry= [], minCountry=[];
		rows.forEach(function(country) {
			if(country.Time == "2014-01-01T00:00:00Z") {
				dict[country.location] = country.Value;
				if(max < country.Value) {
					max = country.Value;
					maxCountry.push(country.location);
				}
				if(min >= country.Value) {
					min = country.Value;
					minCountry.push(country.location);
				}
			}
				
		});
		console.log("Max is : "+max+" and maxCountry is: "+maxCountry);
		console.log("Max is : "+min+" and minCountry is: "+minCountry);
		minCountryText = "American Samoa,Korea, Dem. Rep.,Northern Mariana Islands,Palau,Tuvalu,San Marino";
		var gradient = mapSvg.append("svg:defs")
						    .append("svg:linearGradient")
						    .attr("id", "gradient")
						    .attr("x1", "0%")
						    .attr("y1", "0%")
						    .attr("x2", "100%")
						    .attr("y2", "100%")
						    .attr("spreadMethod", "pad");

		gradient.append("svg:stop")
			    .attr("offset", "0%")
			    .attr("stop-color", "#fff7f3")
			    .attr("stop-opacity", 1);

		gradient.append("svg:stop")
			    .attr("offset", "100%")
			    .attr("stop-color", "#49006a")
    			.attr("stop-opacity", 1);

		mapSvg.append("rect")
				.attr("x", 100)
				.attr("y", 550)
				.attr("width", 1000)
				.attr("height", 20)
				.style("stroke","none")
				.attr('fill', 'url(#gradient)');

		for(var i =0; i<minCountry.length-5; i++) {
			mapSvg.append("text")
				.attr("x", 50)
				.attr("y", (i*20)+600)
				.text(minCountry[i+3]);
		}
		for(var i =maxCountry.length, j=0; i>maxCountry.length-5; i--,j++) {
			mapSvg.append("text")
					.attr("x", 1070)
					.attr("y", (j*20)+590)
					.text(maxCountry[i]);
		}

		// mapSvg.append("rect")
		// 		.attr("x", 800)
		// 		.attr("y", 550)
		// 		.attr("width", 20)
		// 		.attr("height", 20)
		// 		.style("fill", "49006a")
		// 		.style("stroke","#000")

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
