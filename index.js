const express = require("express");
const multer = require("multer");
const fs = require("fs");
var mysql = require("mysql");
const path = require("path");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "demo"
});
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, (file.filename = file.originalname));
    }
});
const upload = multer({
    storage: storage
});
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
//to supported json and  coded bodies
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("./public/uploads"));
app.get("/", (req, res) => {
    res.render("index");
});
app.use(express.static(path.join(__dirname, "public")));
app.post("/upload", upload.single("file"), (req, res, next) => {
    console.log(req.file.filename);
    console.log(req.body.username);
    console.log(req.body.password);
    con.query(
        "insert into login(username,password,image) VALUES('" +
        req.body.username +
        "', '" +
        req.body.password +
        "', '" +
        req.file.filename +
        "')",
        function (err, result) {
            //console.log("record added");
            if (result) {
                con.query("select * from login", function (err, rows) {
                    res.render("list", {
                        data: rows
                    });
                });
            }
        }
    );

    //fs.writeFile("./new",req.file);
    //res.send("file uploaded");
});

app.listen(8008, function () {
    console.log("listening on port 8080");
});