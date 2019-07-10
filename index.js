// TODO
// ✅ make cluster size variable
// # get better placing of clusters
// # put labels on clusters

// Constants
// where N is an integer
// cluster_treatment_N
// treatment_N

const w = 960,
  h = 500,
  circleRadius = 4,
  spaceBetweenClusters = 150,
  numberOfClusters = 6,
  numberInCluster = 50,
  numberOfTreatments = 2,
  spaceBetweenCircleEdges = 2,
  clusterSizeLowerLimit = 20,
  clusterSizeUpperLimit = 100;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const getCanvasMidpoint = () => w / 2;

const getNearestUpperSquare = x => Math.pow(Math.ceil(Math.sqrt(x)), 2);

const getRowLength = x => Math.sqrt(getNearestUpperSquare(x));

const getDistanceBetweenCircleCentres = () =>
  2 * circleRadius + spaceBetweenCircleEdges;

const placeOnGrid = obj => {
  var spaceBetweenCircleCenters = getDistanceBetweenCircleCentres();
  obj
    .attr("cx", thing => {
      thing.x =
        (thing.order % getRowLength(clusterSizes[thing.cluster])) *
          spaceBetweenCircleCenters +
        circleRadius +
        thing.cluster * spaceBetweenClusters;
      return thing.x;
    })
    .attr("cy", thing => {
      thing.y =
        Math.floor(thing.order / getRowLength(clusterSizes[thing.cluster])) *
          spaceBetweenCircleCenters +
        circleRadius;
      return thing.y;
    });
};

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

const placeByTreatment = (className, xStart, yStart) => {
  var treatmentGroup = d3.selectAll(className);
  size = treatmentGroup.size();
  rowLength = getRowLength(size);
  spaceBetweenCircleCenters = getDistanceBetweenCircleCentres();
  // place text on the page

  treatmentGroup.each(function(_item, index) {
    d3.select(this)
      // .style("fill", "black")
      .transition()
      .duration(1500)
      .attr("cx", thing => {
        thing.x =
          xStart +
          (index % rowLength) * spaceBetweenCircleCenters +
          circleRadius;
        return thing.x;
      })
      .attr("cy", thing => {
        thing.y =
          yStart +
          Math.floor(index / rowLength) * spaceBetweenCircleCenters +
          circleRadius;
        return thing.y;
      });
  });
};

const randomlyAssign = () => {
  // remove all treatment classes
  d3.range(numberOfTreatments).map((_obj, index) => {
    d3.selectAll("circle").classed("treatment_" + index, false);
  });

  d3.selectAll("circle").attr(
    "class",
    d =>
      "cluster_treatment_" +
      clusterAllocations[d.cluster] +
      " " +
      "treatment_" +
      getRandomInt(numberOfTreatments)
  );

  d3.range(numberOfTreatments).map((_obj, index) => {
    placeByTreatment(".treatment_" + index, 100 + index * 200, 200);
  });
};

const placeOnGridTransition = obj => {
  var rowLength = getRowLength(numberInCluster);
  var spaceBetweenCircleCenters = getDistanceBetweenCircleCentres();

  obj
    .transition()
    .duration(1500)
    .attr("cx", thing => {
      thing.x =
        (thing.order % rowLength) * spaceBetweenCircleCenters +
        circleRadius +
        thing.cluster * spaceBetweenClusters;
      return thing.x;
    })
    .attr("cy", thing => {
      thing.y =
        Math.floor(thing.order / rowLength) * spaceBetweenCircleCenters +
        circleRadius;
      return thing.y;
    });
};

const reset = () => {
  placeOnGridTransition(circles);
};

const assignByCluster = () => {
  new_allocations = Array(numberOfClusters)
    .fill(0)
    .map(() => getRandomInt(numberOfTreatments));

  // remove all cluster classes
  d3.range(numberOfTreatments).map((_obj, index) => {
    d3.selectAll("circle").classed("cluster_treatment_" + index, false);
  });

  // assign new cluster classes
  d3.selectAll("circle").attr(
    "class",
    d =>
      "cluster_treatment_" +
      new_allocations[d.cluster] +
      " " +
      "treatment_" +
      d.treatment
  );

  // get width of blocks
  clusterSizes = d3.range(numberOfTreatments).map((_obj, index) => {
    placeByTreatment(".cluster_treatment_" + index, 100 + index * 200, 200);
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
      "treatment_" +
      d.treatment
  );

placeOnGrid(circles);

// TODO: avoid globals
// how do we determine power for CRCT?
