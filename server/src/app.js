const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const {
    connectDB
} = require("./utils/database");

const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blogs");
const departmentRoutes = require("./routes/departments");
const timeSheetRoutes = require("./routes/timesheets");
const skillRoutes = require("./routes/skills");
const skillRatingRoutes = require("./routes/skillRatings");
const eventRoutes = require("./routes/events");
const skillDepartmentRoutes = require("./routes/skillDepartments");
const clientRoutes = require("./routes/clients");
const leaveRoutes = require("./routes/leaves");

connectDB();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(compression());
app.use(helmet());

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/blogs", blogRoutes);
app.use("/departments", departmentRoutes);
app.use("/timesheets", timeSheetRoutes);
app.use("/skills", skillRoutes);
app.use("/skillRatings", skillRatingRoutes);
app.use("/events", eventRoutes);
app.use("/skillDepartments", skillDepartmentRoutes);
app.use("/clients", clientRoutes);
app.use("/leaves", leaveRoutes);
app.listen(8081);