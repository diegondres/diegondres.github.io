module.exports = (req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     res.setHeader('Access-Control-Allow-Credentials', 'true');
     res.setHeader('Access-Control-Expose-Headers', 'Authorization');
     next();
 };