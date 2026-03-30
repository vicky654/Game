const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true, maxlength: 1000, trim: true },
  createdAt: { type: Date, default: Date.now, index: true },
  read: { type: Boolean, default: false },
})

// TTL index: auto-delete messages older than 90 days
feedbackSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 })

module.exports = mongoose.model('Feedback', feedbackSchema)
