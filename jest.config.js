

module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ['node_modules/(?!@react-bootstrap-icons)/'],
  moduleNameMapper: {
    "\\.(css|sass)$": "identity-obj-proxy",
  }
}