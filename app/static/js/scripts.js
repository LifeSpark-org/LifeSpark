// scripts.js

// פונקציה לבדיקה האם המשתמש מחובר
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function displayStatus(message, statusType) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.className = statusType;
    } else {
        // אם אלמנט הסטטוס לא קיים, נשתמש בפונקציית ההודעות הכללית
        showNotification(statusType, message);
    }
}

// פונקציה לביצוע תרומה באמצעות MetaMask
// Add these functions or modify existing ones in scripts.js

// This modified version of donateToBlockchain supports both region and project donations
async function donateToBlockchain(region, amount, message = '') {
    try {
        if (typeof window.ethereum === 'undefined') {
            window.open('https://metamask.io/download.html', '_blank');
            throw new Error('MetaMask אינו מותקן. אנא התקן אותו כדי לתרום.');
        }

        if (!window.userWalletAddress) {
            throw new Error('אנא התחבר לארנק קודם.');
        }

        // בדיקה שה-ABI וכתובת החוזה הוגדרו כראוי
        if (!window.CONTRACT_ABI || !window.CONTRACT_ADDRESS) {
            throw new Error('הגדרות החוזה החכם חסרות. אנא רענן את הדף ונסה שוב.');
        }

        const web3 = new Web3(window.ethereum);
        
        // יצירת מופע של החוזה החכם
        const contract = new web3.eth.Contract(
            window.CONTRACT_ABI, 
            window.CONTRACT_ADDRESS
        );
        
        // המרת הסכום ל-wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        console.log('Preparing transaction:', {
            contract: window.CONTRACT_ADDRESS,
            region: region,
            amount: amount,
            amountInWei: amountInWei,
            from: window.userWalletAddress
        });
        
        // בניית טרנזקציה והוספת פרמטר של הודעה אם קיים
        const transactionParameters = {
            from: window.userWalletAddress,
            value: amountInWei,
            gas: web3.utils.toHex(200000)
        };
        
        // אם נוספה הודעה ואפשר לצרף אותה לעסקה
        if (message) {
            // אפשרות להוסיף את ההודעה כנתונים נוספים, אם החוזה תומך בכך
            // transactionParameters.data = web3.utils.utf8ToHex(message);
            console.log('Message included:', message);
        }
        
        // קריאה לפונקציית התרומה בחוזה
        const result = await contract.methods.donate(region).send(transactionParameters);

        console.log('Transaction result:', result);
        return result.transactionHash;

    } catch (error) {
        console.error('Error in donateToBlockchain:', error);
        
        // טיפול בשגיאות ספציפיות של MetaMask
        if (error.code === 4001) {
            throw new Error('העסקה בוטלה על ידי המשתמש');
        } else if (error.message.includes('insufficient funds')) {
            throw new Error('אין מספיק כספים בארנק לביצוע העסקה');
        } else {
            throw new Error(error.message || 'שגיאה בביצוע התרומה');
        }
    }
}

window.onload = () => {
    const token = localStorage.getItem('token');
    const userMenu = document.getElementById('userMenu');

    if (token) {
        // כאן תוכלי לשלוף שם משתמש מהטוקן אם את רוצה (פענוח JWT)
        userMenu.innerHTML = `
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    } else {
        userMenu.innerHTML = `
            <li><a href="#" onclick="showSection('login')">Login / Register</a></li>
        `;
    }

    showSection("home");
    showSection("donate");
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
        console.log("Convert button clicked");
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
