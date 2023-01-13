const mongoose = require('mongoose')

const projeto1 = mongoose.model('projeto1', {
    id: Number,
    name: String,
    category: String,
    status: String,
    quantity: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
})

export default projeto1