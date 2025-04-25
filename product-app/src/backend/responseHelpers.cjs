function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendBadRequest(res, message) {
  sendJsonResponse(res, 400, { message });
}

function sendNotFound(res, message) {
  sendJsonResponse(res, 404, { message });
}

function sendSuccess(res, data) {
  sendJsonResponse(res, 200, data);
}

module.exports = {
  sendJsonResponse,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
};
