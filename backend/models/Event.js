const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  event: { type: String, required: true, index: true },
  meta: { type: Object, default: {} },
  sessionId: { type: String, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
})

// TTL index: auto-delete events older than 30 days
eventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 })

module.exports = mongoose.model('Event', eventSchema)
