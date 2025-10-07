async function fetchWeather(){
    let searchInput = document.getElementById("search")
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const api = "";

    if (searchInput.value.trim() === ""){
        weatherDataSection.innerHTML = `
        <div>
            <h2> Empty Input </h2>
            <p> Please try again with a valid <u> city name </u>. </p>
        </div>`;
        return;
    }


    
    async function getLonAndLat() { 
        const countryCode = 1;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value.replace(" ", "%20")},${countryCode}&limit=1&appid=${api}`;

        const response = await fetch(geocodeURL) //comes back in JSON format... Kind of like class definitions. LIke this: 
                                                                                                        /*
                                                                                                            [
                                                                                                                {
                                                                                                                    "name": "London",
                                                                                                                    "lat": 51.5074,
                                                                                                                    "lon": -0.1278,
                                                                                                                    "country": "GB"
                                                                                                                }
                                                                                                            ]
                                                                                                        */
        if (!response.ok) {
            console.log("Bad response! ", response.status)
            return;
        }

        const data = await response.json();

        if(data.length === 0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>`;
            return;
        }

        
        return data[0];
        
    }

    async function getWeatherData(lon,lat){
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;
        const response = await fetch(weatherURL);

        if (!response.ok){
            console.log("Bad Response! ", response.status);
            return; 
        }

        const data = await response.json();
        
        weatherDataSection.style.display = "flex";
        weatherDataSection.style.color = "black";
        weatherDataSection.style.border = "2px solid white";

        weatherDataSection.innerHTML = `
        <img src = "https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
            <h2> ${data.name} </h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `
    }



    const geocodeData = await getLonAndLat();
    if (!geocodeData) return;
    await getWeatherData(geocodeData.lon, geocodeData.lat);
    document.getElementById("search").value = "";
}



