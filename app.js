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
      const item = new Item({
        name: itemName,
      })

      item.save();

      res.redirect("/");

//  if (req.body.list === "Work") {
//      workItems.push(item);
//      res.redirect("/work");
//  } else{
//     newItems.push(item);
//      res.redirect("/");
//  }

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


app.get("/:costumListName", function(req, res) {
    const costumListName = req.params.costumListName;
    
    const listSchema = {
      name: String,
      items: [{listSchema}]
    }
    
    const List = mongoose.model("list", listSchema);

    

    // res.render("list", {listTitle: "Work List", newListItems: workItems});
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
