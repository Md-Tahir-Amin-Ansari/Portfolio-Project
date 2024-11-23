$(document).ready(function(){
    $('.buttons').on('click', function(event) {
        if(this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });
});
function toggleMenu() {
    const menu = document.getElementById('titleBarButtons');
    const hamMenu = document.querySelector('.hamMenuToggle');
    menu.classList.toggle('visible');
    hamMenu.classList.toggle('active');
}
// a function to convert degrees to direction
function degreesToDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}
// a function to format time and date to a format like this: 22 jan 2024 04:32 PM
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}
//a function to get weather data
// async function getWeather(){
//     try {
//         let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.5769&longitude=88.3186&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=GMT&forecast_days=1');
//         if(!response.ok){
//             throw new Error('Something went wrong!');
//         }
//         let data = await response.json();
//         //feels Like(current)
//         let feelsLike =document.getElementById('apparentTemperature');
//         feelsLike.textContent = data.current.apparent_temperature+ " °C"
//         // rain (daily)
//         let rain = document.getElementById('rain');
//         rain.textContent = data.daily.precipitation_sum+" mm";
//         // humidity (current)
//         let humidity = document.getElementById('humidityPercent');
//         humidity.textContent = data.current.relative_humidity_2m+" %";
//         //wind speed and direction
//         let wind = document.getElementById('windSpeedDirection');
//         wind.textContent = data.current.wind_speed_10m+" km/h "+degreesToDirection(data.current.wind_direction_10m);
//         //maximum and minimum temperature
//         let minmax = document.getElementById('maxMinTemperature');
//         minmax.innerHTML = "Min:" + data.daily.temperature_2m_min + "°C<br>Max:" + data.daily.temperature_2m_max + "°C";
//         //uv index
//         let uv_index = document.getElementById('uvIndex');
//         uv_index.innerHTML = data.daily.uv_index_max;
//         //main temperature
//         let currentTemperature = document.getElementById('currentTemperature');
//         currentTemperature.innerHTML = data.current.temperature_2m+"°C";
//         // date and time
//         let timeDate = document.getElementById('timeDate');
//         let date = new Date();
//         timeDate.innerHTML = formatDate(date);
//     }
//     catch (error) {
//         document.getElementById('weatherContentTray').textContent = 'Failed to load weather data. Please try again later.';
//         console.log(error);
//     }
//
// }
//chatgpt's version with caching
async function getWeather(latitude,longitude) {
    const cacheKey = 'weatherData'; // Unique key for weather data
    const cacheTTL = 15 * 60 * 1000; // Time-to-live: 15 minutes
    const cachedData = localStorage.getItem(cacheKey);
    const now = Date.now();

    // Check if there's valid cached data
    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (now - timestamp < cacheTTL) {
            console.log('Using cached weather data.');
            updateWeatherUI(data); // Update the UI using cached data
            return;
        }
    }

    // Fetch new weather data if no valid cache is available
    try {
        console.log('Fetching new weather data.');
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=GMT&forecast_days=1`);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const data = await response.json();

        // Save new data to cache with a timestamp
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));

        updateWeatherUI(data); // Update the UI with new data
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherContentTray').textContent = 'Failed to load weather data. Please try again later.';
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Update each field as per the API response
    document.getElementById('apparentTemperature').textContent = data.current.apparent_temperature + " °C";
    document.getElementById('rain').textContent = data.daily.precipitation_sum + " mm";
    document.getElementById('humidityPercent').textContent = data.current.relative_humidity_2m + " %";
    document.getElementById('windSpeedDirection').textContent = data.current.wind_speed_10m + " km/h " + degreesToDirection(data.current.wind_direction_10m);
    document.getElementById('maxMinTemperature').innerHTML = `Min: ${data.daily.temperature_2m_min}°C<br>Max: ${data.daily.temperature_2m_max}°C`;
    document.getElementById('uvIndex').textContent = data.daily.uv_index_max;
    document.getElementById('currentTemperature').textContent = data.current.temperature_2m + "°C";

    // Format the current date and time
    const date = new Date();
    document.getElementById('timeDate').innerHTML = formatDate(date);
}
//experiment here
document.addEventListener('DOMContentLoaded', () => {
    const locationCacheKey = 'userLocation';
    const locationCacheTTL = 15 * 60 * 1000; // Cache location for 15 minutes

    function getLocation() {
        return new Promise((resolve, reject) => {
            const cachedLocation = localStorage.getItem(locationCacheKey);
            const now = Date.now();

            if (cachedLocation) {
                const { timestamp, coords } = JSON.parse(cachedLocation);
                if (now - timestamp < locationCacheTTL) {
                    console.log('Using cached location.');
                    resolve(coords);
                    return;
                }
            }

            // If no valid cache, get the location
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    console.log('Fetched new location:', latitude, longitude);

                    // Cache the location with a timestamp
                    localStorage.setItem(locationCacheKey, JSON.stringify({
                        timestamp: now,
                        coords: { latitude, longitude },
                    }));

                    resolve({ latitude, longitude });
                },
                () => {
                    document.getElementById('weatherContentTray').textContent = 'Failed to load weather data. Please enable location.';
                    reject(new Error('Location not available'));
                }
            );
        });
    }

    async function init() {
        try {
            const { latitude, longitude } = await getLocation();
            getWeather(latitude, longitude);
        } catch (error) {
            console.error(error);
        }
    }

    init(); // Start the process
});

// function to get lat & long
