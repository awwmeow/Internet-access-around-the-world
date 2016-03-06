(function(){
var mobileLinePlotSvg = d3.select("#mobileLinePlot").append("svg")
.attr("width", "800").attr("height", "500").attr("class","linePlotClass");
var dataset;		
var height = mobileLinePlotSvg.attr("height");
var width = mobileLinePlotSvg.attr("width");
var padding = 80;
var xScale = d3.scale.linear().domain([1990, 2015]).range([padding, width-padding]);
var yScale = d3.scale.linear().domain([0, 170]).range([height - padding, padding]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
.ticks(5).tickFormat(d3.format("d"));
var yAxis = d3.svg.axis().scale(yScale).orient("left");
var line = d3.svg.line()
.x(function (d) { console.log(d); return xScale(d.Time); })
.y(function (d) { return yScale(d.Value); });
var dict = {};

mobileLinePlotSvg.append("g").attr("transform", "translate(0," + (height - padding) + ")").attr("class", "axis")
.call(xAxis);
mobileLinePlotSvg.append("g").attr("transform", "translate(" + padding + ", 0" + ")").attr("class", "axis")
.call(yAxis);



d3.csv("javascripts/mobile.csv", function (error, entireCSVData) {
	var rows = entireCSVData; 	
	dict={};
	rows.forEach(function(country){
		countryArray = [];
		for(key in country) {
			countryDict = {};
			if(!isNaN(Number(key.substring(0,4)))) {
				console.log(Number(key.substring(0,4)));
				countryDict.Time = Number(key.substring(0,4));
				countryDict.Value = country[key]
				countryArray.push(countryDict);
			}
		}
	dict[country["Country Name"]] = countryArray;
})
var countries = ["United States","China","India","Mexico","Libya"];
var colors = ["red","blue","green","purple","black"];
for(var i=1; i<6; i++) {
	mobileLinePlotSvg.append("circle")
					 .attr("cx", 130*i)
					 .attr("cy", 470)
					 .attr("r",6)
					 .style("fill", colors[i-1])
	mobileLinePlotSvg.append("text")
					 .attr("x", (130*i)+10)
					 .attr("y", 474)
					 .text(countries[i-1])
}
mobileLinePlotSvg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Mobile subscription per 100 people");

mobileLinePlotSvg.append("path").attr("d", line(dict["United States"]))
.attr("class", "outline").style("stroke", "red").style("stroke-dasharray", ("3, 3"));
mobileLinePlotSvg.append("path").attr("d", line(dict["China"]))
.attr("class", "outline").style("stroke", "blue").style("stroke-dasharray", ("3, 3"));
mobileLinePlotSvg.append("path").attr("d", line(dict["India"]))
.attr("class", "outline").style("stroke", "green").style("stroke-dasharray", ("3, 3"));
mobileLinePlotSvg.append("path").attr("d", line(dict["Mexico"]))
.attr("class", "outline").style("stroke", "purple").style("stroke-dasharray", ("3, 3"));
mobileLinePlotSvg.append("path").attr("d", line(dict["Libya"]))
.attr("class", "outline").style("stroke", "black").style("stroke-dasharray", ("3, 3"));
});
})();



