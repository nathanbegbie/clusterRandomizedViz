// TODO
// ✅ make cluster size variable
// # get better placing of clusters
// # put labels on clusters
// avoid globals
// how do we determine power for CRCT?

// Constants
// where N is an integer
// cluster_treatment_N
// treatment_N

const w = 1200,
  h = 500,
  circleRadius = 4,
  spaceBetweenClusters = 150,
  numberOfClusters = 8,
  numberInCluster = 50,
  numberOfTreatments = 2,
  spaceBetweenCircleEdges = 2,
  clusterSizeLowerLimit = 20,
  clusterSizeUpperLimit = 100,
  clusterClassPrefix = "cluster_",
  clusterTreatmentClassPrefix = "cluster_treatment_",
  treatmentClassPrefix = "treatment_";

const getCanvasMidpoint = () => w / 2;

const getNearestUpperSquare = x => Math.pow(Math.ceil(Math.sqrt(x)), 2);

const getRowLength = x => Math.sqrt(getNearestUpperSquare(x));

const getDistanceBetweenCircleCentres = () =>
  2 * circleRadius + spaceBetweenCircleEdges;

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

const getRandomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// randomly assign clusters to treatments
// index is group id
// value at index is the cluster allocated to that group
const clusterAllocations = Array(numberOfClusters)
  .fill(0)
  .map(() => getRandomInt(numberOfTreatments));

// randomly assign ___ to ___
const getClusterSizes = (
  _numberOfClusters,
  _clusterSizeLowerLimit,
  _clusterSizeUpperLimit
) =>
  d3
    .range(_numberOfClusters)
    .map(() =>
      getRandomIntFromInterval(_clusterSizeLowerLimit, _clusterSizeUpperLimit)
    );

const createClusterData = clusterSizes =>
  clusterSizes
    .map((clusterSize, outerIndex) =>
      d3.range(clusterSize).map((_obj2, innerIndex) => ({
        cluster: outerIndex,
        order: innerIndex,
        treatment: getRandomInt(numberOfTreatments),
        x: 0,
        y: 0,
        dx: Math.random() - 0.5,
        dy: Math.random() - 0.5
      }))
    )
    .flat();

const randomlyAssign = () => {
  // remove all treatment classes
  d3.range(numberOfTreatments).map((_obj, index) => {
    d3.selectAll("circle").classed(treatmentClassPrefix + index, false);
  });

  d3.selectAll("circle").attr(
    "class",
    d =>
      clusterTreatmentClassPrefix +
      clusterAllocations[d.cluster] +
      " " +
      treatmentClassPrefix +
      getRandomInt(numberOfTreatments) +
      " " +
      clusterClassPrefix +
      d.cluster
  );

  d3.selectAll(".counter").remove();

  d3.range(numberOfTreatments).map((_obj, index) => {
    placeCluster(
      d3.selectAll("." + treatmentClassPrefix + index),
      (shouldTransition = true),
      (xStart = 100 + index * 200),
      (yStart = 200),
      (text = "treatment")
    );
  });
};

const placeCluster = (
  obj,
  shouldTransition = true,
  xStart = 0,
  yStart = 0,
  text = false
) => {
  var clusterSize = obj.size(),
    rowLength = getRowLength(clusterSize),
    spaceBetweenCircleCenters = getDistanceBetweenCircleCentres();

  var textHeight = text ? 20 : 0;

  if (text) {
    svg
      .append("text")
      .attr("class", "counter")
      .attr("x", xStart)
      .attr("y", yStart)
      .style("font-size", "15px")
      .text(text + ": " + clusterSize);
  }

  obj.each(function(_item, index) {
    d3.select(this)
      .transition()
      .duration(shouldTransition ? 1500 : 0)
      .attr("cx", thing => {
        thing.x =
          xStart +
          (index % rowLength) * spaceBetweenCircleCenters +
          circleRadius;
        return thing.x;
      })
      .attr("cy", thing => {
        thing.y =
          textHeight +
          yStart +
          Math.floor(index / rowLength) * spaceBetweenCircleCenters +
          circleRadius;
        return thing.y;
      });
  });
};

const reset = (shouldTransition = true) => {
  d3.selectAll(".counter").remove();

  d3.range(numberOfClusters).map((_obj, index) => {
    // console.log(clusterClassPrefix + index)
    var cluster = d3.selectAll("." + clusterClassPrefix + index);

    placeCluster(
      cluster,
      (shouldTransition = shouldTransition),
      (xStart = index * 150),
      (yStart = 10),
      (text = "Cluster")
    );
  });
};

const assignByCluster = () => {
  new_allocations = Array(numberOfClusters)
    .fill(0)
    .map(() => getRandomInt(numberOfTreatments));

  // remove all cluster classes
  d3.range(numberOfTreatments).map((_obj, index) => {
    d3.selectAll("circle").classed(clusterTreatmentClassPrefix + index, false);
  });

  // assign new cluster classes
  d3.selectAll("circle").attr(
    "class",
    d =>
      clusterTreatmentClassPrefix +
      new_allocations[d.cluster] +
      " " +
      treatmentClassPrefix +
      d.treatment +
      " " +
      clusterClassPrefix +
      d.cluster
  );

  d3.selectAll(".counter").remove();

  // get width of blocks
  d3.range(numberOfTreatments).map((_obj, index) => {
    placeCluster(
      d3.selectAll("." + clusterTreatmentClassPrefix + index),
      (shouldTransition = true),
      (xStart = 100 + index * 200),
      (yStart = 200),
      (text = "treatment")
    );
  });
};

const getBlockWidth = numberOfItems =>
  getRowLength(numberOfItems) * (circleRadius * 2) +
  spaceBetweenCircleEdges * (getRowLength(numberOfItems) - 1);

// EXECUTION
const clusterSizes = getClusterSizes(
  numberOfClusters,
  numberOfClusters,
  clusterSizeUpperLimit
);
const clusterData = createClusterData(clusterSizes);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

circles = svg
  .selectAll("circle")
  .data(clusterData)
  .enter()
  .append("circle")
  .attr("r", circleRadius)
  .style("fill", d => d3.schemeCategory10[d.cluster])
  .attr(
    "class",
    d =>
      "cluster_treatment_" +
      clusterAllocations[d.cluster] +
      " " +
      treatmentClassPrefix +
      d.treatment +
      " " +
      clusterClassPrefix +
      d.cluster
  );

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const say = text => {
  svg
    .append("text")
    .attr("class", "header")
    .attr("x", 50)
    .attr("y", 100)
    .style("font-size", "30px")
    .text(text);
};

async function demo() {
  reset((shouldTransition = false));
  await sleep(2000);

  // Sleep in loop
  for (let i = 0; i < 3; i++) {
    say("Random Allocation - Iteration " + (i + 1));
    randomlyAssign();
    await sleep(2000);
    d3.select(".header").remove();
  }

  reset();
  await sleep(2000);

  for (let i = 0; i < 3; i++) {
    say("Cluster Random Allocation - Iteration " + (i + 1));
    assignByCluster();
    await sleep(2000);
    d3.select(".header").remove();
  }

  reset();
}

demo();
demo();
