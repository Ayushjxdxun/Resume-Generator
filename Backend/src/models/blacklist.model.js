const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token must be added to blacklist"]
    }
}, {
    timestamps: true
})

// Changed model name string to lowercase "blacklisttokens" to match MongoDB collections natively
const tokenBlacklistModel = mongoose.model("blacklisttokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel