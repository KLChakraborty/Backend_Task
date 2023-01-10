const requireInput = function (value) {
    return Object.keys(value).length > 0
}

const validString = function (value) {
    if (typeof value === 'undefined' || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const validNumber = function (value) {
    if (typeof value !== 'number') return false
    return true
}

const validName = function (value) {
    return value.match(/^[a-zA-Z ]+$/)
}

const validEmail = function (value) {
    return value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z-]+\.([a-zA-Z-.]{2,4})+$/)
}

const validPassword = function (value) {
    return value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/)
}

const validMarks = function (value) {
    return /^[0-9]\d{1}$/.test(value)
}

module.exports = { requireInput, validString, validName, validEmail, validPassword, validMarks, validNumber }