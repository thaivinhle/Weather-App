/*Author: Thai Le; ID 934440426*/

// Function to get weather data for a given city and state
function getWeather(cityId) {
    const apiKey = '78f0ecacae8978bda3d59d8a5ade61e6'; // API key for OpenWeatherMap
    const cityInput = document.getElementById(cityId); // Gets the city input element
    const stateSelect = document.getElementById(`state${cityId.slice(-1)}`); // Gets the state select element

    const city = cityInput.value; // Retrieves the city name
    const state = stateSelect.value; // Retrieves the state name

    // Check if the city is entered
    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Check if the state is selected
    if (!state) {
        alert('Please select a state');
        return;
    }

    const location = `${city},${state},US`; // Combines city, state, and country code

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`; // URL for current weather
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`; // URL for forecast

    // Fetch current weather data
    fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data, cityId); // Display current weather
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('City not found. Please check the city and state combination.');
        });

    // Fetch forecast data
    fetch(forecastURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayDailyForecast(data.list, cityId); // Display forecast
        })
        .catch(error => {
            console.error('Error fetching daily forecast data:', error);
            alert('City not found. Please check the city and state combination.');
        });
}

// Function to display current weather data
function displayWeather(data, cityId) {
    const tempDivInfo = document.getElementById(`temp-div${cityId.slice(-1)}`);
    const weatherInfoDiv = document.getElementById(`weather-info${cityId.slice(-1)}`);
    const weatherIcon = document.getElementById(`weather-icon${cityId.slice(-1)}`);
    const dailyForecastHighDiv = document.getElementById(`daily-forecast-high${cityId.slice(-1)}`);
    const dailyForecastLowDiv = document.getElementById(`daily-forecast-low${cityId.slice(-1)}`);

    // Clear previous data
    weatherInfoDiv.innerHTML = '';
    dailyForecastHighDiv.innerHTML = '';
    dailyForecastLowDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    const cityName = data.name; // City name
    let temperature = data.main.temp - 273.15; // Temperature in Celsius
    const description = data.weather[0].description; // Weather description
    const iconCode = data.weather[0].icon; // Weather icon code
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Weather icon URL

    const unitRadio = document.querySelector(`input[name="unit${cityId.slice(-1)}"]:checked`); // Selected unit (metric or imperial)
    const unit = unitRadio ? unitRadio.value : 'metric';

    // Convert temperature to Fahrenheit if needed
    if (unit === 'imperial') {
        temperature = temperature * 9/5 + 32;
    }

    temperature = Math.round(temperature); // Round temperature

    const temperatureHTML = `<p>${temperature}°${unit === 'imperial' ? 'F' : 'C'}</p>`;
    const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML; // Display temperature
    weatherInfoDiv.innerHTML = weatherHTML; // Display weather information
    weatherIcon.src = iconURL; // Set weather icon source
    weatherIcon.alt = description; // Set weather icon alt text

    showImage(cityId); // Show the weather icon
}

// Function to display daily forecast data
function displayDailyForecast(dailyData, cityId) {
    const dailyForecastHighDiv = document.getElementById(`daily-forecast-high${cityId.slice(-1)}`);
    const dailyForecastLowDiv = document.getElementById(`daily-forecast-low${cityId.slice(-1)}`);
    const dailyForecastHumidityDiv = document.getElementById(`humidity-percent${cityId.slice(-1)}`);
    const next5DaysData = groupByDay(dailyData.slice(0, 40)); // Group forecast data by day (5 days)
    const highText = document.getElementById(`high-text${cityId.slice(-1)}`);
    const lowText = document.getElementById(`low-text${cityId.slice(-1)}`);
    const humidityText = document.getElementById(`humidity-text${cityId.slice(-1)}`);

    const unitRadio = document.querySelector(`input[name="unit${cityId.slice(-1)}"]:checked`); // Selected unit (metric or imperial)
    const unit = unitRadio ? unitRadio.value : 'metric';

    // Clear previous data
    dailyForecastHighDiv.innerHTML = '';
    dailyForecastLowDiv.innerHTML = '';
    dailyForecastHumidityDiv.innerHTML = '';
    highText.innerHTML = '';
    lowText.innerHTML = '';
    humidityText.innerHTML = '';
    highText.innerHTML += 'High';
    lowText.innerHTML +='Low';
    humidityText.innerHTML += 'Humidity';

    // Loop through each day's data and display it
    for (const day in next5DaysData) {
        const dayData = next5DaysData[day];
        const highTemperature = calculateHighTemperature(dayData, unit); // Calculate high temperature
        const lowTemperature = calculateLowTemperature(dayData, unit); // Calculate low temperature
        const humidityPercent = calculateAverageHumidity(dayData); // Calculate average humidity
        const iconCode = dayData[0].weather[0].icon; // Weather icon code
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`; // Weather icon URL

        const dayOfWeek = new Date(dayData[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }); // Day of the week

        const highTemperatureHTML = `
            <div class="daily-item">
                <span>${dayOfWeek}</span>
                <img src="${iconURL}" alt="Daily Weather Icon">
                <span>${highTemperature}°${unit === 'imperial' ? 'F' : 'C'}</span>
            </div>
        `;

        const lowTemperatureHTML = `
            <div class="daily-item">
                <span>${dayOfWeek}</span>
                <img src="${iconURL}" alt="Daily Weather Icon">
                <span>${lowTemperature}°${unit === 'imperial' ? 'F' : 'C'}</span>
            </div>
        `;

        const humidityHTML = `
            <div class="daily-item">
                <span>${dayOfWeek}</span>
                <img src="${iconURL}" alt="Daily Weather Icon">    
                <span>${humidityPercent}%</span>
            </div>
        `;

        dailyForecastHighDiv.innerHTML += highTemperatureHTML; // Display high temperature
        dailyForecastLowDiv.innerHTML += lowTemperatureHTML; // Display low temperature
        dailyForecastHumidityDiv.innerHTML += humidityHTML; // Display humidity
    }
}

// Function to calculate the average humidity
function calculateAverageHumidity(dayData) {
    const humidityValues = dayData.map(item => item.main.humidity); // Get humidity values
    const sum = humidityValues.reduce((total, value) => total + value, 0); // Sum of humidity values
    const averageHumidity = sum / humidityValues.length; // Average humidity
    return Math.round(averageHumidity); // Round average humidity
}

// Function to group forecast data by day
function groupByDay(dailyData) {
    return dailyData.reduce((acc, cur) => {
        const date = new Date(cur.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }); // Get date
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(cur); // Group data by date
        return acc;
    }, {});
}

// Function to calculate the highest temperature of the day
function calculateHighTemperature(dayData, unit) {
    const temperatures = dayData.map(item => item.main.temp - 273.15); // Convert temperatures to Celsius
    const maxTemperature = Math.max(...temperatures); // Get the highest temperature
    if (unit === 'imperial') {
        return Math.round(maxTemperature * 9/5 + 32); // Convert to Fahrenheit if needed
    } else {
        return Math.round(maxTemperature); // Round the temperature
    }
}

// Function to calculate the lowest temperature of the day
function calculateLowTemperature(dayData, unit) {
    const temperatures = dayData.map(item => item.main.temp - 273.15); // Convert temperatures to Celsius
    const minTemperature = Math.min(...temperatures); // Get the lowest temperature
    if (unit === 'imperial') {
        return Math.round(minTemperature * 9/5 + 32); // Convert to Fahrenheit if needed
    } else {
        return Math.round(minTemperature); // Round the temperature
    }
}

// Function to show the weather icon
function showImage(cityId) {
    const weatherIcon = document.getElementById(`weather-icon${cityId.slice(-1)}`);
    weatherIcon.style.display = 'block'; // Display the weather icon
}
