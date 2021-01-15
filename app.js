const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const Fname = req.body.FName;
    const Lname = req.body.LName;
    const signupEmail = req.body.SignUpEmail;

    const data = {
        members: [
            {
                email_address: signupEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: Fname,
                    LNAME: Lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/72a8c73bcb";

    const options = {
        method: "POST",
        auth: "Farkhan:528b68c2932bfa6da412e9792a768e43-us2"
    } 

    const request = https.request(url, options, function(response){
        var status =  response.statusCode;
        if(status != 200){
           res.sendFile(__dirname+"/failure.html");
        }else if(status === 200){
            res.sendFile(__dirname+"/success.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT ||  3000, function(){
    console.log("Server started on port 3000");
})

//API key
// 528b68c2932bfa6da412e9792a768e43-us2
//List ID
// 72a8c73bcb