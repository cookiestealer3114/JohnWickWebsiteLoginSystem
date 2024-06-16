var myData;
var myChart;
document.addEventListener("DOMContentLoaded", function () {
  const month_box = document.getElementById("month_box");
  const stats_grid = document.querySelector(".stats_grid");
  const content_box = document.querySelector(".content_box");
  const channels_box = document.querySelector(".channels_box");
  const cities_box = document.querySelector(".cities_box");

  fetch("jsons/analytics.json")
    .then((response) => response.json())
    .then((data) => {
      this.myData = data;
      console.log(this.myData);
      drawChart(this.myData, "september2023");
    })
    .catch((error) => console.error("GRAPH JSONLOADING ERROR", error));
  month_box.addEventListener("change", () => {
    const monthName = month_box.options[month_box.selectedIndex].value;
    drawChart(this.myData, monthName);
    myChart.update();
  });
  function drawChart(data, monthName) {
    console.log(monthName, "chart shown");
    const days = data[monthName].days.map((entry) => entry.day);
    const values = data[monthName].days.map((entry) => entry.value);
    const maxValue = Math.max(...values);
    const yAxisMax = Math.ceil(maxValue / 100) * 100;

    const canvasElements = document.querySelectorAll(".myChart");

    canvasElements.forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      if (myChart) {
        myChart.destroy();
      }
      myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: days,
          datasets: [
            {
              label: "Значение",
              data: values,
              backgroundColor: "#3C50E0",
              borderWidth: 2,
              borderRadius: 15,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              ticks: {
                stepSize: 1,
                font: {
                  color: "#64748b",
                  size: 14,
                  lineHeight: 2.2,
                  family: "Poppins",
                  style: "normal",
                  weight: 500,
                },
              },
              grid: {
                display: false,
                color: "#E2E8F0",
                offset: true,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                min: 0,
                max: yAxisMax,
                stepSize: yAxisMax / 4,
                callback: function (value, index, values) {
                  return value.toFixed(0);
                },
                callback: function (value, index) {
                  return " " + value;
                },
                font: {
                  color: "#64748b",
                  size: 14,
                  lineHeight: 2.2,
                  family: "Poppins",
                  style: "normal",
                  weight: 500,
                  align: "right",
                },
              },
              grid: {
                display: true,
                drawBorder: false,
                color: "#E2E8F0",
              },

              border: {
                dash: [10, 5],
              },
            },
          },
        },
      });
    });
  }

  fetch("jsons/legends.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const stats_grid_item = document.createElement("div");
        stats_grid_item.className = "stats_grid_item";

        const content = document.createElement("div");
        content.className = "content";

        const risedif = document.createElement("div");
        risedif.className = "risedif";

        const valueElement = document.createElement("div");
        valueElement.className = "value";
        if (item.value >= 1000) {
          valueElement.textContent =
            item.value % 1000 === 0
              ? (item.value / 1000).toFixed(0) + "K"
              : (item.value / 1000).toFixed(1) + "K";
        } else {
          valueElement.textContent = item.value;
        }

        const titleElement = document.createElement("div");
        titleElement.className = "title";
        titleElement.textContent = item.title;

        content.appendChild(valueElement);
        content.appendChild(titleElement);

        const isRiseElement = document.createElement("div");
        isRiseElement.className = item.isRise ? "isRise" : "isRise is-fall";

        const arrowImage = document.createElement("img");
        arrowImage.src = item.isRise
          ? "./img/green-arrow.svg"
          : "./img/yellow-arrow.svg";

        isRiseElement.appendChild(arrowImage);

        const differenceElement = document.createElement("div");
        differenceElement.className = "difference";
        differenceElement.textContent = item.difference + "%";

        if (!item.isRise) {
          differenceElement.classList.add("yellow");
        }

        risedif.appendChild(isRiseElement);
        risedif.appendChild(differenceElement);

        stats_grid_item.appendChild(content);
        stats_grid_item.appendChild(risedif);

        stats_grid.appendChild(stats_grid_item);
      });
    })
    .catch((error) => console.error("STATS JSON LOADING ERROR", error));

  fetch("jsons/top_content.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const content_box_item = document.createElement("div");
        content_box_item.className = "content_box_item";

        const views_uniques = document.createElement("div");
        views_uniques.className = "views_uniques";

        const urlElement = document.createElement("div");
        urlElement.className = "url";
        urlElement.textContent = item.url;

        const viewsElement = document.createElement("div");
        viewsElement.className = "views";
        if (item.views >= 1000) {
          viewsElement.textContent =
            item.views % 1000 === 0
              ? (item.views / 1000).toFixed(0) + "K"
              : (item.views / 1000).toFixed(1) + "K";
        } else {
          viewsElement.textContent = item.views;
        }

        const uniquesElement = document.createElement("div");
        uniquesElement.className = "uniques";
        if (item.uniques >= 1000) {
          uniquesElement.textContent =
            item.uniques % 1000 === 0
              ? (item.uniques / 1000).toFixed(0) + "K"
              : (item.uniques / 1000).toFixed(1) + "K";
        } else {
          uniquesElement.textContent = item.uniques;
        }

        const graphElement = document.createElement("div");
        graphElement.className = "graph";

        const graphFill = document.createElement("div");
        graphFill.className = "graph_fill";
        const fillPercentage = (item.uniques / item.views) * 100;
        graphFill.style.width = fillPercentage + "%";
        graphElement.appendChild(graphFill);

        const url_graph = document.createElement("div");
        url_graph.className = "url_graph";

        views_uniques.appendChild(viewsElement);
        views_uniques.appendChild(uniquesElement);

        url_graph.appendChild(urlElement);
        url_graph.appendChild(graphElement);

        content_box_item.appendChild(url_graph);
        content_box_item.appendChild(views_uniques);

        content_box.appendChild(content_box_item);
      });
    })
    .catch((error) => console.error("TOP CONTENT JSON LOADING ERROR", error));

  fetch("jsons/top_channels.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const channels_box_item = document.createElement("div");
        channels_box_item.className = "channels_box_item";

        const views_uniques = document.createElement("div");
        views_uniques.className = "views_uniques";

        const url_graph = document.createElement("div");
        url_graph.className = "url_graph";

        const urlElement = document.createElement("div");
        urlElement.className = "url";
        urlElement.textContent = item.url;

        const graycolor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--gray-color");

        const viewsElement = document.createElement("div");
        viewsElement.className = "views";
        if (item.views >= 1000) {
          viewsElement.textContent =
            item.views % 1000 === 0
              ? (item.views / 1000).toFixed(0) + "K"
              : (item.views / 1000).toFixed(1) + "K";
        } else {
          viewsElement.textContent = item.views;
        }

        const uniquesElement = document.createElement("div");
        uniquesElement.className = "uniques";
        if (item.uniques >= 1000) {
          uniquesElement.textContent =
            item.uniques % 1000 === 0
              ? (item.uniques / 1000).toFixed(0) + "K"
              : (item.uniques / 1000).toFixed(1) + "K";
        } else {
          uniquesElement.textContent = item.uniques;
        }

        const graphElement = document.createElement("div");
        graphElement.className = "graph";

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "30");

        const backgroundRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        backgroundRect.setAttribute("width", "100%");
        backgroundRect.setAttribute("height", "100%");
        backgroundRect.setAttribute("fill", "transparent");
        backgroundRect.setAttribute("border-radius", "5px");

        const fillRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        fillRect.setAttribute("width", `${(item.uniques / item.views) * 100}%`);
        fillRect.setAttribute("height", "100%");
        fillRect.setAttribute("fill", graycolor);
        fillRect.setAttribute("rx", "5");
        fillRect.setAttribute("ry", "5");

        svg.appendChild(backgroundRect);
        svg.appendChild(fillRect);

        graphElement.appendChild(svg);

        views_uniques.appendChild(viewsElement);
        views_uniques.appendChild(uniquesElement);

        url_graph.appendChild(urlElement);
        url_graph.appendChild(graphElement);

        channels_box_item.appendChild(url_graph);
        channels_box_item.appendChild(views_uniques);

        channels_box.appendChild(channels_box_item);
      });
    })
    .catch((error) => console.error("TOP CHANNELS JSON LOADING ERROR", error));

  fetch("jsons/top_cities_statistics.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const cities_box_item = document.createElement("div");
        cities_box_item.className = "cities_box_item";

        const city = document.createElement("div");
        city.className = "city";
        city.textContent = item.city;

        const percentage_container = document.createElement("div");
        percentage_container.className = "percentage_container";

        const percentage = document.createElement("div");
        percentage.className = "percentage";
        percentage.textContent = item.percentage + "%";

        const percentage_graph = document.createElement("div");
        percentage_graph.className = "percentage_graph";

        const percentage_graphFill = document.createElement("div");
        percentage_graphFill.className = "percentage_graph_fill";
        percentage_graphFill.style.width = item.percentage + "%";
        percentage_graphFill.appendChild(percentage);
        percentage_graph.appendChild(percentage_graphFill);

        cities_box_item.appendChild(city);
        cities_box_item.appendChild(percentage_graph);

        cities_box.appendChild(cities_box_item);
      });
    })
    .catch((error) => console.error("TOP CITIES JSON LOADING ERROR", error));
});
