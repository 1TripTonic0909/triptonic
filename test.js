app.post("/history",function(req,res){
    async function runCompletion () {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: "tell me about history of " + req.body.city + " in detail",
          max_tokens : 1000
        });
        let a = completion.data.choices[0].text;
        res.render("history",{result:a});
        }
    runCompletion();
});







app.post("/weather",function(req,res){
    const cit = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + req.body.city + "&appid=2c8fe0ffce83981823ed2859d6ea34b0&units=metric";
    https.get(url, function(response) {

    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      const temperature = weatherData.main.temp;
      const tempa = parseInt(temperature)
      const description = weatherData.weather[0].description;
      const wicon = weatherData.weather[0].icon;
      const icon = "http://openweathermap.org/img/wn/" + wicon + "@2x.png"
      res.write("<html>");
      res.write("<h3>Temperature of " + weatherData.name + " is " + parseInt(temperature) + "&#176C</h3>");
      res.write("<h3>The weather is currently " + description + "<h3>");
      res.write("<img src=" + icon + ">");
      res.write("</html>");
      res.end();
      res.render("weather", { data: { icon: wicon, temperaturee: tempa , cityy: cit ,  descriptionn: description} })
    })
  });
});
