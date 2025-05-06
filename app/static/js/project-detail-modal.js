// project-detail-modal.js
// מודול זה מאפשר תצוגה מפורטת של פרטי פרויקט עם טופס תרומה משולב

// כאשר העמוד נטען, נאתחל את המערכת
document.addEventListener('DOMContentLoaded', function() {
    // נאתחל את מערכת תצוגת פרטי הפרויקט
    initProjectDetailModal();
});

function initProjectDetailModal() {
    if (window.projectModalInitialized) {
        console.log("מודאל פרטי פרויקט כבר אותחל, מדלג על אתחול נוסף");
        return;
    }
    console.log("מאתחל מערכת תצוגת פרטי פרויקט");
    window.projectModalInitialized = true;
    
    // יוצר את המודל אם הוא לא קיים
    let projectDetailModal = document.getElementById('projectDetailModal');
    if (!projectDetailModal) {
        projectDetailModal = document.createElement('div');
        projectDetailModal.id = 'projectDetailModal';
        projectDetailModal.className = 'modal project-detail-modal';
        document.body.appendChild(projectDetailModal);
        
        // מגדיר את מבנה ה-HTML של המודל
        projectDetailModal.innerHTML = `
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3 id="projectDetailTitle">פרטי הפרויקט</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="project-detail-container">
                        <div class="project-detail-content">
                            <!-- מידע על הפרויקט יוצג כאן -->
                            <div id="projectDetailInfo"></div>
                        </div>
                        <div class="project-detail-sidebar">
                            <!-- טופס התרומה יוצג כאן -->
                            <div id="projectDonationForm"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // מוסיף מאזין אירועים לכפתור הסגירה
        const closeButton = projectDetailModal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            hideModal(projectDetailModal);
        });
        
        // מוסיף מאזין אירועים לסגירה בלחיצה מחוץ למודל
        projectDetailModal.addEventListener('click', (event) => {
            if (event.target === projectDetailModal) {
                hideModal(projectDetailModal);
            }
        });
    }
    
    // מוסיף מאזיני אירועים לכפתורי בחירת הפרויקט
    setupProjectSelectionListeners();
    
    // מוסיף סגנונות CSS למודל פרטי הפרויקט
    addProjectDetailStyles();
}

// מוסיף סגנונות CSS למודל פרטי הפרויקט
function addProjectDetailStyles() {
    // בודק אם סגנונות כבר קיימים
    if (document.getElementById('project-detail-styles')) {
        return;
    }
    
    // יוצר אלמנט סגנון
    const styleElement = document.createElement('style');
    styleElement.id = 'project-detail-styles';
    
    // מגדיר את הסגנונות
    styleElement.textContent = `
        /* סגנונות למודל פרטי הפרויקט */
        .project-detail-modal .modal-content {
            max-width: 900px;
            height: 80vh;
            max-height: 700px;
            display: flex;
            flex-direction: column;
        }
        
        .project-detail-container {
            display: flex;
            flex-direction: row;
            height: 100%;
            overflow: hidden;
        }
        
        .project-detail-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .project-detail-sidebar {
            width: 320px;
            background-color: var(--card-bg);
            border-left: 1px solid var(--border-color);
            padding: 20px;
            overflow-y: auto;
        }
        
        .project-detail-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .project-detail-badge.south {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .project-detail-badge.north {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        .project-detail-description {
            margin-bottom: 2rem;
        }
        
        .project-detail-description h4,
        .project-detail-progress h4,
        .project-detail-contact h4 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.8rem;
            color: var(--primary-color);
        }
        
        .project-detail-progress {
            margin-bottom: 2rem;
        }
        
        .project-donation-form {
            padding-bottom: 1rem;
        }
        
        .project-donation-form h4 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1.2rem;
            color: var(--primary-color);
        }
        
        .wallet-connection-required {
            text-align: center;
            padding: 1rem;
            margin-bottom: 1rem;
            background-color: rgba(79, 70, 229, 0.1);
            border-radius: var(--border-radius);
        }
        
        .donation-quick-amounts {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.8rem;
            margin-bottom: 1rem;
        }
        
        .quick-amount-btn {
            padding: 0.5rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(79, 70, 229, 0.1);
            color: var(--primary-color);
            font-size: 0.9rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .quick-amount-btn:hover {
            background-color: rgba(79, 70, 229, 0.2);
        }
        
        .quick-amount-btn.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        /* תמיכה בדארק מוד */
        .dark-theme .project-detail-sidebar {
            background-color: #1e293b;
            border-color: #334155;
        }
        
        .dark-theme .wallet-connection-required {
            background-color: rgba(79, 70, 229, 0.2);
        }
        
        /* תמיכה ב-RTL */
        [dir="rtl"] .project-detail-sidebar {
            border-left: none;
            border-right: 1px solid var(--border-color);
        }
        
        /* התאמות תצוגה למסכים קטנים */
        @media (max-width: 768px) {
            .project-detail-container {
                flex-direction: column;
            }
            
            .project-detail-sidebar {
                width: 100%;
                border-left: none;
                border-top: 1px solid var(--border-color);
            }
            
            [dir="rtl"] .project-detail-sidebar {
                border-right: none;
                border-top: 1px solid var(--border-color);
            }
        }
    `;
    
    // מוסיף את הסגנונות למסמך
    document.head.appendChild(styleElement);
}

// מוסיף מאזיני אירועים לכפתורי בחירת הפרויקט
function setupProjectSelectionListeners() {
    // מוסיף מאזיני אירועים לכפתורי בחירת הפרויקט בטעינה הראשונית
    addProjectButtonListeners();
    
    // מוסיף מאזין למוטציות ב-DOM כדי להוסיף מאזינים לכפתורים חדשים שמתווספים
    const projectsObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // כאשר נוספים אלמנטים חדשים, מוסיף מאזיני אירועים לכפתורים
                addProjectButtonListeners();
            }
        });
    });
    
    // מתחיל לעקוב אחרי שינויים במיכל הפרויקטים
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    if (projectsCarousel) {
        projectsObserver.observe(projectsCarousel, {
            childList: true,
            subtree: true
        });
    }
}

// מוסיף מאזיני אירועים לכפתורי בחירת הפרויקט
function addProjectButtonListeners() {
    const selectButtons = document.querySelectorAll('.project-select-btn');
    
    selectButtons.forEach(function(button) {
        // מסיר מאזיני אירועים קיימים כדי למנוע כפילויות
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // מוסיף מאזין אירועים חדש
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // מאתר את הפרויקט המתאים
            const projectSlide = this.closest('.project-slide');
            if (!projectSlide) return;
            
            // מחלץ מידע על הפרויקט
            const projectId = projectSlide.dataset.projectId;
            const projectTitle = projectSlide.dataset.projectTitle;
            const projectDescription = projectSlide.querySelector('.project-description')?.textContent;
            const projectRegion = projectSlide.dataset.projectRegion;
            
            // מחלץ מידע על ההתקדמות
            const progressFill = projectSlide.querySelector('.progress-fill');
            const progressPercent = progressFill ? 
                parseInt(progressFill.style.width.replace('%', '')) : 0;
            
            const progressStats = projectSlide.querySelector('.progress-stats');
            const progressText = progressStats ? progressStats.textContent : '';
            
            // מחלץ את הסכומים מהטקסט
            let currentAmount = 0;
            let goalAmount = 0;
            
            if (progressText) {
                const amountMatch = progressText.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
                if (amountMatch && amountMatch.length >= 3) {
                    currentAmount = parseFloat(amountMatch[1]);
                    goalAmount = parseFloat(amountMatch[2]);
                }
            }
            
            // יוצר אובייקט פרויקט
            const project = {
                id: projectId,
                title: projectTitle,
                description: projectDescription,
                region: projectRegion,
                currentAmount: currentAmount,
                goalAmount: goalAmount,
                progressPercent: progressPercent
            };
            
            // מציג את פרטי הפרויקט
            showProjectDetails(project);
        });
    });
}

// מציג את פרטי הפרויקט במודל
function showProjectDetails(project) {
    console.log("מציג פרטי פרויקט:", project);

    // הוספת שדה ethereum_address אם חסר
    if (!project.ethereum_address) {
        project.ethereum_address = '';
        console.warn("הפרויקט חסר כתובת ארנק, הוספנו שדה ריק:", project);
    }
    // מאתר את המודל
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;
    
    // מעדכן את הכותרת
    const titleElement = modal.querySelector('#projectDetailTitle');
    if (titleElement) {
        titleElement.textContent = project.title;
    }
    
    // מציג את פרטי הפרויקט
    const detailsContainer = modal.querySelector('#projectDetailInfo');
    if (detailsContainer) {
        // מחלץ את שם האזור לפי השפה הנוכחית
        const regionText = project.region === 'south' ? 'אזור הדרום' : 'אזור הצפון';
        
        // עדכון תוכן המידע על הפרויקט
        detailsContainer.innerHTML = `
            <div class="project-detail-badge ${project.region}">
                ${regionText}
            </div>
            
            <div class="project-detail-description">
                <h4>תיאור הפרויקט</h4>
                <p>${project.description}</p>
            </div>
            
            <div class="project-detail-progress">
                <h4>התקדמות המימון</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progressPercent}%"></div>
                </div>
                <div class="progress-stats">
                    <span>${project.currentAmount} / ${project.goalAmount} ETH</span>
                    <span>${project.progressPercent}%</span>
                </div>
            </div>
        `;
    }
    
    // מעדכן את טופס התרומה
    const donationFormContainer = modal.querySelector('#projectDonationForm');
    if (donationFormContainer) {
        setupProjectDonationForm(donationFormContainer, project);
    }
    
    // מציג את המודל
    showModal(modal);
}

// מגדיר את טופס התרומה לפרויקט
function setupProjectDonationForm(container, project) {
    // בודק אם הארנק מחובר
    const isWalletConnected = window.userWalletAddress !== null;
    
    // מגדיר את תוכן טופס התרומה
    container.innerHTML = `
        <div class="project-donation-form">
            <h4>תרומה לפרויקט זה</h4>
            
            ${!isWalletConnected ? `
                <div class="wallet-connection-required">
                    <p>עליך לחבר ארנק כדי לתרום</p>
                    <button id="projectConnectWalletBtn" class="btn btn-primary">
                        <i class="fas fa-link"></i> 
                        <span>חבר ארנק</span>
                    </button>
                </div>
            ` : `
                <form id="projectDonationSubmitForm">
                    <div class="form-group">
                        <label for="projectDonationAmount">סכום התרומה (ETH):</label>
                        <div class="amount-input-group">
                            <div class="amount-prefix">ETH</div>
                            <input type="number" id="projectDonationAmount" min="0.01" step="0.01" value="0.1" required>
                        </div>
                        
                        <div class="donation-quick-amounts">
                            <button type="button" class="quick-amount-btn" data-amount="0.01">0.01</button>
                            <button type="button" class="quick-amount-btn" data-amount="0.05">0.05</button>
                            <button type="button" class="quick-amount-btn active" data-amount="0.1">0.1</button>
                            <button type="button" class="quick-amount-btn" data-amount="0.5">0.5</button>
                            <button type="button" class="quick-amount-btn" data-amount="1.0">1.0</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectDonationMessage">הודעה (אופציונלי):</label>
                        <textarea id="projectDonationMessage" rows="3" placeholder="הודעת תמיכה אישית..."></textarea>
                        <small>הודעה זו תישמר בבלוקצ'יין</small>
                    </div>
                    
                    <div class="donation-summary">
                        <h4>סיכום התרומה</h4>
                        <div class="summary-row">
                            <span>פרויקט נבחר:</span>
                            <span id="summaryProjectTitle">${project.title}</span>
                        </div>
                        <div class="summary-row">
                            <span>סכום התרומה:</span>
                            <span id="summaryProjectAmount">0.1 ETH</span>
                        </div>
                        <div class="summary-row">
                            <span>עמלת גז משוערת:</span>
                            <span>~ 0.001 ETH</span>
                        </div>
                        <div class="summary-row total">
                            <span>סה"כ:</span>
                            <span id="summaryProjectTotal">0.101 ETH</span>
                        </div>
                    
                    <button type="submit" class="donate-button btn-primary btn-block">
                        <i class="fas fa-heart"></i> תרום עכשיו
                    </button>
                </form>
            `}
        </div>
    `;
    
    // מוסיף מאזיני אירועים לרכיבים בטופס
    if (!isWalletConnected) {
        // מאזין לכפתור חיבור הארנק
        const connectWalletBtn = container.querySelector('#projectConnectWalletBtn');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', function() {
                // קורא לפונקציית חיבור הארנק הקיימת במערכת
                if (typeof connectWallet === 'function') {
                    connectWallet().then(() => {
                        // לאחר חיבור מוצלח, מעדכן את הטופס
                        if (window.userWalletAddress) {
                            setupProjectDonationForm(container, project);
                        }
                    });
                }
            });
        }
    } else {
        // מאזין לכפתורי סכום מהיר
        const quickAmountButtons = container.querySelectorAll('.quick-amount-btn');
        const amountInput = container.querySelector('#projectDonationAmount');
        const summaryAmount = container.querySelector('#summaryProjectAmount');
        const summaryTotal = container.querySelector('#summaryProjectTotal');
        
        if (quickAmountButtons.length && amountInput) {
            quickAmountButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    // מעדכן את הסכום המבוקש
                    const amount = parseFloat(this.dataset.amount);
                    amountInput.value = amount;
                    
                    // מעדכן את הסטייל של הכפתורים
                    quickAmountButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // מעדכן את סיכום התרומה
                    updateDonationSummary(amountInput, summaryAmount, summaryTotal);
                });
            });
            
            // מאזין לשינויים בשדה הסכום
            amountInput.addEventListener('input', function() {
                // מעדכן את סיכום התרומה
                updateDonationSummary(amountInput, summaryAmount, summaryTotal);
                
                // מעדכן את הסטייל של הכפתורים
                const currentAmount = parseFloat(this.value);
                quickAmountButtons.forEach(btn => {
                    const btnAmount = parseFloat(btn.dataset.amount);
                    if (Math.abs(currentAmount - btnAmount) < 0.001) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            });
            
            // מעדכן את סיכום התרומה פעם ראשונה
            updateDonationSummary(amountInput, summaryAmount, summaryTotal);
        }
        
        // מאזין לשליחת טופס התרומה

        if (project.location_lat && project.location_lng && 
            parseFloat(project.location_lat) !== 0 && parseFloat(project.location_lng) !== 0) {
            donationForm.insertAdjacentHTML('beforeend', `
                <button type="button" class="btn btn-outline btn-sm view-on-map-btn" 
                        onclick="viewProjectOnMap('${project.id || project._id}', ${project.location_lat}, ${project.location_lng})">
                    <i class="fas fa-map-marked-alt"></i> צפייה במפה
                </button>
            `);
        }
        const donationForm = container.querySelector('#projectDonationSubmitForm');
        if (donationForm) {
            donationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // אוסף נתונים מהטופס
                const amount = parseFloat(amountInput.value);
                const message = container.querySelector('#projectDonationMessage').value;
                
                // מבצע את התרומה
                processDonationToProject(project, amount, message);
            });
        }
    }
}


// פונקציה להערכת עלויות גז בזמן אמת
async function estimateGasFee(project, amount) {
    try {
        // חיבור לחוזה החכם
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
            window.CONTRACT_ABI, 
            window.CONTRACT_ADDRESS
        );
        
        // המרת הסכום ל-wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        // הערכת הגז הנדרש
        const estimatedGas = await contract.methods.donate(project.region)
            .estimateGas({
                from: window.userWalletAddress,
                value: amountInWei
            });
        
        // קבלת מחיר הגז הנוכחי ברשת
        const gasPrice = await web3.eth.getGasPrice();
        
        // חישוב העלות הכוללת
        const gasCost = web3.utils.toBN(estimatedGas).mul(web3.utils.toBN(gasPrice));
        const gasCostInEther = parseFloat(web3.utils.fromWei(gasCost, 'ether'));
        
        return gasCostInEther;
    } catch (error) {
        console.error("שגיאה בהערכת עלות הגז:", error);
        // במקרה של שגיאה, החזר ערך ברירת מחדל
        return 0.001;
    }
}

// מעדכן את סיכום התרומה
async function updateDonationSummary(amountInput, summaryAmount, summaryTotal) {
    if (!amountInput || !summaryAmount || !summaryTotal) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const project = {
        region: selectedRegion // משתנה גלובלי שמכיל את האזור הנבחר
    };
    const gasFee = await estimateGasFee(project, amount);
    const total = amount + gasFee;
    
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    const summaryGasFee = document.getElementById('summaryGasFee');
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(6)} ETH`;
    summaryTotal.textContent = `${total.toFixed(6)} ETH`;
}

// מבצע תרומה לפרויקט ספציפי
async function processDonationToProject(project, amount, message) {
    try {
        // מציג הודעת עיבוד
        showNotification('info', 'מעבד את התרומה שלך...');
        
        // מציג חיווי טעינה בכפתור
        const submitButton = document.querySelector('#projectDonationSubmitForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> מעבד...';
        }
        
        // בדיקה שהארנק של הפרויקט קיים
        if (!project.ethereum_address) {
            console.warn("לא נמצאה כתובת ארנק לפרויקט זה, ננסה לבצע תרומה לאזור", project);
            
            // אם אין כתובת ארנק לפרויקט, ננסה לבצע תרומה לאזור
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(
                window.CONTRACT_ABI, 
                window.CONTRACT_ADDRESS
            );
            
            // המרת הסכום ל-wei
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
            
            // קריאה לפונקציית donate הרגילה לאזור
            const txHash = await contract.methods.donate(project.region).send({
                from: window.userWalletAddress,
                value: amountInWei,
                gas: 200000
            });
            
            // עדכון הפרויקט בבסיס הנתונים
            try {
                const token = localStorage.getItem('token');
                const updateResponse = await fetch(`/projects/${project.id}/update-donation`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount,
                        txHash: txHash.transactionHash,
                        message: message
                    })
                });
                
                if (!updateResponse.ok) {
                    console.warn('התרומה נרשמה בבלוקצ\'יין אך לא עודכנה במסד הנתונים');
                }
            } catch (updateError) {
                console.warn('שגיאה בעדכון הפרויקט:', updateError);
            }
            
            // מציג הודעת הצלחה
            showNotification('success', 
                `התרומה בוצעה בהצלחה לאזור ${project.region}! ${txHash.transactionHash ? `Transaction: ${txHash.transactionHash.substring(0, 10)}...` : ''}`
            );
            
            // const hideModalAndReload = function() {
            //     // סגירת המודל
            //     const modal = document.getElementById('projectDetailModal');
            //     if (modal) {
            //         hideModal(modal);
            //     }
                
            //     // ניסיון לטעון מחדש פרויקטים, אך טיפול בשגיאות
            //     try {
            //         // בדיקה אם אנחנו בדף התרומה לפני טעינה מחדש
            //         const donateSection = document.getElementById('donate');
            //         if (donateSection && donateSection.classList.contains('active')) {
            //             if (typeof manuallyLoadProjects === 'function') {
            //                 console.log("טוען מחדש פרויקטים לאחר תרומה");
            //                 setTimeout(() => {
            //                     manuallyLoadProjects();
            //                 }, 1000); // הוספת השהיה כדי להבטיח שה-DOM מוכן
            //             }
            //         } else {
            //             console.log("לא בדף התרומה, מדלג על טעינה מחדש");
            //         }
            //     } catch (error) {
            //         console.warn("שגיאה בזמן טעינה מחדש לאחר תרומה:", error);
            //         // המשך ביצוע גם אם הטעינה מחדש נכשלת
            //     }
            // };
            
            // // קובע רק setTimeout אחד
            // setTimeout(hideModalAndReload, 2000);
            
            // return;
        }
        
        try {
            // ביצוע תרומה ישירה דרך בלוקצ'יין או דרך החוזה החכם
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(
                window.CONTRACT_ABI, 
                window.CONTRACT_ADDRESS
            );
            
            // המרת הסכום ל-wei
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
            
            let txHash;
            
            // בדיקה אם הפרויקט רשום בחוזה החכם
            // try {
            //     // אנחנו מנסים לקרוא את פרטי הפרויקט מהחוזה
            //     const projectId = project.id || project._id;
            //     const projectDetails = await contract.methods.getProjectDetails(projectId).call().catch(() => null);
                
            //     if (projectDetails && projectDetails[3]) { // הערך הרביעי הוא exists
            //         // אם הפרויקט רשום בחוזה, נשתמש בפונקציית donateToProject
            //         console.log('Project exists in contract, using donateToProject');
            //         txHash = await contract.methods.donateToProject(projectId).send({
            //             from: window.userWalletAddress,
            //             value: amountInWei,
            //             gas: 200000
            //         });
            //     } else {
            //         // אם הפרויקט לא רשום בחוזה, נבצע תרומה ישירה לכתובת הארנק של הפרויקט
            //         console.log('Project not registered in contract, sending directly to beneficiary');
                    
            //         txHash = await web3.eth.sendTransaction({
            //             from: window.userWalletAddress,
            //             to: project.ethereum_address,
            //             value: amountInWei,
            //             gas: 21000
            //         });
                    
            //         // נעדכן גם את מאזן האזור בחוזה החכם
            //         try {
            //             await contract.methods.donate(project.region).send({
            //                 from: window.userWalletAddress,
            //                 value: 0, // תרומה סמלית של 0 רק לעדכון הנתונים
            //                 gas: 100000
            //             });
            //         } catch (regionError) {
            //             console.warn('שגיאה בעדכון מאזן האזור בחוזה:', regionError);
            //         }
            //     }
                
            //     // עדכון הפרויקט בבסיס הנתונים
            //     const token = localStorage.getItem('token');
            //     const updateResponse = await fetch(`/projects/${projectId}/update-donation`, {
            //         method: 'POST',
            //         headers: {
            //             'Authorization': token ? `Bearer ${token}` : '',
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             amount: amount,
            //             txHash: txHash.transactionHash || txHash,
            //             message: message
            //         })
            //     });
                
            //     if (!updateResponse.ok) {
            //         console.warn('התרומה נרשמה בבלוקצ\'יין אך לא עודכנה במסד הנתונים');
            //     }
                
            //     // מציג הודעת הצלחה
            //     showNotification('success', 
            //         `התרומה בוצעה בהצלחה! ${txHash.transactionHash ? `Transaction: ${txHash.transactionHash.substring(0, 10)}...` : ''}`
            //     );
                
            // } catch (contractError) {
            //     console.warn('שגיאה בחוזה החכם, מתבצעת תרומה ישירה:', contractError);
                
            //     // אם יש שגיאה בחוזה החכם, ננסה לבצע תרומה ישירה
            //     const txResult = await web3.eth.sendTransaction({
            //         from: window.userWalletAddress,
            //         to: project.ethereum_address,
            //         value: amountInWei,
            //         gas: 21000
            //     });
                
            //     // עדכון הפרויקט בבסיס הנתונים
            //     const token = localStorage.getItem('token');
            //     const projectId = project.id || project._id;
            //     const updateResponse = await fetch(`/projects/${projectId}/update-donation`, {
            //         method: 'POST',
            //         headers: {
            //             'Authorization': token ? `Bearer ${token}` : '',
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             amount: amount,
            //             txHash: txResult.transactionHash,
            //             message: message
            //         })
            //     });
                
            //     if (!updateResponse.ok) {
            //         console.warn('התרומה נרשמה בבלוקצ\'יין אך לא עודכנה במסד הנתונים');
            //     }
                
            //     // מציג הודעת הצלחה
            //     showNotification('success', 
            //         `התרומה בוצעה בהצלחה באופן ישיר! ${txResult.transactionHash ? `Transaction: ${txResult.transactionHash.substring(0, 10)}...` : ''}`
            //     );
            // }
            
            // סגירת המודל והטענה מחדש של הפרויקטים
            setTimeout(() => {
                const modal = document.getElementById('projectDetailModal');
                if (modal) {
                    hideModal(modal);
                }
                
                if (typeof manuallyLoadProjects === 'function') {
                    manuallyLoadProjects();
                }
            }, 2000);
            
        } catch (error) {
            throw error;
        }
        
    } catch (error) {
        console.error('שגיאה בביצוע התרומה:', error);
        showNotification('error', error.message || 'שגיאה בביצוע התרומה');
        
        // מחזיר את הכפתור למצב הרגיל
        const submitButton = document.querySelector('#projectDonationSubmitForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = `<i class="fas fa-heart"></i> תרום עכשיו`;
        }
    }
}

window.showProjectDetails = showProjectDetails;

window.viewProjectOnMap = function(projectId, lat, lng) {
    // מעבר לעמוד המפה
    showSection('map');
    
    // מחכים שהמפה תיטען
    setTimeout(() => {
        if (mapInstance) {
            // התמקדות במיקום הפרויקט
            mapInstance.setView([lat, lng], 15);
            
            // חיפוש הסמן המתאים ופתיחת החלון הקופץ
            projectMarkers.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                if (Math.abs(markerLatLng.lat - lat) < 0.0001 && 
                    Math.abs(markerLatLng.lng - lng) < 0.0001) {
                    marker.openPopup();
                }
            });
        }
    }, 500);
};