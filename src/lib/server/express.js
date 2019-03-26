
import FrontLess from '../frontless';

/**
 * FrontLess express middleware.
 * Provides methods for parsing frontless HTTP requests and valid responces
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - express callback
 */
export async function FrontLessMidleware(req, res, next) {
  next();
};

export default (expressApp) => {
  expressApp.MESSAGE = FrontLess.MESSAGE;
  expressApp.PARSE = FrontLess.PARSE;
  expressApp.UPDATE = FrontLess.UPDATE;
  expressApp.use(FrontLessMidleware);
};
