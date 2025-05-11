// scripts.js

window.onload = () => {
    const token = localStorage.getItem('token');
    const userMenu = document.getElementById('userMenu');

    if (userMenu) {  // בדיקה אם האלמנט נמצא
        if (token) {
            userMenu.innerHTML = `
                <li><a href="#" onclick="logout()">Logout</a></li>
            `;
        } else {
            userMenu.innerHTML = `
                <li><a href="#" onclick="showSection('login')">Login / Register</a></li>
            `;
        }
    } else {
    }

    showSection("home");
    // בחירה אחת בלבד - לא שניהם ביחד
};

async function fetchConversionRate(currency) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`);
        const data = await response.json();
        return data.ethereum[currency];
    } catch (error) {
        console.error("Error fetching conversion rate:", error);
        return null;
    }
}


const convertButton = document.getElementById("convertButton");
if (convertButton) {
    convertButton.addEventListener("click", async () => {
        const ethAmount = parseFloat(document.getElementById("ethInput").value);
        const selectedCurrency = document.getElementById("currencySelect").value;
        
        if (!ethAmount || ethAmount <= 0) {
            document.getElementById("conversionResult").innerText = "Please enter a valid ETH amount.";
            return;
        }

        try {
            const rate = await fetchConversionRate(selectedCurrency);
            if (rate) {
                const convertedAmount = (ethAmount * rate).toFixed(2);
                document.getElementById("conversionResult").innerText = `${ethAmount} ETH = ${convertedAmount} ${selectedCurrency.toUpperCase()}`;
            } else {
                document.getElementById("conversionResult").innerText = "Unable to fetch conversion rate. Please try again later.";
            }
        } catch (error) {
            console.error("Error during conversion:", error);
            document.getElementById("conversionResult").innerText = "Error occurred during conversion.";
        }
    });
} else {
    console.error("Convert button not found in the DOM");
}
