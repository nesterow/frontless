import Debug from 'debug'
import bcrypt from 'bcryptjs'
import { get, omit } from 'lodash'

const debug = Debug('@feathersjs/authentication-local:verify');

const {MONGO_DATABASE} = process.env

class LocalVerifier {
  constructor (app, options = {}) {
    this.app = app;
    this.options = options;
    this._comparePassword = this._comparePassword.bind(this);
    this._normalizeResult = this._normalizeResult.bind(this);
    this.verify = this.verify.bind(this);
  }

  get users(){
    return this.app.mongo.db(MONGO_DATABASE).collection('users')
  }

  _comparePassword (entity, password) {
    // select entity password field - take entityPasswordField over passwordField
    const passwordField = this.options.entityPasswordField || this.options.passwordField;

    // find password in entity, this allows for dot notation
    const hash = get(entity, passwordField);

    if (!hash) {
      return Promise.reject(new Error(`'${this.options.entity}' record in the database is missing a '${passwordField}'`));
    }

    debug('Verifying password');

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (error, result) {
        // Handle 500 server error.
        if (error) {
          return reject(error);
        }

        if (!result) {
          debug('Password incorrect');
          return reject(false); // eslint-disable-line
        }

        debug('Password correct');
        return resolve(entity);
      });
    });
  }

  _normalizeResult (results) {
    // Paginated services return the array of results in the data attribute.
    let entities = results.data ? results.data : results;
    let entity = entities[0];

    // Handle bad username.
    if (!entity) {
      return Promise.reject(false); // eslint-disable-line
    }

    debug(`${this.options.entity} found`);
    return Promise.resolve(entity);
  }

  async verify (req, username, password, done) {
    debug('Checking credentials', username, password)

    const error = new Error('Invalid credentials')

    if (!this.users)
      return done(error, {}, { message: 'MongoDB connection error' })
    
    const user = await this.users.findOne({username,})
    if (!user)
      return done(error, {}, { message: 'Invalid login' })
    
    return await this._comparePassword(user, password).then(()=> {
      return done(null, true, {userId : user._id, username: user.username, sub: 'users'})
    }).
    catch((err) => {
      return done(error, {} , { message: 'Invalid credentials' })
    })

  }
}

export default LocalVerifier;
