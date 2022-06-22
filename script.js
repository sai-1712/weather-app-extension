let weather = {
  apiKey: "YOUR API KEY GOES HERE",
  getLanLog: function(city) {
    fetch(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No Such city found.");
          throw new Error("No Such city found.");
        }
        return response.json();
      })
      .then((data) => {
        if(data === null || data.length === 0 || data === undefined) {
          document.querySelector(".weather").classList.remove("loading");
          document.querySelector(".weather").classList.add("nocity");
        }
        this.fetchWeather(data[0].lat, data[0].lon);
      });
  },
  fetchWeather: function (lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.getLanLog(document.querySelector(".search-bar").value);
  },
};

let geocode = {
  getLocation: function() {
    function success (data) {
      weather.fetchWeather(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
      weather.getLanLog("India");
    }
  }
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

geocode.getLocation();
