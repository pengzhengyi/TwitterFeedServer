const { body, query, validationResult } = require("express-validator");
const { STREAMING_START_USE_CONTROL_LOCK, STREAMING_START_CONTROL_LOCK, STREAMING_STOP_USE_CONTROL_LOCK, STREAMING_STOP_CONTROL_LOCK, STREAMING_STOPALL_USE_CONTROL_LOCK, STREAMING_STOPALL_CONTROL_LOCK } = require("../util/secrets.js");


const queryValidationMiddleware = query("q").exists().withMessage("query is required").bail().isString().withMessage("query should be a string").bail().notEmpty().withMessage("query should not be an empty string");
const sizeValidationMiddleware = query("size").optional().isInt({ min: 1 }).withMessage("size should be an positive integer").bail().toInt();
const hasStreamingLockMiddleware = body("lock").custom((value, { req }) => {
    const path = req.path;
    let useLock;
    let lockValue;
    switch (path) {
      case "/streaming/start":
        useLock = STREAMING_START_USE_CONTROL_LOCK;
        lockValue = STREAMING_START_CONTROL_LOCK;
        break;
      case "/streaming/stop":
        useLock = STREAMING_STOP_USE_CONTROL_LOCK;
        lockValue = STREAMING_STOP_CONTROL_LOCK;
        break;
      case "/streaming/stopAll":
        useLock = STREAMING_STOPALL_USE_CONTROL_LOCK;
        lockValue = STREAMING_STOPALL_CONTROL_LOCK;
        break;
      default:
        throw new Error("Not recognized streaming route");
    }

    if (!useLock) {
      return true;
    }

    if (!value) {
      throw new Error("lock field is required in data");
    }

    if (value !== lockValue) {
      throw new Error("Not matching streaming lock value");
    }

    return true;
});

function validationErrorHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return false;
    }
  return true;
}

module.exports = {
  queryValidationMiddleware,
  sizeValidationMiddleware,
  hasStreamingLockMiddleware,
  validationErrorHandler
};
