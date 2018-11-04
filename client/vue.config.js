module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  outputDir: '../server/public',
  devServer: {
    proxy: 'http://localhost:3000'
  }
}