const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  token: {type:String, required: true},
});

module.exports = mongoose.model("Tokens", tokenSchema);
