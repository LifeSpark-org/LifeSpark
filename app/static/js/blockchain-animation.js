// Blockchain Animation JavaScript - Improved Simplified Version
document.addEventListener('DOMContentLoaded', function() {
    // וודא שהקוד מופעל רק בעמוד האודות כאשר האלמנט קיים
    if (!document.getElementById('blockchain-animation')) return;
    
    const svg = document.getElementById('blockchain-animation');
    const prevBtn = document.getElementById('prev-step');
    const playPauseBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next-step');
    const stepDescription = document.getElementById('step-description');
    
    // מידע על השלבים השונים
    const steps = [
        {
            title: "שלב 1: בחירת פרויקט לתרומה",
            description: "המשתמש בוחר פרויקט דרך אתר lifeSpark ומחליט כמה לתרום. האתר מתחבר לארנק הדיגיטלי באופן מאובטח.",
            animation: "showDonor"
        },
        {
            title: "שלב 2: יצירת עסקת תרומה",
            description: "לחיצה על 'תרום' מייצרת עסקה דיגיטלית המכילה את פרטי התרומה - מי תורם, למי, וכמה. העסקה נחתמת דיגיטלית בארנק שלך.",
            animation: "sendDonation"
        },
        {
            title: "שלב 3: אימות התרומה ברשת",
            description: "העסקה נשלחת לרשת הבלוקצ'יין, שם מחשבים רבים מאמתים אותה באופן אוטומטי ומאשרים את תקינותה.",
            animation: "validateDonation"
        },
        {
            title: "שלב 4: רישום בספר החשבונות המשותף",
            description: "לאחר האימות, התרומה נרשמת בבלוק חדש ומתווספת לשרשרת הבלוקים - רשומה קבועה שלא ניתן לשנות או לזייף.",
            animation: "recordDonation"
        },
        {
            title: "שלב 5: קבלת התרומה אצל המוטב",
            description: "התרומה מגיעה ישירות לארנק הדיגיטלי של המוטב (הפרויקט) ללא צורך במתווכים, עם עמלות נמוכות ובזמן אמת.",
            animation: "receiveDonation"
        },
        {
            title: "שלב 6: שקיפות ומעקב מתמשך",
            description: "כל אחד יכול לראות את כל פרטי העסקה - מתי בוצעה, מי תרם, כמה וְלמי. המידע שקוף לחלוטין ולא ניתן לשינוי.",
            animation: "showTransparency"
        }
    ];
    
    let currentStep = 0;
    let isPlaying = false;
    let animationInterval;
    
    // צייר את האנימציה הראשונית
    initializeAnimation();
    updateStep(0);
    
    // הגדרת האזנה לאירועים
    prevBtn.addEventListener('click', () => {
        pauseAnimation();
        updateStep(Math.max(0, currentStep - 1));
    });
    
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    nextBtn.addEventListener('click', () => {
        pauseAnimation();
        updateStep(Math.min(steps.length - 1, currentStep + 1));
    });
    
    function togglePlayPause() {
        if (isPlaying) {
            pauseAnimation();
        } else {
            playAnimation();
        }
    }
    
    function playAnimation() {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        animationInterval = setInterval(() => {
            currentStep = (currentStep + 1) % steps.length;
            updateStep(currentStep);
            
            // אם הגענו לסוף, נעצור את האנימציה
            if (currentStep === steps.length - 1) {
                setTimeout(() => {
                    pauseAnimation();
                }, 2000);
            }
        }, 5000); // החלף שלב כל 5 שניות
    }
    
    function pauseAnimation() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(animationInterval);
    }
    
    function updateStep(stepIndex) {
        currentStep = stepIndex;
        
        // עדכון התיאור
        stepDescription.innerHTML = `<strong>${steps[stepIndex].title}</strong><br>${steps[stepIndex].description}`;
        
        // עדכון מצב האנימציה
        resetAnimation();
        const animationFunction = steps[stepIndex].animation;
        if (typeof window[animationFunction] === 'function') {
            window[animationFunction]();
        } else {
            // אם לא קיימת פונקציה ספציפית, הפעל את הפונקציה דרך הקוד הנוכחי
            switch(animationFunction) {
                case "showDonor":
                    showDonor();
                    break;
                case "sendDonation":
                    sendDonation();
                    break;
                case "validateDonation":
                    validateDonation();
                    break;
                case "recordDonation":
                    recordDonation();
                    break;
                case "receiveDonation": 
                    receiveDonation();
                    break;
                case "showTransparency":
                    showTransparency();
                    break;
            }
        }
        
        // עדכון כפתורי הניווט
        prevBtn.disabled = stepIndex === 0;
        nextBtn.disabled = stepIndex === steps.length - 1;
    }
    
    function initializeAnimation() {
        // יצירת הגרפיקה הבסיסית של האנימציה - גרסה משופרת
        svg.innerHTML = `
            <!-- רקע מדורג לתצוגה -->
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="blockchainBg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#c7d2fe;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#a5b4fc;stop-opacity:0.6" />
                </linearGradient>
                <!-- נתיב התנועה של המטבע -->
                <path id="donationPath" d="M100,80 Q 250,20 400,100 Q 550,180 700,80" stroke="transparent" fill="none" />
            </defs>
            
            <!-- רקע כללי -->
            <rect width="800" height="400" fill="url(#bgGradient)" rx="10" />
            
            <!-- התורם -->
            <g class="donor" transform="translate(100, 80)">
                <circle class="donor-icon" cx="0" cy="0" r="40" fill="#3b82f6" />
                <text x="0" y="5" text-anchor="middle" fill="white" font-weight="bold" font-size="16">תורם</text>
                <g class="donor-wallet" transform="translate(0, 60)">
                    <rect x="-30" y="-20" width="60" height="40" rx="5" fill="#1d4ed8" />
                    <text x="0" y="5" text-anchor="middle" fill="white" font-size="14">ארנק</text>
                </g>
            </g>
            
            <!-- שרשרת הבלוקים -->
            <g class="blockchain" transform="translate(400, 200)">
                <rect class="blockchain-bg" x="-180" y="-70" width="360" height="140" rx="15" fill="url(#blockchainBg)" />
                <text x="0" y="-40" text-anchor="middle" font-weight="bold" fill="#4338ca" font-size="16">רשת הבלוקצ'יין</text>
                
                <g class="blocks" transform="translate(0, 10)">
                    <rect class="block block1" x="-135" y="-30" width="60" height="60" rx="8" fill="#10b981" stroke="#047857" stroke-width="2" />
                    <rect class="block block2" x="-65" y="-30" width="60" height="60" rx="8" fill="#10b981" stroke="#047857" stroke-width="2" />
                    <rect class="block block3" x="5" y="-30" width="60" height="60" rx="8" fill="#10b981" stroke="#047857" stroke-width="2" />
                    <rect class="block block4" x="75" y="-30" width="60" height="60" rx="8" fill="#10b981" stroke="#047857" stroke-width="2" opacity="0.5" />
                    
                    <!-- חיבורים בין הבלוקים -->
                    <line x1="-75" y1="0" x2="-65" y2="0" stroke="#047857" stroke-width="3" />
                    <line x1="-5" y1="0" x2="5" y2="0" stroke="#047857" stroke-width="3" />
                    <line x1="65" y1="0" x2="75" y2="0" stroke="#047857" stroke-width="3" />
                    
                    <!-- סמלים בתוך הבלוקים -->
                    <text x="-105" y="5" text-anchor="middle" fill="white" font-size="14">#1</text>
                    <text x="-35" y="5" text-anchor="middle" fill="white" font-size="14">#2</text>
                    <text x="35" y="5" text-anchor="middle" fill="white" font-size="14">#3</text>
                    <text x="105" y="5" text-anchor="middle" fill="white" font-size="14">#4</text>
                </g>
                
                <!-- צמתים (מחשבים) ברשת -->
                <g class="nodes">
                    <circle class="node node1" cx="-120" cy="-50" r="8" fill="#8b5cf6" />
                    <circle class="node node2" cx="-80" cy="-55" r="8" fill="#8b5cf6" />
                    <circle class="node node3" cx="-40" cy="-50" r="8" fill="#8b5cf6" />
                    <circle class="node node4" cx="0" cy="-55" r="8" fill="#8b5cf6" />
                    <circle class="node node5" cx="40" cy="-50" r="8" fill="#8b5cf6" />
                    <circle class="node node6" cx="80" cy="-55" r="8" fill="#8b5cf6" />
                    <circle class="node node7" cx="120" cy="-50" r="8" fill="#8b5cf6" />
                </g>
            </g>
            
            <!-- המוטב -->
            <g class="beneficiary" transform="translate(700, 80)">
                <circle class="beneficiary-icon" cx="0" cy="0" r="40" fill="#ef4444" />
                <text x="0" y="5" text-anchor="middle" fill="white" font-weight="bold" font-size="16">מוטב</text>
                <g class="beneficiary-wallet" transform="translate(0, 60)">
                    <rect x="-30" y="-20" width="60" height="40" rx="5" fill="#b91c1c" />
                    <text x="0" y="5" text-anchor="middle" fill="white" font-size="14">ארנק</text>
                </g>
            </g>
            
            <!-- האתר שלנו -->
            <g class="website" transform="translate(250, 80)">
                <rect x="-40" y="-25" width="80" height="50" rx="5" fill="#0284c7" />
                <text x="0" y="5" text-anchor="middle" fill="white" font-size="14">LifeSpark</text>
                <path d="M0,25 L0,40" stroke="#0284c7" stroke-width="2" />
            </g>
            
            <!-- המטבע/עסקה - יזוז לאורך הנתיב כיחידה אחת -->
            <g class="donation-transaction" opacity="0">
                <g class="coin-with-symbol">
                    <circle class="donation-coin" cx="0" cy="0" r="18" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
                    <text class="coin-text" x="0" y="5" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="18">$</text>
                </g>
            </g>

            <!-- אייקון שקיפות -->
            <g class="transparency-icon" transform="translate(400, 320)" opacity="0">
                <circle cx="0" cy="0" r="30" fill="#0ea5e9" />
                <g transform="translate(0, 0)">
                    <rect x="-15" y="-15" width="30" height="30" stroke="white" stroke-width="2" fill="none" rx="2" />
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="white" stroke-width="2" />
                    <line x1="-7" y1="7" x2="7" y2="7" stroke="white" stroke-width="2" />
                    <line x1="-7" y1="-7" x2="7" y2="-7" stroke="white" stroke-width="2" />
                </g>
            </g>

            <!-- הודעת אימות - תוקן המיקום -->
            <g class="verification-message" transform="translate(400, 150)" opacity="0">
                <rect x="-70" y="-20" width="140" height="40" rx="20" fill="#22c55e" />
                <text x="0" y="5" text-anchor="middle" fill="white" font-weight="bold">עסקה מאומתת ✓</text>
            </g>
            
            <!-- מטבעות קטנים שנופלים לתוך ארנק המוטב -->
            <g class="mini-coins" opacity="0">
                <circle class="mini-coin1" cx="700" cy="30" r="8" fill="#fbbf24" stroke="#b45309" stroke-width="1" />
                <circle class="mini-coin2" cx="720" cy="40" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="1" />
                <circle class="mini-coin3" cx="680" cy="50" r="7" fill="#fbbf24" stroke="#b45309" stroke-width="1" />
            </g>
            
            <!-- קו החיבור המקווקו -->
            <path class="dotted-line website-to-donor" d="M210,80 L140,80" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" display="none" />
            <path class="dotted-line donor-to-blockchain" d="M100,140 Q 250,220 250,200" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" display="none" />
            <path class="dotted-line blockchain-to-beneficiary" d="M550,200 Q 600,220 700,140" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" display="none" />
            
            <!-- אייקון העין לשקיפות ליד הבלוקצ'יין -->
            <g class="eye-icon" transform="translate(400, 280)" opacity="0">
                <circle cx="0" cy="0" r="15" fill="#f8fafc" stroke="#6366f1" stroke-width="2" />
                <circle cx="0" cy="0" r="5" fill="#6366f1" />
                <path d="M-20,0 C-15,-8 -8,-12 0,-12 C8,-12 15,-8 20,0 C15,8 8,12 0,12 C-8,12 -15,8 -20,0 Z" fill="none" stroke="#6366f1" stroke-width="2" />
            </g>
        `;
    }
    
    function resetAnimation() {
        // איפוס כל האלמנטים לשלב התחלתי
        const elements = svg.querySelectorAll('g, circle, rect, path, text, line');
        
        elements.forEach(el => {
            el.style.animation = '';
            el.style.opacity = el.classList.contains('block4') ? '0.5' : '1';
            el.style.filter = '';
            el.style.transform = '';
        });
        
        // איפוס מיקום המטבע/עסקה
        const transaction = svg.querySelector('.donation-transaction');
        transaction.style.opacity = '0';
        
        // הסתרת האלמנטים שאמורים להיות מוסתרים בהתחלה
        svg.querySelector('.transparency-icon').style.opacity = '0';
        svg.querySelector('.verification-message').style.opacity = '0';
        svg.querySelector('.mini-coins').style.opacity = '0';
        svg.querySelector('.eye-icon').style.opacity = '0';
        
        // הסתרת הקווים המקווקווים
        svg.querySelectorAll('.dotted-line').forEach(line => {
            line.style.display = 'none';
        });
    }
    
    // פונקציות האנימציה עבור כל שלב
    function showDonor() {
        // הפעלת אנימציה על התורם והאתר
        const donor = svg.querySelector('.donor-icon');
        const website = svg.querySelector('.website');
        
        donor.style.animation = 'pulse 1.5s infinite';
        website.style.animation = 'pulse 1.5s 0.5s infinite';
        
        // הצגת קו מקווקו בין האתר לתורם
        const line = svg.querySelector('.website-to-donor');
        line.style.display = 'block';
        
        // אפקט פייד אין לקו המקווקו
        setTimeout(() => {
            line.style.transition = 'opacity 1s';
            line.style.opacity = '1';
        }, 500);
    }
    
    function sendDonation() {
        // הדגשת הארנק של התורם
        const donorWallet = svg.querySelector('.donor-wallet');
        donorWallet.style.animation = 'pulse 1.5s infinite';
        
        // הצגת קו מקווקו מהתורם לבלוקצ'יין
        const line = svg.querySelector('.donor-to-blockchain');
        line.style.display = 'block';
        line.style.opacity = '1';
        
        // הצגת העסקה והתחלת תנועה
        const transaction = svg.querySelector('.donation-transaction');
        transaction.style.opacity = '1';
        
        // מיקום העסקה אצל התורם ותנועה על הנתיב
        moveTransactionAlongPath(transaction, 0, 0.4, 2000);
    }
    
    function validateDonation() {
        // הדגשת הבלוקצ'יין
        const blockchain = svg.querySelector('.blockchain-bg');
        blockchain.style.animation = 'highlight 1.5s infinite';
        
        // הדגשת הצמתים ברשת
        const nodes = svg.querySelectorAll('.node');
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.animation = 'pulse 1s';
                node.style.fill = '#7c3aed'; // צבע כהה יותר
                
                setTimeout(() => {
                    node.style.fill = '#8b5cf6'; // חזרה לצבע המקורי
                }, 300);
            }, index * 150);
        });
        
        // מיקום העסקה במרכז הבלוקצ'יין
        const transaction = svg.querySelector('.donation-transaction');
        transaction.style.opacity = '1';
        
        // הזזת העסקה לאמצע הרשת
        setTimeout(() => {
            transaction.style.transform = 'translate(400px, 200px)';
            transaction.style.transition = 'transform 1s ease-in-out';
            
            // הצגת הודעת אימות אחרי שהעסקה מגיעה
            setTimeout(() => {
                const verification = svg.querySelector('.verification-message');
                verification.style.opacity = '1';
                verification.style.animation = 'fadeIn 0.5s forwards';
                verification.style.zIndex = "10";
            }, 1000);
        }, 500);
    }
    
    function recordDonation() {
        // הדגשת הבלוק החדש שבו מתווספת העסקה
        const newBlock = svg.querySelector('.block4');
        newBlock.style.opacity = '1';
        newBlock.style.animation = 'pulse 1.5s infinite';
        
        // הנפשת מעבר העסקה לבלוק החדש
        const transaction = svg.querySelector('.donation-transaction');
        transaction.style.opacity = '1';
        
        // מיקום העסקה מעל הבלוק החדש
        setTimeout(() => {
            transaction.style.transform = 'translate(475px, 180px) scale(0.8)';
            transaction.style.transition = 'transform 1.5s ease-in-out';
            
            // הדגשת כל שרשרת הבלוקים אחרי שהעסקה נכנסת לבלוק
            setTimeout(() => {
                const blocks = svg.querySelectorAll('.block');
                blocks.forEach((block, index) => {
                    setTimeout(() => {
                        block.style.animation = 'pulse 1s';
                    }, index * 300);
                });
            }, 1500);
        }, 500);
    }
    
    function receiveDonation() {
        // הצגת קו מקווקו מהבלוקצ'יין למוטב
        const line = svg.querySelector('.blockchain-to-beneficiary');
        line.style.display = 'block';
        line.style.opacity = '1';
        
        // הנפשת המטבע מהבלוקצ'יין למוטב
        const transaction = svg.querySelector('.donation-transaction');
        transaction.style.opacity = '1';
        
        // מיקום העסקה ותנועה אל המוטב
        moveTransactionAlongPath(transaction, 0.6, 1, 2000);
        
        // הדגשת הארנק של המוטב
        setTimeout(() => {
            const beneficiaryWallet = svg.querySelector('.beneficiary-wallet');
            beneficiaryWallet.style.animation = 'pulse 1.5s infinite';
            
            // הצגת מטבעות קטנים שנופלים לארנק של המוטב
            const miniCoins = svg.querySelector('.mini-coins');
            miniCoins.style.opacity = '1';
            
            const coin1 = svg.querySelector('.mini-coin1');
            const coin2 = svg.querySelector('.mini-coin2');
            const coin3 = svg.querySelector('.mini-coin3');
            
            coin1.style.animation = 'fallDown 1s forwards';
            coin2.style.animation = 'fallDown 1s 0.3s forwards';
            coin3.style.animation = 'fallDown 1s 0.6s forwards';
            
            // הוספת CSS אנימציה לנפילת המטבעות
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes fallDown {
                    0% { transform: translateY(0) }
                    100% { transform: translateY(100px) }
                }
            `;
            document.head.appendChild(styleElement);
        }, 2000);
    }
    
    function showTransparency() {
        // הצגת אייקון השקיפות
        const transparencyIcon = svg.querySelector('.transparency-icon');
        transparencyIcon.style.opacity = '1';
        transparencyIcon.style.animation = 'pulse 1.5s infinite';
        
        // הצגת אייקון העין ליד הבלוקצ'יין
        const eyeIcon = svg.querySelector('.eye-icon');
        eyeIcon.style.opacity = '1';
        eyeIcon.style.animation = 'pulse 1.5s 0.5s infinite';
        
        // הדגשת הבלוקצ'יין
        const blockchain = svg.querySelector('.blockchain-bg');
        blockchain.style.animation = 'highlight 2s infinite';
        
        // הדגשת כל הבלוקים
        const blocks = svg.querySelectorAll('.block');
        blocks.forEach(block => {
            block.style.filter = 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.7))';
        });
        
        // הצגת קווים מקווקווים לכל הכיוונים
        svg.querySelectorAll('.dotted-line').forEach(line => {
            line.style.display = 'block';
            line.style.opacity = '1';
        });
    }
    
    // פונקציה עזר להזזת העסקה לאורך נתיב
    function moveTransactionAlongPath(element, startPos, endPos, duration) {
        const transaction = element;
        const svgPoint = svg.createSVGPoint();
        const path = svg.getElementById('donationPath');
        const coinWithSymbol = transaction.querySelector('.coin-with-symbol');
            if (coinWithSymbol) {
                coinWithSymbol.style.pointerEvents = 'none'; // מנע אינטראקציות שעלולות לשבור את האנימציה
            }
        // נקבע מיקום התחלתי
        if (startPos === 0) {
            const point = getPointAtPercent(path, startPos);
            transaction.style.transform = `translate(${point.x}px, ${point.y}px)`;
        }
        
        // מוסיף אנימציה
        setTimeout(() => {
            // מגדיר את האנימציה
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes moveAlongPath${startPos.toString().replace('.', '_')} {
                    from { offset-distance: ${startPos * 100}%; }
                    to { offset-distance: ${endPos * 100}%; }
                }
            `;
            document.head.appendChild(styleElement);
            
            // מעדכן את הסגנון של האלמנט
            transaction.style.offsetPath = `path('M100,80 Q 250,20 400,100 Q 550,180 700,80')`;
            transaction.style.offsetRotate = '0deg';
            transaction.style.offsetDistance = `${startPos * 100}%`;
            transaction.style.animation = `moveAlongPath${startPos.toString().replace('.', '_')} ${duration}ms forwards`;
        }, 100);
        
        // פונקציה עזר לקבלת נקודה על הנתיב לפי אחוז
        function getPointAtPercent(path, percent) {
            const length = path.getTotalLength();
            const point = path.getPointAtLength(length * percent);
            return point;
        }
    }
});