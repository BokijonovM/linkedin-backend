export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    console.log("I am the bad request handler", err);
    res.status(400).send({ message: err.message, errorsList: err.errorsList });
  } else {
    next(err);
  }
};

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    console.log("I am the unauthorized handler", err);
    res.status(401).send({ message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    console.log("I am the not found handler", err);
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log("I am the error handler here is the error: ", err);
  res.status(500).send({ message: "Generic Server Error!" });
};
