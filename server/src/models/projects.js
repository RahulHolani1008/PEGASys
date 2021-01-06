const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: "Clients" },
  POC: { type: Schema.Types.ObjectId, ref: "Users" },
  lead: { type: Schema.Types.ObjectId, ref: "Users" },
  deleted: { type: Boolean, default: false },
  dates: {
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: null },
  },
});

module.exports = mongoose.model("Projects", projectSchema);
