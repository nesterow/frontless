import validate from 'validate.js'
import {UserModel} from './login.validate'

const Model = {
    ...UserModel,
    agree: {
        presence: {
            message: '^Before signing up you have to agree with our terms an conditions',
        },
    },
}

export default (data) => validate(data, Model);