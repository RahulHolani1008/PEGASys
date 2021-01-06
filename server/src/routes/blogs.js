const express = require("express");
const blogsController = require("../controllers/blogs");
const router = express.Router();

router.get("/all", blogsController.fetchAllBlogs);
router.get("/:id", blogsController.fetchBlogById);
router.get("/all/deleted", blogsController.fetchAllDeletedBlogs);
router.post("/addBlog", blogsController.addBlog);
router.delete("/deleteBlog", blogsController.deleteBlog);
router.post("/addComment/:id", blogsController.addComment);
router.delete("/deleteComment/:id", blogsController.deleteComment);
router.put("/updateBlog/:id", blogsController.updateBlog);

module.exports = router;
