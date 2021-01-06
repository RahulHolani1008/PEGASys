const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillRatingSchema = new Schema({
  to: { type: Schema.Types.ObjectId, ref: "Users" },
  from: { type: Schema.Types.ObjectId, ref: "Users" },
  rating: { type: Number, default: 5 },
  role: { type: String, default: "peer" },
  skill: { type: Schema.Types.ObjectId, ref: "Skills" },
});

module.exports = mongoose.model("SkillRating", skillRatingSchema);
