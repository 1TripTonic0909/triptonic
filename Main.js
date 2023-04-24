const express = require('express');
var path = require('path');
const app = express();
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()
app.use(express.static('public'));
const http = require("https");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

var cityglobal;

app.use(express.static(path.join(__dirname, '/public')));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/indexmain.html");
})
app.post("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
})

app.post("/contact", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
})

app.post("/askanything",function(req,res){
    async function runCompletion () {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: req.body.userinput,
          max_tokens : 1000
        });
        let a = completion.data.choices[0].text;
        res.render("index",{result:a});
        }
    runCompletion();
});

app.post("/history",function(req,res){
  const city = req.body.city;
  cityglobal = city;
    async function runCompletion () {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: "tell me about history of " + city + " in detail",
          max_tokens : 1000
        });
        let a = completion.data.choices[0].text;
        res.render("history",{result:a});
        }
    runCompletion();
});

app.post("/weather",function(req,res){
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityglobal + "&appid=2c8fe0ffce83981823ed2859d6ea34b0&units=metric";
    http.get(url, function(response) {

    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      const temperature = weatherData.main.temp;
      const tempa = parseInt(temperature)
      const description = weatherData.weather[0].description;
      const wicon = weatherData.weather[0].icon;
      const icon = "http://openweathermap.org/img/wn/" + wicon + "@2x.png"
      // res.write("<html>");
      // res.write("<h3>Temperature of " + weatherData.name + " is " + parseInt(temperature) + "&#176C</h3>");
      // res.write("<h3>The weather is currently " + description + "<h3>");
      // res.write("<img src=" + icon + ">");
      // res.write("</html>");
      // res.end();
      res.render("weather", { data: { icon: wicon, temperaturee: tempa , cityy: cityglobal ,  descriptionn: description} })
    })
  });
});









app.listen(3000, () => {
    console.log("server is running");
});