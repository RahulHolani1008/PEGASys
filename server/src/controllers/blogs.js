const Blog = require("../models/blogs");
const Comment = require("../models/comments");

exports.addBlog = async (req, res, next) => {
  const newBlog = new Blog(req.body);
  await newBlog
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllBlogs = async (req, res, next) => {
  await Blog.find({ deleted: false })
    .sort({ createdDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllDeletedBlogs = async (req, res, next) => {
  await Blog.find({ deleted: true })
    .sort({ createdDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchBlogById = async (req, res, next) => {
  await Blog.find({ _id: req.params.id })
    .populate("createdBy", { firstName: 1, lastName: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "commentBy",
        select: { firstName: 1, lastName: 1 },
      },
    })
    .then(async (blog) => {
      res.send(blog);
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteBlog = async (req, res, next) => {
  await Blog.findOneAndUpdate({ _id: req.body.id }, { deleted: true })
    .then((item) => res.send({ _id: item._id, deleted: true }))
    .catch((err) => res.status(400).send(err));
};

exports.updateBlog = async (req, res, next) => {
  await Blog.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((item) => res.send(req.body))
    .catch((err) => res.status(400).send(err));
};

exports.addComment = async (req, res, next) => {
  const newComment = new Comment({
    comment: req.body.comment,
    commentBy: req.body.commentBy,
  });
  await newComment
    .save()
    .then(async (item) => {
      await await Blog.updateOne(
        { _id: req.params.id },
        {
          $push: {
            comments: item._id,
          },
        }
      )
        .then((blog) => res.send(blog))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteComment = async (req, res, next) => {
  await Blog.updateOne(
    { _id: req.params.id },
    {
      $pullAll: { comments: req.body.commentIds },
    }
  )
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};
