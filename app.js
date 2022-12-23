const express= require("express");
const app=express();
const bodyparser = require("body-parser");
const https = require("https");
const fetch = require('node-fetch');
const { features } = require("process");
const fs = require("fs");

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

// All variable declaration
 let searchArr=[];
app.get("/",function(req,res){
    res.render("home");
})
app.get("/search-on-map",function(req,res){
    res.render("map");
})


// this is api section
app.post("/",function(req,res){
	const query=req.body.search;
	fs.readFile("id.json", "utf8", (err, jsonString) => {
		if (err) {
		  console.log("File read failed:", err);
		  return;
		}
		const jsonarray=JSON.parse(jsonString);
		// console.log(jsonarray[0].name);
		let place_id;
		let url;
		for (let index = 0; index < jsonarray.length; index++) {
			const element = jsonarray[index];
			if(element.name==query){
				// console.log(element.place_id);
				const appikey="52aea8bde0984400bf25353183f920ab#";

				place_id=element.place_id;
				console.log(place_id);
				url="https://api.geoapify.com/v2/places?categories=catering.fast_food&filter=place:"+ place_id +"&limit=20&apiKey="+ appikey;
	

	
	https.get(url, function(response){
        let data=[];
        response.on("data",chunk=>{
            data.push(chunk);
        })
		response.on("end", function(Features){
			
 const user=JSON.parse(Buffer.concat(data).toString());
        searchArr=user.features;
			res.send();
		})
        res.redirect("/food-help");
	})
			}
		}
	  });
	
	
})
//   api section close

// for results of search
app.get("/Food-help",function(req,res){
	res.render("food",{dataArr:searchArr});
});
app.get("/about",function(req,res){
	res.render("about");
})




app.listen("3000",function(){
    console.log("server is started ");
})