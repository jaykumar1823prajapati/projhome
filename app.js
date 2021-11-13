const express=require("express"),bodyParser=require("body-parser"),mongoose=require("mongoose"),_=require("lodash");mongoose.connect("mongodb+srv://<yourUserName>:<pass>@cluster0.zkxxg.mongodb.net/todolistDB",{useNewUrlParser:!0,useUnifiedTopology:!0});const app=express();app.set("view engine","load"),app.use(bodyParser.urlencoded({extended:!0})),app.use(express.static("public"));const itemSchema={name:String},Item=mongoose.model("Item",itemSchema),item1=new Item({name:"Example 1"}),item2=new Item({name:"Example 2"}),item3=new Item({name:"Example 3"}),defaultItems=[item1,item2,item3],listSchema={name:String,items:[itemSchema]},List=mongoose.model("List",listSchema);app.get("/",(function(e,t){Item.find({},(function(e,n){0===n.length?(Item.insertMany(defaultItems,(function(e){e?console.log(e):console.log("inserted")})),t.redirect("/")):t.render("list",{listTitle:"Today",newListItems:n})}))})),app.post("/",(function(e,t){const n=e.body.newItem,s=e.body.list,o=new Item({name:n});"Today"===s?(o.save(),t.redirect("/")):List.findOne({name:s},(function(e,n){n.items.push(o),n.save(),t.redirect("/"+s)}))})),app.post("/delete",(function(e,t){const n=e.body.checkbox,s=e.body.listName;"Today"===s?Item.findByIdAndRemove(n,(function(e){e?console.log(e):t.redirect("/")})):List.findOneAndUpdate({name:s},{$pull:{items:{_id:n}}},(function(e,n){e||t.redirect("/"+s)}))})),app.get("/:listName",(function(e,t){const n=_.capitalize(e.params.listName);List.findOne({name:n},(function(e,s){if(!e)if(s)t.render("list",{listTitle:s.name,newListItems:s.items});else{new List({name:n,items:defaultItems}).save(),t.redirect("/"+n)}}))}));let port=process.env.PORT;null!=port&&""!=port||(port=3e3),app.listen(port,(function(){console.log("server has started")}));