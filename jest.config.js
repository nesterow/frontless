module.exports = {
  verbose: true,
  automock: false,
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.tag.html$': 'riot-jest-transformer',
  },
};
