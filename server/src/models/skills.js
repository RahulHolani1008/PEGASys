const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillSchema = new Schema({
  name: { type: String, required: true },
//  type: {type: String, required: true},
 department: { type: Schema.Types.ObjectId, ref: "SkillDepartments" },
});

module.exports = mongoose.model("Skills", skillSchema);
