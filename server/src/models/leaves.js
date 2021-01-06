const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaveSchema = new Schema({
  to: { default: Date.now(), type: Date },
  from: { default: Date.now(), type: Date },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  approved: { default: false, type: Boolean }
});

module.exports = mongoose.model("Leaves", leaveSchema);
