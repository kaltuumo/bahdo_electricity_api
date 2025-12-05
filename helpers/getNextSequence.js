
// helpers/getNextSequence.js
const Counter = require('../models/counterModels');

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }  // upsert: create if not exists
  );
  return counter.seq;
}

module.exports = getNextSequence;