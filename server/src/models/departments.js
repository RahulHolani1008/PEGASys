const mongoose = require("mongoose");
const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, required: true },
  manager: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Departments", departmentSchema);
