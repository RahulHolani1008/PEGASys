const mongoose = require("mongoose");
const { Schema } = mongoose;

const holidaySchema = new Schema({
  to: { default: Date.now(), type: Date },
  from: { default: Date.now(), type: Date },
  type: { default: "Festival", type: String }
});

module.exports = mongoose.model("Leaves", holidaySchema);