

module.exports = {
  preset: 'jest-preset-preact',
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ['node_modules/(?!@react-bootstrap-icons)/'],
  moduleNameMapper: {
    "\\.(css|sass)$": "identity-obj-proxy",
  }
}