const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
const newItems = [];
const workItems = [];


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

const itemsSchema = {
  name: String
}

const Item = mongoose.model("item", itemsSchema);

const task1 = new Item ({
  name: "Task 1",
});

const task2 = new Item ({
  name: "Task 2",
});

const task3 = new Item ({
  name: "Task 3",
});

const deafultTasks = [task1, task2, task3];

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List  = mongoose.model("List",listSchema )

app.get("/", function (req, res) {
  const day = date.getDate();
  
  Item.find({})
  .then(function(foundItems){
    if(foundItems.length === 0) {
      
      Item.insertMany(deafultTasks)
          .then(function(){
          console.log("successfully inserted deafultTask!")
        }).catch(function(err){
          console.log(err)
        });
        res.redirect("/");
    }else {
      
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  }).catch(function(err){
    console.log(err)
  });
    
  });
  

app.post("/", function (req, res) {
  const itemName = req.body.newList;
  const listName = req.body.list;

      const item = new Item({
        name: itemName,
      })
    if(listName === "Today"){

      item.save();
      res.redirect("/");
    }else {
      List.findOne({name: listName}) 
        .then(function(foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req,res) {
  const checkedItemId = req.body.checkbox;

  const item = Item.findByIdAndRemove(checkedItemId)
  .then(function(){
    console.log("item removed")
  }).catch(function(err){
    console.log(err)
  })
  res.redirect("/");
})

app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName ;

  List.findOne({name: customListName}).then(foundList => {
    if(foundList) {
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items
      })
    }else {
      
      const list = new List({
        name: customListName,
        items: deafultTasks
      })
      list.save();
     res.redirect("/" + customListName);
    }
  }).catch(err => console.log(err.body));
  
});




app.get("/about", function(req, res) {
    res.render("about")
})

app.listen(3000, function () {
  console.log("Server Started On Port 3000");
});
