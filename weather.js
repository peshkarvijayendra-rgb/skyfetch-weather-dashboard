// ===============================
// API CONFIG
// ===============================
const API_KEY = 'c4e5c9b2a7b0f9c2890f9c8da137bc7d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===============================
// ELEMENT REFERENCES
// ===============================
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// ===============================
// FETCH WEATHER (ASYNC/AWAIT)
// ===============================
async function getWeather(city) {
    showLoading();

    // disable button
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(url);

        console.log('Weather Data:', response.data);
        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling.');
        } else {
            showError('Failed to fetch weather data. Try again later.');
        }
    } finally {
        // re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

// ===============================
// DISPLAY WEATHER
// ===============================
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    // focus back to input
    cityInput.focus();
}

// ===============================
// LOADING UI
// ===============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// ===============================
// ERROR UI
// ===============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <p>⚠️ ${message}</p>
        </div>
    `;
}

// ===============================
// BUTTON CLICK
// ===============================
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    // validations
    if (!city || city.length < 2) {
        showError('Please enter a valid city name.');
        return;
    }

    getWeather(city);
});

// ===============================
// ENTER KEY SUPPORT (BONUS)
// ===============================
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// ===============================
// WELCOME MESSAGE
// ===============================
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <p class="welcome-text">Enter a city name to get started!</p>
    </div>
`;

// ===============================
// DEFAULT LOAD
// ===============================
getWeather('Bengaluru');
