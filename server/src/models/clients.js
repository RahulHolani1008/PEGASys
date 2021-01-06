const mongoose = require("mongoose");
const { Schema } = mongoose;

const clientSchema = new Schema({
  name: { required: true, type: String },
  deleted: { type: Boolean, default: false },
  since: { default: Date.now(), type: Date }
});

module.exports = mongoose.model("Clients", clientSchema);