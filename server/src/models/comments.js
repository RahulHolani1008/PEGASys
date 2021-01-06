const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  comment: { required: false, type: String },
  commentDate: { default: Date.now(), type: Date },
  commentBy: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Comments", commentSchema);
