// scripts.js

document.getElementById('donationForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const region = document.getElementById('region').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!region || amount <= 0) {
        displayStatus('Please fill all fields correctly.', 'error');
        return;
    }

    try {
        displayStatus('Processing your donation...', 'info');

        // Send donation details to the server
        const txHash = await donateToBlockchain(region, amount);
        
        displayStatus(`Donation successful! Transaction Hash: ${txHash}`, 'success');
    } catch (error) {
        displayStatus(`Error: ${error.message}`, 'error');
    }
});

function displayStatus(message, statusType) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = statusType;
}

// // Blockchain donation logic
// async function donateToBlockchain(region, amount) {
//     try {
//         const response = await fetch('/donate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ region, amount }),
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.message || 'Failed to process donation.');
//         }

//         const result = await response.json();
//         return result.transaction; // Transaction hash from the server
//     } catch (error) {
//         throw new Error(error.message || 'Error connecting to the server.');
//     }
// }


// בקובץ scripts.js, החלף את הפונקציה הקיימת
// פונקציה לביצוע תרומה באמצעות MetaMask
async function donateToBlockchain(region, amount) {
    try {
        if (typeof window.ethereum === 'undefined') {
            window.open('https://metamask.io/download.html', '_blank');
            throw new Error('MetaMask אינו מותקן. אנא התקן אותו כדי לתרום.');
        }

        if (!window.userWalletAddress) {
            throw new Error('אנא התחבר לארנק קודם.');
        }

        const web3 = new Web3(window.ethereum);
        // שימוש במשתנים הגלובליים
        const contract = new web3.eth.Contract(window.CONTRACT_ABI, window.CONTRACT_ADDRESS);
        
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        displayStatus('מעבד את התרומה שלך...', 'info');
        
        const result = await contract.methods.donate(region).send({
            from: window.userWalletAddress,
            value: amountInWei,
            gas: 200000
        });

        return result.transactionHash;

    } catch (error) {
        console.error('שגיאה בביצוע התרומה:', error);
        throw new Error(error.message || 'שגיאה בביצוע התרומה');
    }
}
// Update Navbar dynamically based on session
window.onload = async () => {
    try {
        const response = await fetch('/session'); // Fetch user session data
        const data = await response.json();
        const userMenu = document.getElementById('userMenu');

        if (data.username) {
            userMenu.innerHTML = `
                <li>Hi, ${data.username}</li>
                <li><a href="/logout">Logout</a></li>
            `;
        } else {
            userMenu.innerHTML = `
                <li><a href="#" onclick="showSection('login')">Login / Register</a></li>
            `;
        }

        showSection("home"); // Default section to display
    } catch (error) {
        displayStatus('Error loading session data.', 'error');
    }
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

document.getElementById("convertButton").addEventListener("click", async () => {
    const ethAmount = parseFloat(document.getElementById("ethInput").value);
    const selectedCurrency = document.getElementById("currencySelect").value;

    if (!ethAmount || ethAmount <= 0) {
        document.getElementById("conversionResult").innerText = "Please enter a valid ETH amount.";
        return;
    }

    const rate = await fetchConversionRate(selectedCurrency);
    if (rate) {
        const convertedAmount = (ethAmount * rate).toFixed(2);
        document.getElementById("conversionResult").innerText = `${ethAmount} ETH = ${convertedAmount} ${selectedCurrency.toUpperCase()}`;
    } else {
        document.getElementById("conversionResult").innerText = "Unable to fetch conversion rate. Please try again later.";
    }
});

