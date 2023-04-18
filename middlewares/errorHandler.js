import HttpException from "../utils/errorResponse.js";

const ErrorHandler = (err, _req, res) => {
  console.log("ERROR HANDLER CALLED")
  let errors = [];

  // API Not Found
  if (err.message === "Not Found") {
    err = new HttpException(404, "Not Found");
  }

  // API Not Found
  if (err.name === "CastError") {
    errors.push(`${err.reason}`);
    err = new HttpException(400, "Invalid Id", errors);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const object = Object.keys(err.keyValue);
    const error = `${object[0]} ${err.keyValue[object[0]]} is already Exists`;
    errors.push(error);
    err = new HttpException(409, "Already Exist!", errors);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    // console.log("ValidationError", err)

    Object.values(err.errors).map((obj) => {
      // console.log(obj)
      if (obj.kind === "Number" || obj.kind === "Number") {
        errors.push(`${obj.path} must be ${obj.kind}`);
      }
      if (obj.kind === "ObjectId") {
        errors.push(
          `${obj.value} is not a valid value for the ${obj.path} field`
        );
      }
      if (obj.kind === "required") {
        errors.push(obj.message);
      }
      if (obj.kind === "enum") {
        errors.push(`${obj.value} is not a valid value for ${obj.path}`);
      }
      if (obj.kind === "minlength" || obj.kind === "maxlength") {
        errors.push(obj.message);
      }
    });
    err = new HttpException(403, "Invalid body!", errors);
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Server Error",
    errors: err.errors || [],
  });
};
export default ErrorHandler;
