// משחק "עקוב אחר התרומה" - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // בדיקה אם המשחק נמצא בעמוד
    if (!document.getElementById('blockchain-tracker-game')) return;
    
    // נתונים של בלוקים לצורך המשחק
    const blockData = {
        '1057': {
            timestamp: '2025-05-11 14:52:10',
            hash: '0x8d7c6b5a4e3f2d1c0b9a8d7c6b5a4e3f2d1c0b9a',
            prevHash: '0x1a2b3c4d5e6f7890a1b2c3d4e5f6789012345678',
            size: '1.2 MB',
            txCount: 12,
            transactions: [
                { id: 'TX-7520', desc: 'תרומה לפרויקט מים נקיים, 150$' },
                { id: 'TX-7521', desc: 'תרומה לשיקום יערות, 300$' },
                { id: 'TX-7522', desc: 'רכישת ציוד רפואי, 450$' }
            ]
        },
        '1058': {
            timestamp: '2025-05-11 15:10:22',
            hash: '0x3e4f5d6c7b8a9012345678901234567890123456',
            prevHash: '0x8d7c6b5a4e3f2d1c0b9a8d7c6b5a4e3f2d1c0b9a',
            size: '0.9 MB',
            txCount: 8,
            transactions: [
                { id: 'TX-7523', desc: 'תרומה לחינוך בהודו, 250$' },
                { id: 'TX-7524', desc: 'רכישת מחשבים לבית ספר, 800$' },
                { id: 'TX-7525', desc: 'תרומה למחקר רפואי, 500$' }
            ]
        },
        '1059': {
            timestamp: '2025-05-11 15:47:35',
            hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
            prevHash: '0x3e4f5d6c7b8a9012345678901234567890123456',
            size: '1.5 MB',
            txCount: 15,
            transactions: [
                { id: 'TX-7526', desc: 'תרומה למקלט לחיות, 100$' },
                { id: 'TX-7527', desc: 'תרומה למאבק בשינוי אקלים, 450$' },
                { id: 'TX-7528', desc: 'רכישת ערכות עזרה ראשונה, 300$' },
                { id: 'TX-7529', desc: 'תרומה לבית ספר באתיופיה, 200$' },
                { id: 'TX-7530', desc: 'תרומה לבית ספר בהודו, 200$' }
            ]
        },
        '1060': {
            timestamp: '2025-05-11 16:05:18',
            hash: '0x2a3b4c5d6e7f8901a2b3c4d5e6f8901a2b3c4d5e',
            prevHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
            size: '1.1 MB',
            txCount: 10,
            transactions: [
                { id: 'TX-7531', desc: 'תרומה לפיתוח חיסון, 1000$' },
                { id: 'TX-7532', desc: 'רכישת ציוד לחקלאות, 750$' },
                { id: 'TX-7533', desc: 'תמיכה במיזם אנרגיה ירוקה, 500$' }
            ]
        },
        '1061': {
            timestamp: '2025-05-11 16:22:47',
            hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
            prevHash: '0x2a3b4c5d6e7f8901a2b3c4d5e6f8901a2b3c4d5e',
            size: '1.3 MB',
            txCount: 13,
            transactions: [
                { id: 'TX-7534', desc: 'תרומה למלגות סטודנטים, 700$' },
                { id: 'TX-7535', desc: 'תמיכה במרפאה בקניה, 450$' },
                { id: 'TX-7536', desc: 'סיוע לנפגעי אסון טבע, 1200$' }
            ]
        }
    };
    
    // אתחול המשחק
    initGame();
    
    function initGame() {
        // הוספת תוכן HTML למשחק
        const gameContainer = document.getElementById('blockchain-tracker-game');
        
        gameContainer.innerHTML = `
            <div class="game-header">
                <h1>משחק "עקוב אחר התרומה" 💸</h1>
            </div>
            
            <div class="game-description">
                <p>ברוכים הבאים למשחק "עקוב אחר התרומה"! כאן תוכלו ללמוד כיצד מערכת הבלוקצ'יין מאפשרת שקיפות מלאה ומעקב אחר תרומות. עליכם לעקוב אחר התרומה שלכם דרך שרשרת הבלוקים ולענות על שאלות בדרך כדי להבין כיצד המערכת הזו עובדת.</p>
            </div>

            <div class="game-content">
                <div class="game-progress">
                    <div class="progress-step active">
                        <div class="step-circle">1</div>
                        <div class="step-label">איתור עסקה</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">2</div>
                        <div class="step-label">מציאת הבלוק</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">3</div>
                        <div class="step-label">אימות</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">4</div>
                        <div class="step-label">מעקב משתמש</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">5</div>
                        <div class="step-label">סיום</div>
                    </div>
                </div>

                <div id="step1" class="game-step">
                    <h2>שלב 1: איתור העסקה שלנו</h2>
                    <p>התקבלה תרומה של 200$ לפרויקט "בית ספר חדש באתיופיה". כחלק ממערכת השקיפות שלנו, עליך לאתר את עסקת התרומה בין העסקאות הבאות. חפש את המספר הסידורי TX-7529.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" data-tx="TX-6281">
                            <h3>עסקה #TX-6281</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 350$</p>
                                <p><strong>מקור:</strong> ארנק 0x83a...f92e</p>
                                <p><strong>יעד:</strong> פרויקט מים נקיים</p>
                                <p><strong>זמן:</strong> 14:32:01</p>
                            </div>
                            <div class="transaction-hash">0x7c82b5c8f5a1e8b2a7d9b5c1e8f5a1e8b2a7d9b5</div>
                        </div>
                        
                        <div class="transaction-card" data-tx="TX-7529">
                            <h3>עסקה #TX-7529</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 200$</p>
                                <p><strong>מקור:</strong> ארנק 0x59f...d21c</p>
                                <p><strong>יעד:</strong> בית ספר באתיופיה</p>
                                <p><strong>זמן:</strong> 15:47:22</p>
                            </div>
                            <div class="transaction-hash">0x3f456a789c1d2e3f456a789c1d2e3f456a789c1d</div>
                        </div>
                        
                        <div class="transaction-card" data-tx="TX-7530">
                            <h3>עסקה #TX-7530</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 200$</p>
                                <p><strong>מקור:</strong> ארנק 0x71d...948f</p>
                                <p><strong>יעד:</strong> בית ספר בהודו</p>
                                <p><strong>זמן:</strong> 15:48:03</p>
                            </div>
                            <div class="transaction-hash">0x9d8c7b6a5e4f3d2c1b0a9d8c7b6a5e4f3d2c1b0a</div>
                        </div>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>למדנו: זיהוי עסקאות</h3>
                        <p>כל עסקה בבלוקצ'יין מקבלת מזהה ייחודי (כמו מס' TX-7529) וגם חתימה קריפטוגרפית (ה-hash). שניהם מאפשרים מעקב אחר העסקה בקלות. בניגוד למערכות סגורות, כל אחד יכול לחפש עסקה ולראות את פרטיה המלאים, מה שמבטיח שקיפות ובקרה ציבורית.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-step1" class="btn" disabled>המשך לשלב הבא</button>
                    </div>
                </div>
                
                <div id="step2" class="game-step" style="display:none;">
                    <h2>שלב 2: מציאת הבלוק המכיל את העסקה</h2>
                    <p>יופי! מצאת את העסקה שלנו. עכשיו עלינו לאתר באיזה בלוק בשרשרת הבלוקים היא נמצאת. לחץ על כל אחד מהבלוקים כדי לבדוק אילו עסקאות הם מכילים.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card selected">
                            <h3>עסקה #TX-7529</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 200$</p>
                                <p><strong>מקור:</strong> ארנק 0x59f...d21c</p>
                                <p><strong>יעד:</strong> בית ספר באתיופיה</p>
                                <p><strong>זמן:</strong> 15:47:22</p>
                            </div>
                            <div class="transaction-hash">0x3f456a789c1d2e3f456a789c1d2e3f456a789c1d</div>
                        </div>
                    </div>
                    
                    <div class="blockchain-display">
                        <p>שרשרת הבלוקים:</p>
                        <div class="blockchain-blocks">
                            <div class="block" data-block="1057" data-contains="false">1057</div>
                            <div class="block" data-block="1058" data-contains="false">1058</div>
                            <div class="block" data-block="1059" data-contains="true">1059</div>
                            <div class="block" data-block="1060" data-contains="false">1060</div>
                            <div class="block" data-block="1061" data-contains="false">1061</div>
                        </div>
                        <div class="blockchain-track"></div>
                    </div>
                    
                    <div class="block-details" style="display:none;">
                        <h3>פרטי בלוק <span class="block-number"></span></h3>
                        <p><strong>חותמת זמן:</strong> <span class="block-timestamp"></span></p>
                        <p><strong>מספר עסקאות:</strong> <span class="block-tx-count"></span></p>
                        <p class="block-contains-tx" style="display:none; color:var(--secondary-color)">✓ בלוק זה מכיל את העסקה שלנו!</p>
                        <p class="block-not-contains-tx" style="display:none; color:var(--error-color)">❌ בלוק זה אינו מכיל את העסקה שלנו.</p>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>למדנו: בלוקים בשרשרת</h3>
                        <p>עסקאות בבלוקצ'יין מאורגנות בקבוצות הנקראות "בלוקים". כל בלוק מכיל מספר עסקאות שאומתו יחד. הבלוקים מסודרים בסדר כרונולוגי ומחוברים זה לזה בשרשרת - כל בלוק מכיל את החתימה הקריפטוגרפית של הבלוק הקודם, מה שמונע שינוי מידע בדיעבד. זו הסיבה שרשומות הבלוקצ'יין נחשבות לבלתי ניתנות לשינוי.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step1" class="btn btn-secondary">חזור</button>
                        <button id="btn-step2" class="btn" disabled>המשך לשלב הבא</button>
                    </div>
                </div>
                
                <div id="step3" class="game-step" style="display:none;">
                    <h2>שלב 3: אימות העסקה</h2>
                    <p>מצוין! מצאנו את הבלוק שמכיל את העסקה שלנו. עכשיו בוא נלמד איך הבלוקצ'יין מאמת שהעסקה אכן תקינה ולא שונתה. באיזה מהמנגנונים הבאים הבלוקצ'יין משתמש לאימות העסקה?</p>
                    
                    <div class="verification-icons">
                        <div class="verification-icon" data-verification="hash">
                            <i class="fas fa-fingerprint"></i>
                            <span>חתימה קריפטוגרפית (Hash)</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="nodes">
                            <i class="fas fa-network-wired"></i>
                            <span>אימות מרובה צמתים</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="password">
                            <i class="fas fa-key"></i>
                            <span>סיסמה מרכזית</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="central">
                            <i class="fas fa-building-columns"></i>
                            <span>אישור בנקאי</span>
                        </div>
                    </div>
                    
<div class="lesson" style="display:none;">
                        <h3>למדנו: אימות מבוזר</h3>
                        <p><strong>חתימה קריפטוגרפית (Hash)</strong> - כל עסקה מקבלת "טביעת אצבע" דיגיטלית ייחודית. כל שינוי, אפילו הקטן ביותר, יוצר טביעת אצבע שונה לחלוטין, מה שמבטיח שלא ניתן לשנות נתונים מבלי שזה יתגלה.</p>
                        <p><strong>אימות מרובה צמתים</strong> - במערכת הבלוקצ'יין, עסקאות מאומתות על ידי מחשבים רבים ברשת (צמתים) באופן עצמאי. רק אם רוב הצמתים מסכימים שהעסקה תקינה, היא תתווסף לשרשרת. זה שונה ממערכות מסורתיות בהן גורם מרכזי אחד (כמו בנק) מאשר עסקאות.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step2" class="btn btn-secondary">חזור</button>
                        <button id="btn-step3" class="btn" disabled>המשך לשלב הבא</button>
                    </div>
                </div>
                
                <div id="step4" class="game-step" style="display:none;">
                    <h2>שלב 4: מעקב אחר השימוש בתרומה</h2>
                    <p>כעת נראה איך ניתן לעקוב אחר השימוש בתרומה. נניח שהפרויקט השתמש בחלק מהכסף לרכישת ציוד לבית הספר. איזה מהעסקאות הבאות מייצגת את השימוש בכספי התרומה שלנו?</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" data-usage="refund">
                            <h3>עסקה #TX-8102</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 50$</p>
                                <p><strong>מקור:</strong> בית ספר באתיופיה</p>
                                <p><strong>יעד:</strong> ארנק 0x59f...d21c</p>
                                <p><strong>תיאור:</strong> החזר עודף תרומה</p>
                            </div>
                            <div class="transaction-hash">0x76d5e4c3b2a19876d5e4c3b2a19876d5e4c3b2a1</div>
                        </div>
                        
                        <div class="transaction-card" data-usage="equipment">
                            <h3>עסקה #TX-7985</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 120$</p>
                                <p><strong>מקור:</strong> בית ספר באתיופיה</p>
                                <p><strong>יעד:</strong> ספק ציוד לימודי</p>
                                <p><strong>תיאור:</strong> רכישת ספרים וציוד</p>
                            </div>
                            <div class="transaction-hash">0x2e3f4d5c6b7a8901234d5c6b7a8901234d5c6b7a</div>
                        </div>
                        
                        <div class="transaction-card" data-usage="other">
                            <h3>עסקה #TX-7840</h3>
                            <div class="transaction-details">
                                <p><strong>סכום:</strong> 200$</p>
                                <p><strong>מקור:</strong> ארנק 0x82c...37ab</p>
                                <p><strong>יעד:</strong> בית ספר באתיופיה</p>
                                <p><strong>תיאור:</strong> תרומה נוספת</p>
                            </div>
                            <div class="transaction-hash">0xa1b2c3d4e5f6789a1b2c3d4e5f6789a1b2c3d4e5</div>
                        </div>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>למדנו: שקיפות בשימוש בתרומות</h3>
                        <p>בזכות הבלוקצ'יין, ניתן לעקוב אחר כל תנועה של כספי התרומות - מרגע התרומה ועד לשימוש הסופי בהם. כל הוצאה מתועדת באופן שקוף ובלתי הפיך בשרשרת, מה שמאפשר לתורמים לראות בדיוק לאן הכסף שלהם הולך, ולמנוע שימוש לא הולם בכספי תרומות.</p>
                        <p>שקיפות זו אינה אפשרית במערכות תרומות מסורתיות, שם התורם מאבד את היכולת לעקוב אחר כספו ברגע שהוא נמסר לארגון.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step3" class="btn btn-secondary">חזור</button>
                        <button id="btn-step4" class="btn" disabled>המשך לסיום</button>
                    </div>
                </div>
                
                <div id="step5" class="game-step" style="display:none;">
                    <h2>סיום: כל הכבוד! 🎉</h2>
                    <p>השלמת בהצלחה את המשחק "עקוב אחר התרומה"! כעת יש לך הבנה טובה יותר של האופן שבו טכנולוגיית הבלוקצ'יין מאפשרת שקיפות ומעקב אחר תרומות.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" style="flex-basis: 100%;">
                            <h3>סיכום המסע שלך</h3>
                            <div class="transaction-details">
                                <p><strong>איתרת עסקה:</strong> #TX-7529 של 200$ לבית ספר באתיופיה</p>
                                <p><strong>מצאת בלוק:</strong> מס' 1059 המכיל את העסקה</p>
                                <p><strong>הבנת אימות:</strong> חתימות קריפטוגרפיות ואימות מבוזר</p>
                                <p><strong>עקבת אחר השימוש:</strong> 120$ לרכישת ציוד לימודי</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson">
                        <h3>יתרונות הבלוקצ'יין בעולם התרומות</h3>
                        <p>הבלוקצ'יין משנה את עולם התרומות בכמה דרכים משמעותיות:</p>
                        <ul>
                            <li><strong>שקיפות מלאה</strong> - כל תרומה והשימוש בה מתועדים באופן פומבי ובלתי ניתן לשינוי</li>
                            <li><strong>אמון מובנה</strong> - אין צורך לסמוך על ארגון מתווך, כי הנתונים מאומתים באופן מבוזר</li>
                            <li><strong>הפחתת עלויות</strong> - פחות מתווכים משמעותם יותר כסף שמגיע ליעדו</li>
                            <li><strong>נגישות גלובלית</strong> - תרומות יכולות להגיע ישירות למקומות הזקוקים להן ביותר, ללא מגבלות גיאוגרפיות</li>
                            <li><strong>אחריותיות</strong> - ארגונים שמשתמשים בבלוקצ'יין מחויבים לשקיפות ואחריות גבוהה יותר</li>
                        </ul>
                        <p>בזכות lifeSpark, אתם יכולים ליהנות מכל היתרונות האלה ולתרום בביטחון, בידיעה שתרומתכם תגיע ליעדה ותשמש למטרה שלשמה נתרמה.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step4" class="btn btn-secondary">חזור</button>
                        <button id="btn-restart" class="btn">התחל מחדש</button>
                    </div>
                </div>
            </div>
            
            <!-- מודל למידע על בלוק -->
            <div id="blockModal" class="modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h2>פרטי בלוק <span class="modal-block-number"></span></h2>
                    
                    <div class="block-info">
                        <p><strong>חותמת זמן:</strong> <span class="modal-block-timestamp"></span></p>
                        <p><strong>Hash של הבלוק:</strong> <span class="modal-block-hash"></span></p>
                        <p><strong>Hash של הבלוק הקודם:</strong> <span class="modal-prev-hash"></span></p>
                        <p><strong>גודל:</strong> <span class="modal-block-size"></span></p>
                        <p><strong>מספר עסקאות:</strong> <span class="modal-tx-count"></span></p>
                        
                        <div class="tx-list">
                            <h3>עסקאות בבלוק:</h3>
                            <div class="modal-tx-list"></div>
                        </div>
                        
                        <div class="modal-contains-tx" style="display:none; margin-top: 20px; padding: 10px; background-color: rgba(16, 185, 129, 0.1); border: 1px solid var(--secondary-color); border-radius: var(--border-radius);">
                            <h3 style="color: var(--secondary-color); margin-top: 0;">מצאת את העסקה שלנו! 🎉</h3>
                            <p>בלוק זה מכיל את עסקת התרומה #TX-7529 שחיפשנו.</p>
                        </div>
                    </div>
                    
                    <div class="block-explainer" style="margin-top: 20px; text-align: right;">
                        <h3>איך לקרוא את נתוני הבלוק:</h3>
                        <p>כל בלוק מכיל חתימה קריפטוגרפית (hash) ייחודית וגם מפנה לבלוק הקודם בשרשרת, מה שיוצר "שרשרת" בלתי ניתנת לשבירה של נתונים.</p>
                        <p>אם מישהו ינסה לשנות עסקה בבלוק אחד, החתימה של אותו בלוק תשתנה וכך גם החתימות של כל הבלוקים שאחריו - מה שיגרום לכך שהשינוי יתגלה מיד.</p>
                    </div>
                    
                    <button class="btn modal-close-btn">סגור</button>
                </div>
            </div>
        `;
        
        // הוספת מאזיני אירועים
        addEventListeners();
    }
    
    function addEventListeners() {
        // שלב 1 - בחירת עסקה
        const txCards = document.querySelectorAll('#step1 .transaction-card');
        const btnStep1 = document.getElementById('btn-step1');
        
        txCards.forEach(card => {
            card.addEventListener('click', function() {
                txCards.forEach(c => c.classList.remove('selected', 'correct', 'incorrect'));
                this.classList.add('selected');
                const selectedTx = this.getAttribute('data-tx');
                
                if (selectedTx === 'TX-7529') {
                    this.classList.add('correct');
                    btnStep1.disabled = false;
                    // הצג את הלמידה לאחר בחירה נכונה
                    document.querySelector('#step1 .lesson').style.display = 'block';
                } else {
                    this.classList.add('incorrect');
                    btnStep1.disabled = true;
                    document.querySelector('#step1 .lesson').style.display = 'none';
                }
            });
        });
        
        btnStep1.addEventListener('click', () => {
            goToStep(2);
        });
        
        // שלב 2 - בחירת בלוק
        const blocks = document.querySelectorAll('.block');
        const btnStep2 = document.getElementById('btn-step2');
        const btnBackToStep1 = document.getElementById('btn-back-to-step1');
        
        blocks.forEach(block => {
            block.addEventListener('click', function() {
                const blockNumber = this.getAttribute('data-block');
                const containsTx = this.getAttribute('data-contains') === 'true';
                
                showBlockDetails(blockNumber, containsTx);
            });
        });
        
        btnBackToStep1.addEventListener('click', () => {
            goToStep(1);
        });
        
        btnStep2.addEventListener('click', () => {
            goToStep(3);
        });
        
        // חלון מודל של בלוק
        const blockModal = document.getElementById('blockModal');
        const modalClose = document.querySelector('.modal-close');
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                blockModal.style.display = 'none';
            });
        }
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                blockModal.style.display = 'none';
            });
        }
        
        // סגירת המודל בלחיצה על הרקע
        window.addEventListener('click', (event) => {
            if (event.target === blockModal) {
                blockModal.style.display = 'none';
            }
        });
        
        // שלב 3 - אימות
        const verificationIcons = document.querySelectorAll('.verification-icon');
        const btnStep3 = document.getElementById('btn-step3');
        const btnBackToStep2 = document.getElementById('btn-back-to-step2');
        let correctVerifications = 0;
        
        verificationIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const verificationType = this.getAttribute('data-verification');
                
                if (verificationType === 'hash' || verificationType === 'nodes') {
                    this.classList.add('correct');
                    correctVerifications++;
                } else {
                    this.classList.add('incorrect');
                }
                
                // אם המשתמש בחר את שתי התשובות הנכונות
                if (correctVerifications >= 2) {
                    btnStep3.disabled = false;
                    document.querySelector('#step3 .lesson').style.display = 'block';
                }
            });
        });
        
        btnBackToStep2.addEventListener('click', () => {
            goToStep(2);
        });
        
        btnStep3.addEventListener('click', () => {
            goToStep(4);
        });
        
        // שלב 4 - מעקב אחר שימוש
        const usageCards = document.querySelectorAll('#step4 .transaction-card');
        const btnStep4 = document.getElementById('btn-step4');
        const btnBackToStep3 = document.getElementById('btn-back-to-step3');
        
        usageCards.forEach(card => {
            card.addEventListener('click', function() {
                usageCards.forEach(c => c.classList.remove('selected', 'correct', 'incorrect'));
                this.classList.add('selected');
                const selectedUsage = this.getAttribute('data-usage');
                
                if (selectedUsage === 'equipment') {
                    this.classList.add('correct');
                    btnStep4.disabled = false;
                    document.querySelector('#step4 .lesson').style.display = 'block';
                } else {
                    this.classList.add('incorrect');
                    btnStep4.disabled = true;
                    document.querySelector('#step4 .lesson').style.display = 'none';
                }
            });
        });
        
        btnBackToStep3.addEventListener('click', () => {
            goToStep(3);
        });
        
        btnStep4.addEventListener('click', () => {
            goToStep(5);
        });
        
        // שלב 5 - סיום
        const btnBackToStep4 = document.getElementById('btn-back-to-step4');
        const btnRestart = document.getElementById('btn-restart');
        
        btnBackToStep4.addEventListener('click', () => {
            goToStep(4);
        });
        
        btnRestart.addEventListener('click', () => {
            resetGame();
            goToStep(1);
        });
    }
    
    function goToStep(step) {
        // הסתרת כל השלבים
        const steps = document.querySelectorAll('.game-step');
        steps.forEach(s => s.style.display = 'none');
        
        // הצגת השלב הנוכחי
        document.getElementById(`step${step}`).style.display = 'block';
        
        // עדכון מצב ההתקדמות
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((ps, index) => {
            ps.classList.remove('active', 'completed');
            if (index + 1 === step) {
                ps.classList.add('active');
            } else if (index + 1 < step) {
                ps.classList.add('completed');
            }
        });
    }
    
    function showBlockDetails(blockNumber, containsTx) {
        const block = blockData[blockNumber];
        if (!block) return;
        
        // עדכון נתוני הבלוק במודל
        document.querySelector('.modal-block-number').textContent = blockNumber;
        document.querySelector('.modal-block-timestamp').textContent = block.timestamp;
        document.querySelector('.modal-block-hash').textContent = block.hash;
        document.querySelector('.modal-prev-hash').textContent = block.prevHash;
        document.querySelector('.modal-block-size').textContent = block.size;
        document.querySelector('.modal-tx-count').textContent = block.txCount;
        
        // עדכון רשימת העסקאות
        const txListElement = document.querySelector('.modal-tx-list');
        txListElement.innerHTML = '';
        
        block.transactions.forEach(tx => {
            const txElement = document.createElement('div');
            txElement.style.padding = '5px';
            txElement.style.marginBottom = '5px';
            txElement.style.borderRight = '3px solid var(--primary-color)';
            txElement.style.paddingRight = '10px';
            
            // הדגשת העסקה שאנחנו מחפשים
            if (tx.id === 'TX-7529') {
                txElement.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                txElement.style.borderRight = '3px solid var(--secondary-color)';
                txElement.style.borderRadius = '4px';
            }
            
            txElement.innerHTML = `<strong>${tx.id}:</strong> ${tx.desc}`;
            txListElement.appendChild(txElement);
        });
        
        // עדכון תצוגת "מצאת את העסקה שלנו"
        document.querySelector('.modal-contains-tx').style.display = containsTx ? 'block' : 'none';
        
        // עדכון מצב הבלוקים בתצוגה הראשית
        const blocks = document.querySelectorAll('.block');
        let foundBlock = null;
        
        blocks.forEach(b => {
            if (b.getAttribute('data-block') === blockNumber) {
                b.classList.add('active');
                
                if (containsTx) {
                    foundBlock = blockNumber;
                    document.getElementById('btn-step2').disabled = false;
                    document.querySelector('#step2 .lesson').style.display = 'block';
                    document.querySelector('.block-details').style.display = 'block';
                    document.querySelector('.block-number').textContent = blockNumber;
                    document.querySelector('.block-timestamp').textContent = block.timestamp;
                    document.querySelector('.block-tx-count').textContent = block.txCount;
                    document.querySelector('.block-contains-tx').style.display = 'block';
                    document.querySelector('.block-not-contains-tx').style.display = 'none';
                } else {
                    document.querySelector('.block-details').style.display = 'block';
                    document.querySelector('.block-number').textContent = blockNumber;
                    document.querySelector('.block-timestamp').textContent = block.timestamp;
                    document.querySelector('.block-tx-count').textContent = block.txCount;
                    document.querySelector('.block-contains-tx').style.display = 'none';
                    document.querySelector('.block-not-contains-tx').style.display = 'block';
                }
            } else {
                if (b.getAttribute('data-block') !== foundBlock) {
                    b.classList.remove('active');
                }
            }
        });
        
        // הצגת המודל
        document.getElementById('blockModal').style.display = 'flex';
    }
    
    function resetGame() {
        // איפוס כרטיסי עסקאות
        document.querySelectorAll('.transaction-card').forEach(card => {
            card.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // איפוס בלוקים
        document.querySelectorAll('.block').forEach(block => {
            block.classList.remove('active', 'visited');
        });
        
        // איפוס אייקוני אימות
        document.querySelectorAll('.verification-icon').forEach(icon => {
            icon.classList.remove('correct', 'incorrect');
        });
        
        // הסתרת חלקי התובנות
        document.querySelectorAll('.lesson').forEach(lesson => {
            lesson.style.display = 'none';
        });
        document.querySelector('.block-details').style.display = 'none';
        
        // איפוס כפתורים
        document.getElementById('btn-step1').disabled = true;
        document.getElementById('btn-step2').disabled = true;
        document.getElementById('btn-step3').disabled = true;
        document.getElementById('btn-step4').disabled = true;
    }
});