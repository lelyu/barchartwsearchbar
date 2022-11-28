// task to be done: adding labels on the bars, add some other art elements, change the drop down logic


const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector(
  "[data-country-cards-countainer]"
);
const serachInput = document.querySelector("[data-search]");

let users = [];

serachInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  users.forEach((user) => {
    const isVisible = user.name.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});

d3.csv("data.csv", d3.autoType).then((data) => {
  console.log(data);
  users = data.map((country) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const header = card.querySelector("[data-header]");
    header.textContent = country.Country;
    userCardContainer.append(card);
    return { name: country.Country, element: card };
  });
  let countryName;
  d3.selectAll(".header").on("click", function () {
    countryName = this.textContent;
    // filter the data by selected country name
    let selected_country = data.filter(
      (country) => country.Country === countryName
    );

    console.log(selected_country);
    renderBarChart(selected_country);
    // call render barchart on countryname
  });
});

// function to render bar chart

let margin = { top: 40, right: 20, bottom: 40, left: 90 },
  width =
    document.querySelector("#chart-area").clientWidth -
    margin.left -
    margin.right,
  height = 400 - margin.top - margin.bottom;

width = width > 600 ? 600 : width;

let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// AXIS

let x = d3.scaleBand().range([0, width]).paddingInner(0.1);

let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(x);

let yAxis = d3.axisLeft().scale(y);

let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

let yAxisGroup = svg.append("g").attr("class", "y-axis axis");

function renderBarChart(data) {
  x.domain([data[0].Country, "World Average"]);
  y.domain([
    0,
    d3.max([
      data[0].Country_Fossil_Fuels_And_Cement_Per_Year,
      data[0].All_Countries_Fossil_Fuels_And_Cement_Per_Year / 220,
    ]),
  ]);

  let y1 = data[0].Country_Fossil_Fuels_And_Cement_Per_Year;

  let y2 = data[0].All_Countries_Fossil_Fuels_And_Cement_Per_Year / 220;
  let x1 = data[0].Country;
  let x2 = "World Average";
  // why is y2 0?
  console.log(x1, x2, y1, y2);
  // ---- DRAW BARS ----
  let bars = svg.selectAll(".bar").remove().exit().data(data);
  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(x1))
    .attr("y", y(y1))
    .attr("height", height - y(y1))
    .attr("width", x.bandwidth())
    .attr("fill", "lightblue");
  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(x2))
    .attr("y", y(y2))
    .attr("height", height - y(y2))
    .attr("width", x.bandwidth())
    .attr("fill", "lightgrey");

  bars
    .append("text")
    .attr("x", x(x1) + margin.left)
    .attr("y", -10)
    .attr("stroke", "black")
    .attr("fill", "lightblue")
    .text(y1);
  //   .on("mouseover", function(event, d) {
  //     //Get this bar's x/y values, then augment for the tooltip
  //     let xPosition =
  //       margin.left +
  //       width / 2 +
  //       parseFloat(d3.select(this).attr("x")) +
  //       x.bandwidth() / 2;
  //     let yPosition =
  //       margin.top + parseFloat(d3.select(this).attr("y")) / 2 + height;

  //     //Update the tooltip position and value
  //     d3.select("#tooltip")
  //       .style("left", xPosition + "px")
  //       .style("top", yPosition + "px")
  //       .select("#value")
  //       .text(d.Visitors);

  //     //Show the tooltip
  //     d3.select("#tooltip").classed("hidden", false);
  //   })
  //   .on("mouseout", function(d) {
  //     //Hide the tooltip
  //     d3.select("#tooltip").classed("hidden", true);
  //   });

  // ---- DRAW AXIS	----
  xAxisGroup = svg
    .select(".x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisGroup = svg
    .select(".y-axis")
    .call(yAxis)
    .append("text")
    .attr("x", margin.left)
    .attr("y", -20)
    .attr("stroke", "black")
    .text("Fossile Fuel and Cement Output in 2014");

  svg.select("text.axis-title").remove();
  // svg
  //   .append("text")
  //   .attr("class", "axis-title")
  //   .attr("x", -5)
  //   .attr("y", -15)
  //   .attr("dy", ".1em")
  //   .style("text-anchor", "end")
  //   .text("Annual Visitors");
}
