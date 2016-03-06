var width = "100%",
    height = 500;

var usMapProjection = d3.geo.albersUsa();
var usMapPath = d3.geo.path().projection(usMapProjection);
	
var usMapSvg = d3.select("#us-map").append("svg")
    .attr("width", width)
    .attr("height", height);

var states;
var usMapPopulationScale = d3.scale.linear().domain([0.5 , 0.95]).range(["#fff7f3", "#49006a"]);

d3.json("javascripts/states.json", function(error, shapes) {
	if (error) throw error;
	states = topojson.feature(shapes, shapes.objects.states).features;

	d3.csv("javascripts/iud.csv", function (error, rows) {
		if (error) throw error;

		m = d3.map(rows, function (row) { 
				return Number(row.id); 
			});

		var statePaths = usMapSvg.append("g")
						.selectAll("path").data(states).enter()
						.append("path").attr("d", usMapPath)
						.style("fill",  function(state) {
							var stateData = m.get(state.id);
							if (stateData) {
								return usMapPopulationScale(stateData.InternetPenetration);
							}
							else { 
								return "#D3D3D3"; 
							}
						})
						.style("stroke", "#ccc");
	}); // end csv
}); // end json