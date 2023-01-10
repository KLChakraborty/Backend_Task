const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const { isValidObjectId } = require('mongoose')

const authentication = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token) return res.status(401).send({ status: false, message: 'Token is not present' })

        jwt.verify(token, 'hellothere', function (error, decodedToken) {
            if (error && error.message === 'jwt expired') return res.status(401).send({ status: false, message: 'Jwt expired, please log in again' })
            else if (error) return res.status(401).send({ status: false, message: error.message })
            else {
                req.decodedToken = decodedToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        const decodedToken = req.decodedToken
        const userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(403).send({ status: false, message: 'Invalid userId' })
        let presentUser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!presentUser) return res.status(403).send({ status: false, message: 'No existing user' })
        if (presentUser._id.toString() !== decodedToken.userId) return res.status(403).send({ status: false, message: 'You do not have access rights' })
        req.userId = userId
        req.presentUser = presentUser
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication, authorisation }