const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  departments: [{ type: Schema.Types.ObjectId, ref: "Departments" }],
  deleted: { type: Boolean, default: false },
  profileImageURL: { required: false, type: String },
  userType: { type: String, default: "user" },
  description: { type: String, required: false },
  dates: {
    createdDate: { default: new Date(new Date().setHours(18, 00, 00)), type: Date },
    dateOfJoin: { default: new Date(new Date().setHours(18, 00, 00)), type: Date },
    birthDate: { default: null, type: Date },
  },
  URLs: {
    linkedIn: {  default: null, required: false, type: String },
    facebook: {  default: null, required: false, type: String },
    upwork: {  default: null, required: false, type: String },
    github: {  default: null, required: false, type: String },
    skype: {  default: null, required: false, type: String },
  },
  emails: {
    genesis: { required: true, type: String },
    google: { required: true, type: String },
  },
  password: {default: "Welcome@123", type: String},
  mentor: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  leaveBalance: {type: Number, default: 5}
});

// userSchema.methods.toJSON = function() {
//   var obj = this.toObject();
//   delete obj.password;
//   return obj;
//  }

module.exports = mongoose.model("Users", userSchema);
