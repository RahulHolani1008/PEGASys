const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: { required: true, type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
  deleted: { type: Boolean, default: false },
  blogImageURL: { required: false, type: String },
  createdDate: { default: Date.now(), type: Date },
  data: { required: true, type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
});

module.exports = mongoose.model("Blogs", blogSchema);
