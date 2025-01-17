export default function errorHandler(e, req, res, next) {
    console.log(e, e.name)
    if (e.name === 'CastError') {

      res.status(400).send({ message: "The ID you provided was not valid. Please provide a valid ID!" })
    } else if (e.name === 'SyntaxError') {

      res.status(422).send({ message: "Invalid JSON in your request body." })
    } else if (e.name === 'ValidationError') {
      res.status(422).send({ message: "Invalid data. Please check your input and try again." })
    } else {

      res.status(500).send({ message: "Something went wrong. Please check your request and try again!" })
    }
  }