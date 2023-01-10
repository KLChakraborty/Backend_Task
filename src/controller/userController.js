const userModel = require('../model/userModel')
const validator = require('../validator/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async function (req, res) {
    try {
        const { name, email, password, ...rest } = { ...req.body }
        if (!validator.requireInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })
        if (validator.requireInput(rest)) return res.status(400).send({ status: false, message: 'Extra information is not allowed' })

        if (!validator.validString(name)) return res.status(400).send({ status: false, message: 'Name is not present or invalid' })
        if (!validator.validName(name)) return res.status(400).send({ status: false, message: 'Name is not valid' })

        if (!validator.validString(email)) return res.status(400).send({ status: false, message: 'Email is not present or invalid' })
        if (!validator.validEmail(email)) return res.status(400).send({ status: false, message: 'Email is not valid' })
        let presentEmail = await userModel.findOne({ email })
        if (presentEmail) return res.status(400).send({ status: false, message: 'Email is already present' })

        if (!validator.validString(password)) return res.status(400).send({ status: false, message: 'Password is not present or invalid' })
        if (!validator.validPassword(password)) return res.status(400).send({ status: false, message: 'Password is not valid' })
        let saltRound = 10
        let hashedPassword = await bcrypt.hash(password, saltRound)

        await userModel.create({ email: email, password: hashedPassword, name: name })
        return res.status(201).send({ status: true, message: 'Success', data: { email: email, password: password, name: name } })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const loginUser = async function (req, res) {
    try {
        const { email, password, ...rest } = { ...req.body }
        if (!validator.requireInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })
        if (validator.requireInput(rest)) return res.status(400).send({ status: false, message: 'Extra information is not allowed' })

        if (!validator.validString(email)) return res.status(400).send({ status: false, message: 'Email is not present' })

        if (!validator.validString(password)) return res.status(400).send({ status: false, message: 'Password is not present' })

        let presentUser = await userModel.findOne({ email })
        if (!presentUser) return res.status(401).send({ status: false, message: 'Invalid email' })

        let comparePassword = await bcrypt.compare(password, presentUser.password)
        if (!comparePassword) return res.status(401).send({ status: false, message: 'Invalid password' })

        const encodedToken = jwt.sign({ userId: presentUser._id, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, 'hellothere')
        return res.status(200).send({ status: true, data: encodedToken })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getStudent = async function (req, res) {
    try {
        const presentUser = req.presentUser
        const obj = {
            subject: presentUser.subject,
            marks: presentUser.marks
        }
        return res.status(200).send({ status: true, data: obj })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const updateMarks = async function (req, res) {
    try {
        const userId = req.userId
        const presentUser = req.presentUser

        let { marks, ...rest } = { ...req.body }

        if (!validator.requireInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })
        if (validator.requireInput(rest)) return res.status(400).send({ status: false, message: 'Extra information is not allowed' })

        if (!validator.validNumber(marks)) return res.status(400).send({ status: false, message: 'Marks should be number' })
        if (!validator.validMarks(marks)) return res.status(400).send({ status: false, message: 'Marks is not valid' })

        marks = presentUser.marks + marks

        let updatedMarks = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { marks: marks } }, { new: true })
        let obj = {
            subject: updatedMarks.subject,
            marks: updatedMarks.marks
        }
        return res.status(200).send({ status: true, data: obj })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteStudent = async function (req, res) {
    try {
        const userId = req.userId
        await userModel.findByIdAndUpdate(userId, { $set: { isDeleted: true } })
        return res.status(200).send({ status: true, message: 'Deleted Successfully' })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser, loginUser, getStudent, updateMarks, deleteStudent }