const isArrayInPolygonFormat = (arr) => {
  if (!Array.isArray(arr)) {
    return false;
  }

  if (arr.length !== 1) {
    return false;
  }

  const innerArr = arr[0];
  if (!Array.isArray(innerArr)) {
    return false;
  }

  for (const point of innerArr) {
    if (!Array.isArray(point) || point.length !== 2) {
      return false;
    }
    const [x, y] = point;
    if (typeof x !== "number" || typeof y !== "number") {
      return false;
    }
  }

  return true;
};

const validateZoneData = (req) => {
  if (Number(req.body.size) <= 0) {
    throw new Error("Size must be greater than 0");
  }

  if (!isArrayInPolygonFormat(req.body.points)) {
    throw new Error("Points are not in polygon format");
  }

  console.log("Zone data is valid");
};

module.exports = { isArrayInPolygonFormat, validateZoneData };
