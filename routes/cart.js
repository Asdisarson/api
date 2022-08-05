var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    const auth = {login: 'username', password: 'yourpassword'} // change this

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
})/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body)
    res.send('respond with a resource');
});
router.post('/', function(req, res, next) {

    res.send('respond with a resource');
});

module.exports = router;
