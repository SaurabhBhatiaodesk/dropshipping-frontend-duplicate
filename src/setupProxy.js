
const { createProxyMiddleware } = require('http-proxy-middleware');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

module.exports = function (app) {
  app.use(
    '/api', // specify the path you want to proxy
    createProxyMiddleware({
      // target: 'http://localhost:4000', // specify the backend server's address 
      target: API_BASE_URL, // specify the backend server's address 
      changeOrigin: true, // change the origin of the request
    })
  );
};
