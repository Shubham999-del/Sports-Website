const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const request=require("request");
const mongoose=require("mongoose");


app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');


 //-------------connecting our mongoDB database to our server----------//
mongoose.connect("mongodb+srv://admin-shubham:Shubham123@cluster0-s6tok.mongodb.net/accountDB",{
  useNewUrlParser:true,
  useUnifiedTopology: true
});


//------------creating a comment collection schema to store the comments of the students--------------//
const comment_schema= new mongoose.Schema({
  Name:String,
  Email:String,
  Comment:String
});
//--------declaring the instance of that collection schema-------------//
const Comment = mongoose.model("comment",comment_schema);

//---------------creating the student collection schema to store the data of all the students of our college------//
const student_schema=new mongoose.Schema({
  Row:Number,
  reg_no: Number,
  Name:String,
  Enrolment_Number:String,
  Branch:String,
  access_id:String
});

const Student = mongoose.model("student",student_schema);


const items_schema=new mongoose.Schema({
  item:String,
  Quantity:Number
});

const Item=mongoose.model("items",items_schema);





//-----home route------//
app.get("/",function(req,res){
  Item.find({},function(err,results){
    if(err){
      console.log(err);
    }else{
      res.render('page',{items:results});
    }
  });
});
//--------route for thanks page-------------//
app.get("/thanks",function(req,res){
  res.sendFile(__dirname+"/thnks.html");
});
//--------post method for student page after they put there comments , triggered by "send message" button------//
app.post("/welcome",function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var comment=req.body.message;
  //----inserting the comment into the database collection instance Comment---//
  Comment.insertMany({Name:name,Email:email,Comment:comment},function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log("One comment recieved");
    }
  });
  res.render('complaint',{});
});

//-----route for the login page ----------//
app.get("/login",function(req,res){
  res.render('failure',{flag:0});
})

//-----post method for the login page after the student fills the credentials, triggered by "login button"
app.post("/login",function(req,res){
  var username=req.body.username;
  var password=req.body.pass;
  //checking for the input credentials against the data present in our database collection students--//
  Student.find({access_id:username,reg_no:password},function(err,result){
    if(err){
      console.log(err);
      res.render('failure',{flag:1});
    }else{
      console.log(result);
      res.render('welcome',{name:result[0].Name});
    }
  });
});
//---creating new schema for emails to be stored in our collection emails----//
const email_schema=new mongoose.Schema({
  email:{
    type:String
  }
});
const Email=mongoose.model("id",email_schema);
//--post function for the home route----//
app.post("/",function(req,res){
  const email_id=new Email({
    email:req.body.email
  });
  //-----creating an object of the Email instance schema and storing it in our collection emails ---//
  email_id.save(function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log("Item inserted");
    }
  });
  console.log(email_id);
  res.redirect("/thanks");
});






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//-------rendering our website on port ---//
app.listen(port,function(){
  console.log("server running at port 3000!");
});
