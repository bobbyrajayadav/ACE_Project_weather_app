const button = document.getElementById("search-button");
const input = document.getElementById('city-input');

const cityName = document.getElementById('city-name');
const cityTime = document.getElementById('city-time');
const cityTemp = document.getElementById('city-temp');

// Create error message element
const errorMessage = document.createElement('p');
errorMessage.classList.add('error-message'); // Add a class for styling
errorMessage.style.color = 'red';
errorMessage.style.display = 'none';
// Find the output container and append the error message to it
const outputContainer = document.querySelector('.output-container');
if (outputContainer) {
    outputContainer.appendChild(errorMessage);
}

async function getData(cityName) {
    try {
        // Input validation
        if (!cityName || cityName.trim() === '') {
            throw new Error('Please enter a city name');
        }

        // API call with error handling
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=0ea9105af79a44b285890214240812&q=${cityName}&aqi=yes`
        );

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
        }

        const data = await response.json();

        // Check for API specific errors
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data;
    } catch (error) {
        // Log error for debugging
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

button.addEventListener("click", async () => {
    try {
        // Hide any previous error message
        errorMessage.style.display = 'none';
        
        // Get input value
        const value = input.value;
        
        // Fetch and process data
        const result = await getData(value);
        
        // Update UI with weather data
        cityName.innerText = `${result.location.name}, ${result.location.region} - ${result.location.country}`;
        cityTime.innerText = `Time: ${result.location.localtime}`;
        cityTemp.innerText = `Temperature in celsius: ${result.current.temp_c}`;
    } catch (error) {
        // Show error message to user
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        
        // Reset weather display
        cityName.innerText = 'Location, Region & Country';
        cityTime.innerText = 'Local time';
        cityTemp.innerText = 'Temperature';
    }
});

// https://api.weatherapi.com/v1/current.json?key=ae29dfa6232549b19f174913240712&q=London&aqi=yes
