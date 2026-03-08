// ── SHARED CONSTANTS ──────────────────────────────────────────
// Set up dimensions and margins (Dufour & Meeks pattern)
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width  = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth  = width  - margin.left - margin.right;
const innerHeight = height - margin.top  - margin.bottom;

// Separate margin for scatterplot (needs room for legend on right)
const marginS = { top: 40, right: 140, bottom: 50, left: 70 };
const innerWidthS  = width  - marginS.left - marginS.right;
const innerHeightS = height - marginS.top  - marginS.bottom;

/* Make the colours accessible globally */
/***************************************/
const barColor            = "#4a5568";
const bodyBackgroundColor = "#fffaf0";

// Colour scale for screen tech (scatter)
const colorScale = d3.scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#3b82f6", "#f59e0b", "#16a34a"]);

// Shared innerChart references (assigned during draw functions)
let innerChart  = null;   // histogram
let innerChartS = null;   // scatterplot

// set up the scales
const xScale  = d3.scaleLinear();
const yScale  = d3.scaleLinear();
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Tooltip dimensions
const tooltipWidth  = 65;
const tooltipHeight = 32;

/***************************************/
/* Make the filter options accessible globally */
/***************************************/
const filters_screen = [
  { id: "all",  label: "All",  isActive: true  },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

const filters_size = [
  { id: "all", label: 'All Sizes', isActive: true  },
  { id: "24",  label: '24"',       isActive: false },
  { id: "32",  label: '32"',       isActive: false },
  { id: "55",  label: '55"',       isActive: false },
  { id: "65",  label: '65"',       isActive: false },
  { id: "98",  label: '98"',       isActive: false },
];

// Create a bin generator using d3.bin
const binGenerator = d3.bin()
  .value(d => d.energyConsumption) // Accessor for energyConsumption