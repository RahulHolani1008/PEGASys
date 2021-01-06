const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventsSchema = new Schema({
  title: { type: String, required: true },
  date: {type: Date, default: Date.now() },
  description: { type: String, required: false },
  pictures: [{ type: String ,required: false}],
  postedBy: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Events", eventsSchema);
