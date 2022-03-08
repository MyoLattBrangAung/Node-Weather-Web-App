const express = require("express");
const bodyParser  = require("body-parser");
const https = require("https");
require("dotenv").config();

// create app
let app = express();
app.use(bodyParser.urlencoded({extended:true}));

// route management
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
app.post('/',(req,res)=>{
    let city = req.body.cityName;
    let apiKey ="c51e398335024018b6085135220803 ";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey} &q=${city}&aqi=no`;
    https.get(url,(respon)=>{
        console.log(res.statusCode);
        respon.on("data",(data)=>{
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if (!weatherData.error){
                let temp_c = weatherData.current.temp_c;
                let weather =weatherData.current.condition.text;
                let sign = weatherData.current.condition.icon;
                res.write(`<h1 style = 'color:blue'><img src='${sign}'> The Weather of ${city} is ${weather}.</h1>`)
                res.write(`<h1 style = 'color:red' >The Temprature of ${city} is ${temp_c} Degree Celsius.</h1>`);
                res.send();
            }else{
                res.write(404);
                res.write(weatherData.error.code);
                res.write(weatherData.error.message);
                }
        })
    })
})
// run app
let port = process.env.PORT;
app.listen(port,()=>{console.log(`Server is running at port : ${port}`)});