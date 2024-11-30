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
    const menuOverlay = document.getElementById('menuOverlay');
    menu.classList.toggle('visible');
    hamMenu.classList.toggle('active');
    menuOverlay.classList.toggle('visible');

}
// a function to convert degrees to direction
function degreesToDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}
// a function to format time and date to a format like this: 22 jan 2024 04:32 PM
function formatDate(date) {
    // Uses International datetime API
    // syntax : Intl.DateTimeFormat(locales,options).format(date)
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
// async function getWeather(latitude,longitude,cityName) {
//     const cacheKey = 'weatherData'; // Unique key for weather data
//     const cacheTTL = 15 * 60 * 1000; // Time-to-live: 15 minutes
//     const cachedData = localStorage.getItem(cacheKey);// get cache data using this cache key
//     const now = Date.now();
//
//     // Check if there's valid cached data
//     if (cachedData) {
//         const { timestamp, data,cityName } = JSON.parse(cachedData);
//         if (now - timestamp < cacheTTL) {
//             console.log('Using cached weather data.');
//             updateWeatherUI(data); // Update the UI using cached data
//             return;
//         }
//     }
//
//     // Fetch new weather data if no valid cache is available
//     try {
//         console.log('Fetching new weather data.');
//         const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=GMT&forecast_days=1`);
//         if (!response.ok) {
//             throw new Error('Something went wrong!');
//         }
//         const data = await response.json();
//
//         // Save new data to cache with a timestamp
//         localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data ,cityName }));
//
//         updateWeatherUI(data); // Update the UI with new data
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//         document.getElementById('weatherContentTray').textContent = 'Failed to load weather data. Please try again later.';
//     }
// }
//
// // Function to update the UI with weather data
// function updateWeatherUI(data) {
//     // Update each field as per the API response
//     document.getElementById('apparentTemperature').textContent = data.current.apparent_temperature + " °C";
//     document.getElementById('rain').textContent = data.daily.precipitation_sum + " mm";
//     document.getElementById('humidityPercent').textContent = data.current.relative_humidity_2m + " %";
//     document.getElementById('windSpeedDirection').textContent = data.current.wind_speed_10m + " km/h " + degreesToDirection(data.current.wind_direction_10m);
//     document.getElementById('maxMinTemperature').innerHTML = `Min: ${data.daily.temperature_2m_min}°C<br>Max: ${data.daily.temperature_2m_max}°C`;
//     document.getElementById('uvIndex').textContent = data.daily.uv_index_max;
//     document.getElementById('currentTemperature').textContent = data.current.temperature_2m + "°C";
//
//     // Format the current date and time
//     const date = new Date();
//     document.getElementById('timeDate').innerHTML = formatDate(date);
// }
// //experiment here
// document.addEventListener('DOMContentLoaded', () => {//execute this when DOM is fully loaded
//     const locationCacheKey = 'userLocation';
//     const locationCacheTTL = 15 * 60 * 1000; // Cache location for 15 minutes i.e. cache expiry limit
//     //TODO: clear this part
//     //this part is not clear
//     function getLocation() {//gets location using geolocation api
//         return new Promise((resolve, reject) => {
//             const cachedLocation = localStorage.getItem(locationCacheKey);//search and retrieve cache named 'userLocation'
//             const now = Date.now();//gets the current time to validate the freshness of the cache
//
//             if (cachedLocation) {//if there already exist a cache i.e. if it is not the first time
//                 const { timestamp, coords } = JSON.parse(cachedLocation);// we get coordinates and timestamp
//                 if (now - timestamp < locationCacheTTL) {// checks if cache hasn't expired yet by subtracting current time with the time when cache was created
//                     console.log('Using cached location.');
//                     resolve(coords);
//                     return;// explicit return to avoid any accidental failure
//                 }
//             }
//
//             // If no valid cache, get the location
//             // this function has two callbacks: first is if it is success & second for failure
//             navigator.geolocation.getCurrentPosition(
//                 (location) => {//success callback function
//                     const { latitude, longitude } = location.coords;
//                     console.log('Fetched new location:', latitude, longitude);
//
//
//                     // Cache the location with a timestamp
//                     localStorage.setItem(locationCacheKey, JSON.stringify({
//                         timestamp: now,
//                         coords: { latitude, longitude },
//                     }));
//
//                     resolve({ latitude, longitude });
//                 },
//                 // error callback
//                 () => {
//                     document.getElementById('weatherContentTray').textContent = 'Failed to load weather data. Please enable location.';
//                     reject(new Error('Location not available'));
//                 }
//             );
//         });
//     }
//
//     async function init() {
//         try {
//             const { latitude, longitude } = await getLocation();
//             getWeather(latitude, longitude,getCity(latitude, longitude));
//         } catch (error) {
//             console.error(error);
//         }
//     }
//
//     init(); // Start the process
// });
//
// // function to get city name
// async function getCity(latitude, longitude) {
//     try{
//         const reverseGeoResponse = await fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
//         if (!reverseGeoResponse.ok) {
//             throw new Error('No Reverse Geo data returned');
//         }
//         return await reverseGeoResponse.json().city;
//     }
//     catch (error) {
//         console.error("Failed to get city name: "+error);
//     }
// }
document.addEventListener('DOMContentLoaded', () => {
    const unifiedCacheKey = 'unifiedCache'; // Unified cache key
    const cacheTTL = 15 * 60 * 1000; // Time-to-live: 15 minutes

    // Unified cache check and fetch logic
    async function getUnifiedData() {
        const cachedData = localStorage.getItem(unifiedCacheKey);// gets cache from local storage
        const now = Date.now();// gets the current time

        if (cachedData) {// this will not run when the page is loaded after for the first time in a while
            const { timestamp, location, weather, city } = JSON.parse(cachedData);
            if (now - timestamp < cacheTTL) {// see if the elapsed time exceeds the limit set(15 minutes)
                console.log('Using cached data.');
                updateWeatherUI(weather);
                updateCityUI(city); // updates city name
                return location; // Return cached location for further use
            }
        }

        console.log('Fetching new data.');
        try {
            // Fetch new location, city, and weather data
            const location = await fetchLocation();
            const city = await fetchCity(location.latitude, location.longitude);
            const weather = await fetchWeather(location.latitude, location.longitude);

            // Cache all data together with a single timestamp
            localStorage.setItem(unifiedCacheKey, JSON.stringify({
                timestamp: now,
                location,
                weather,
                city
            }));

            // Update UI with new data
            updateWeatherUI(weather);
            updateCityUI(city);

            return location; // Return location for further use if needed
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('weatherContentTray').textContent = 'Failed to load data. Please try again later.';
        }
    }
    //function to get location (latitude and longitude)
    async function fetchLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    resolve({ latitude, longitude });
                },
                () => {
                    reject(new Error('Location not available.'));
                }
            );
        });
    }
    //function to get city name using latitude and longitude
    async function fetchCity(latitude, longitude) {
        try {
            const response = await fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (!response.ok) throw new Error('Failed to fetch city name.');
            const data = await response.json();
            return data.city || 'Unknown City';
        } catch (error) {
            console.error('Error fetching city:', error);
            return 'Unknown City';
        }
    }
    // function to get weather info using open-meteo API
    async function fetchWeather(latitude, longitude) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=GMT&forecast_days=1`);
            if (!response.ok) throw new Error('Failed to fetch weather data.');
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }

    // Update UI functions
    function updateWeatherUI(data) {
        document.getElementById('apparentTemperature').textContent = data.current.apparent_temperature + " °C";
        document.getElementById('rain').textContent = data.daily.precipitation_sum + " mm";
        document.getElementById('humidityPercent').textContent = data.current.relative_humidity_2m + " %";
        document.getElementById('windSpeedDirection').textContent = data.current.wind_speed_10m + " km/h " + degreesToDirection(data.current.wind_direction_10m);
        document.getElementById('maxMinTemperature').innerHTML = `Min: ${data.daily.temperature_2m_min}°C<br>Max: ${data.daily.temperature_2m_max}°C`;
        document.getElementById('uvIndex').textContent = data.daily.uv_index_max;
        document.getElementById('currentTemperature').textContent = data.current.temperature_2m + "°C";

        const date = new Date();
        document.getElementById('timeDate').innerHTML = formatDate(date);
    }

    function updateCityUI(city) {
        document.getElementById('location').textContent = city; // Assuming there's an element for the city name
    }

    // Initialize the process
    async function init() {
        await getUnifiedData();
    }

    init();
});
