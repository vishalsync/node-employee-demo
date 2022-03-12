// Third party packages
const { validationResult } = require("express-validator");

const dataValidityMiddleware = async (req, res, next) => {

    try {
        const validationError = validationResult(req);

        if(!validationError.isEmpty()) {
            throw validationError.array();
        }

        next();

    } catch(error) {
        next({
            statusCode: 422,
            error
        });
    }

}// End of dataValidityMiddleware


module.exports = dataValidityMiddleware;