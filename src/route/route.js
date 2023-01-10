const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const middleware = require('../middleware/middleware')

router.post('/createUser', userController.createUser)

router.post('/loginUser', userController.loginUser)

router.get('/getStudent/:userId', middleware.authentication, middleware.authorisation, userController.getStudent)

router.put('/updateMarks/:userId', middleware.authentication, middleware.authorisation, userController.updateMarks)

router.delete('/deleteStudent/:userId', middleware.authentication, middleware.authorisation, userController.deleteStudent)

router.all('/*', function (req, res) {
    return res.status(400).send({ status: false, message: 'Path not found' })
})

module.exports = router