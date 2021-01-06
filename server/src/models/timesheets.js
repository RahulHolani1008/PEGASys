const mongoose = require("mongoose");
const { Schema } = mongoose;

const timesheetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  deleted: { type: Boolean, default: false },
  reportDate: { type: Date, default: Date.now() },
  mentor: { type: Schema.Types.ObjectId, ref: "Users" },
  sheets: [{
    timeSpent: { type: Number, default: 0 },
    description: {type: String, required: true},
  }],
  project: { type: Schema.Types.ObjectId, ref: "Projects" },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
});

module.exports = mongoose.model("TimeSheets", timesheetSchema);
