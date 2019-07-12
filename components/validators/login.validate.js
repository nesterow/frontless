
import validate from 'validate.js'

const Model = {
    username: {
      presence: {
        message: '^Login is required',
      },
      length: {
        maximum: 12,
        minimum: 4,
        message: '^Username must be from 6 to 12 symbols',
      },
    },
    password: {
      presence: {
        message: '^Password is required',
      },
      length: {
        minimum: 6,
        message: '^Minimum 6 symbols',
      },
    },
}

export const LoginModel = Model; 
export default (data) => validate(data, Model);
