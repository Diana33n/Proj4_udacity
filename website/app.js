/* Global Variables */
const openWeatherMapBaseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiBaseURL = "http://localhost:3000/";

let openWeatherMapAPIKey = '';

// Fetch the API key from the server
fetch('/apiKey')
    .then(response => response.json())
    .then(data => {
        openWeatherMapAPIKey = data.apiKey;
    })
    .catch(err => console.error("Error fetching API key:", err));

// Event listener to add function to existing HTML DOM element
document.getElementById("generate").addEventListener("click", () => {
    let zipCode = document.getElementById("zip").value.trim();
    let feelings = document.getElementById("feelings").value.trim();

    if (!zipCode || !feelings) {
        alert("Please fill in both the Zip Code and Feelings fields.");
        return;
    }

    getDataFromOpenWeatherAPI(openWeatherMapAPIKey, zipCode, feelings);
});

/* Function to GET Web API Data */
async function getDataFromOpenWeatherAPI(apiKey, zipCode, feelings) {
    try {
        let response = await fetch(`${openWeatherMapBaseURL}${zipCode},us&appid=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch weather data.");
        let result = await response.json();
        postProjectData(result.main.temp, feelings);
    } catch (error) {
        console.error(error);
        alert("Error fetching weather data. Please try again.");
    }
}

/* Function to GET Project Data */
async function getProjectData() {
    try {
        let response = await fetch(`${apiBaseURL}projectData`);
        if (!response.ok) throw new Error("Failed to fetch project data.");
        let result = await response.json();
        document.getElementById("date").innerHTML = result.date;
        document.getElementById("temp").innerHTML = `${Math.round(result.temp)}°F`;
        document.getElementById("content").innerHTML = result.content;
        document.getElementById("zip").value = "";
        document.getElementById("feelings").value = "";
    } catch (error) {
        console.error("Error fetching project data:", error);
    }
}

/* Function to POST Project Data */
async function postProjectData(temp, feelings) {
    let d = new Date();
    let newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;
    let data = {
        date: newDate,
        temp: temp,
        content: feelings,
    };

    try {
        let response = await fetch(`${apiBaseURL}projectData`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to post project data.");
        getProjectData();
    } catch (error) {
        console.error("Error posting project data:", error);
    }
}
