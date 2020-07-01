const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html', {message: `Router include`, appname : `WebApp`});
})

router.get('/form', (req, res) => {
    res.render('index.html', {message: `Form include`, appname: `WebApp | Form`});
})

module.exports = router;