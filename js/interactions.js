// ── STEP 7: POPULATE FILTERS ──────────────────────────────────
const populateFilters = (data) => {

  // Step 7.3 — Build screen tech buttons
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)

      .on("click", (e, d) => {
        console.log("Clicked filter:", e);
        console.log("Clicked filter data:", d);

        if (!d.isActive) {
          // make sure button clicked is not already active
          filters_screen.forEach(filter => {
            filter.isActive = filter.id === d.id ? true : false;
          });

          // update the filter buttons based on which one was clicked
          d3.selectAll("#filters_screen .filter")
            .classed("active", filter => filter.id === d.id ? true : false);

          updateHistogram(d.id, data);
        }
      });

  // ── Screen size filter buttons ─────────────────────────────
  d3.select("#filters_size")
    .selectAll(".filter")
    .data(filters_size)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)

      .on("click", (e, d) => {
        if (!d.isActive) {
          filters_size.forEach(filter => {
            filter.isActive = filter.id === d.id ? true : false;
          });

          d3.selectAll("#filters_size .filter")
            .classed("active", filter => filter.id === d.id ? true : false);

          updateSize(d.id, data);
        }
      });
};

// Track current active filters
let currentTechFilter = "all";
let currentSizeFilter = "all";

// Step 7.4 — Update the histogram (screen tech filter)
const updateHistogram = (filterId, data) => {

  // 1. Filter data
  const updatedData = filterId === "all"
    ? data
    : data.filter(tv => tv.screenTech === filterId);

  currentTechFilter = filterId;

  // Re-apply size filter on top
  const displayData = currentSizeFilter === "all"
    ? updatedData
    : updatedData.filter(tv => tv.screenSize === +currentSizeFilter);

  // 2. Use filtered data to update the bins using binGenerator
  const updatedBins = binGenerator(displayData);

  // 3. Use the updatedBins to draw the histogram rectangles with transitions
  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y",      d => yScale(d.length))
      .attr("height", d => innerHeight - yScale(d.length));
};

// Screen size filter
const updateSize = (filterId, data) => {

  const updatedData = filterId === "all"
    ? data
    : data.filter(tv => tv.screenSize === +filterId);

  currentSizeFilter = filterId;

  // Re-apply tech filter on top
  const displayData = currentTechFilter === "all"
    ? updatedData
    : updatedData.filter(tv => tv.screenTech === currentTechFilter);

  const updatedBins = binGenerator(displayData);

  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y",      d => yScale(d.length))
      .attr("height", d => innerHeight - yScale(d.length));
};

// ── STEP 3: TOOLTIP ───────────────────────────────────────────
// Tooltip dimensions — tall enough for 3 lines
const tooltipW = 160;
const tooltipH = 58;

const createTooltip = () => {

  // Step 3.2 — Append tooltip group to scatterplot's innerChartS
  const tooltip = innerChartS
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Step 3.3 — Append tooltip background rectangle
  tooltip
    .append("rect")
      .attr("width",  tooltipW)
      .attr("height", tooltipH)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "#2c2016")
      .attr("fill-opacity", 0.85);

  // Step 3.4 — Append tooltip text with three lines (brand, model, screen size)
  const text = tooltip
    .append("text")
      .attr("class", "tooltip-text")
      .attr("x", tooltipW / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "11px");

  text.append("tspan")
    .attr("class", "tt-brand")
    .attr("x", tooltipW / 2)
    .attr("dy", "14px")
    .style("font-weight", "700")
    .style("font-size", "12px");

  text.append("tspan")
    .attr("class", "tt-model")
    .attr("x", tooltipW / 2)
    .attr("dy", "15px");

  text.append("tspan")
    .attr("class", "tt-size")
    .attr("x", tooltipW / 2)
    .attr("dy", "15px")
    .style("font-weight", "700");
};

// ── STEP 3.5: MOUSE EVENTS ────────────────────────────────────
// NOTE: This function must be OUTSIDE of createTooltip
const handleMouseEvents = () => {

  // Step 3.6 — Select all the circles in our scatter plot
  innerChartS.selectAll("circle")

    .on("mouseenter", (e, d) => {
      console.log("Mouse entered circle", d);

      // 1. Update all three tooltip lines — brand, model, screen size
      d3.select(".tt-brand").text(d.brand.toUpperCase());
      d3.select(".tt-model").text(d.model);
      d3.select(".tt-size").text(d.screenSize + '" screen');

      // 2. Use information from e to position tooltip relative to circle centre
      const cx = e.target.getAttribute("cx");
      const cy = e.target.getAttribute("cy");

      // 3. Position tooltip — above circle normally, below if near top of chart
      const tipX = Math.min(Math.max(+cx - 0.5 * tooltipW, 0), innerWidthS - tooltipW);
      const tipY = +cy < tooltipH + 12 ? +cy + 12 : +cy - tooltipH - 8;

      d3.select(".tooltip")
        .attr("transform", `translate(${tipX}, ${tipY})`)
        .transition()
          .duration(200)
          .style("opacity", 1);
    })

    .on("mouseleave", (e, d) => {
      console.log("Mouse left circle", d);

      // 4. Make tooltip transparent and move off screen
      d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);
    });
};