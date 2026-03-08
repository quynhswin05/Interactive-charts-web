const drawScatterplot = (data) => {

  d3.select("#scatterplot").select("svg").remove();

  // Set the dimensions and margins of the chart area
  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`) // Responsive SVG

  // Create an inner chart group with margins
  // NOTE: innerChartS is declared as 'let' in shared-constants so we assign (not redeclare)
  innerChartS = svg.append("g")
    .attr("transform", `translate(${marginS.left},${marginS.top})`);

  // Step 2.3 — Set up x and y scales
  xScaleS
    .domain([0, 8])
    .range([0, innerWidthS]);

  yScaleS
    .domain([0, d3.max(data, d => d.energyConsumption)])
    .nice()
    .range([innerHeightS, 0]);

  // Step 2.4 — Set up colour scale
  colorScale
    .domain(data.map(d => d.screenTech)) // Get unique screenTech values
    .range(["#4f8ef7", "#f0a500", "#3a843a"]); // blue=LED, amber=LCD, green=OLED

  // Step 2.5 — Draw the circles
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "dot")
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5); // make circles less opaque so overlapping is visible

  // Step 2.6 — Add bottom axis
  innerChartS
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${innerHeightS})`)
    .call(d3.axisBottom(xScaleS).ticks(8));

  // Add x-axis label
  svg
    .append("text")
    .text("Star Rating")
    .attr("text-anchor", "end")
    .attr("x", width - 20)
    .attr("y", height - 5)
    .attr("class", "axis-label");

  // Add left axis
  innerChartS
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScaleS).ticks(7).tickFormat(d3.format(",")));

  // Add y-axis label
  svg
    .append("text")
    .text("Labeled Energy Consumption (kWh/year)")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .attr("x", -20)
    .attr("y", 18)
    .attr("class", "axis-label");

  // Step 2.7 — Add legend
  const legendData = ["LED", "LCD", "OLED"];

  const legend = innerChartS.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidthS + 16}, 20)`);

  legendData.forEach((tech, i) => {
    legend.append("rect")
      .attr("x", 0)
      .attr("y", i * 22)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", colorScale(tech));

    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 22 + 11)
      .attr("font-size", "12px")
      .text(tech);
  });
};