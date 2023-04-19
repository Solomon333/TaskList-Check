const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const newItems = [];
const workItems = [];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    const day = date.getDate();
  
  res.render("list", { listTitle: day, newListItems: newItems });
});

app.post("/", function (req, res) {
  const item = req.body.newList;

 if (req.body.list === "Work") {
     workItems.push(item);
     res.redirect("/work");
 } else{
    newItems.push(item);
     res.redirect("/");
 }

});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.post("/work", function(req, res) {
    const item = req.body.newList;
    workItems.push(item);
    res.redirect("/");
})

app.get("/about", function(req, res) {
    res.render("about")
})

app.listen(3000, function () {
  console.log("Server Started On Port 3000");
});
