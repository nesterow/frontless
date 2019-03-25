module.exports = {
  verbose: true,
  automock: false,
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.tag$': 'riot-jest-transformer',
  },
};
