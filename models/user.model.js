const userSchema = require('../database/schema/user.schema')
module.exports.create = user => {
    return userSchema.create(user)
}
module.exports.findById = id => {
    return userSchema.findById(id)
}

module.exports.findOne = info => {
    return userSchema.findOne(info)
}

module.exports.countUsers = username => {
    return userSchema.countDocuments({username})
}
