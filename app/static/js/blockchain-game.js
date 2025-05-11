// משחק "עקוב אחר התרומה" - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if the game exists on the page
    if (!document.getElementById('blockchain-tracker-game')) return;
    
    // Block data for the game
    const blockData = {
        '1057': {
            timestamp: '2025-05-11 14:52:10',
            hash: '0x8d7c6b5a4e3f2d1c0b9a8d7c6b5a4e3f2d1c0b9a',
            prevHash: '0x1a2b3c4d5e6f7890a1b2c3d4e5f6789012345678',
            size: '1.2 MB',
            txCount: 12,
            transactions: [
                { id: 'TX-7520', desc: 'Donation to Clean Water Project, $150' },
                { id: 'TX-7521', desc: 'Donation to Forest Restoration, $300' },
                { id: 'TX-7522', desc: 'Purchase of Medical Equipment, $450' }
            ]
        },
        '1058': {
            timestamp: '2025-05-11 15:10:22',
            hash: '0x3e4f5d6c7b8a9012345678901234567890123456',
            prevHash: '0x8d7c6b5a4e3f2d1c0b9a8d7c6b5a4e3f2d1c0b9a',
            size: '0.9 MB',
            txCount: 8,
            transactions: [
                { id: 'TX-7523', desc: 'Donation to Education in India, $250' },
                { id: 'TX-7524', desc: 'Purchase of Computers for School, $800' },
                { id: 'TX-7525', desc: 'Donation to Medical Research, $500' }
            ]
        },
        '1059': {
            timestamp: '2025-05-11 15:47:35',
            hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
            prevHash: '0x3e4f5d6c7b8a9012345678901234567890123456',
            size: '1.5 MB',
            txCount: 15,
            transactions: [
                { id: 'TX-7526', desc: 'Donation to Animal Shelter, $100' },
                { id: 'TX-7527', desc: 'Donation to Climate Change Action, $450' },
                { id: 'TX-7528', desc: 'Purchase of First Aid Kits, $300' },
                { id: 'TX-7529', desc: 'Donation to School in Ethiopia, $200' },
                { id: 'TX-7530', desc: 'Donation to School in India, $200' }
            ]
        },
        '1060': {
            timestamp: '2025-05-11 16:05:18',
            hash: '0x2a3b4c5d6e7f8901a2b3c4d5e6f8901a2b3c4d5e',
            prevHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
            size: '1.1 MB',
            txCount: 10,
            transactions: [
                { id: 'TX-7531', desc: 'Donation to Vaccine Development, $1000' },
                { id: 'TX-7532', desc: 'Purchase of Agricultural Equipment, $750' },
                { id: 'TX-7533', desc: 'Support for Green Energy Initiative, $500' }
            ]
        },
        '1061': {
            timestamp: '2025-05-11 16:22:47',
            hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
            prevHash: '0x2a3b4c5d6e7f8901a2b3c4d5e6f8901a2b3c4d5e',
            size: '1.3 MB',
            txCount: 13,
            transactions: [
                { id: 'TX-7534', desc: 'Donation to Student Scholarships, $700' },
                { id: 'TX-7535', desc: 'Support for Clinic in Kenya, $450' },
                { id: 'TX-7536', desc: 'Aid for Natural Disaster Victims, $1200' }
            ]
        }
    };
    
    // Initialize the game
    initGame();
    
    function initGame() {
        // Add HTML content to the game
        const gameContainer = document.getElementById('blockchain-tracker-game');
        
        gameContainer.innerHTML = `
            <div class="game-header">
                <h1>"Track Your Donation" Game 💸</h1>
            </div>
            
            <div class="game-description">
                <p>Welcome to the "Track Your Donation" game! Here you'll learn how blockchain technology enables complete transparency and tracking of donations. You'll need to track your donation through the blockchain and answer questions along the way to understand how this system works.</p>
            </div>

            <div class="game-content">
                <div class="game-progress">
                    <div class="progress-step active">
                        <div class="step-circle">1</div>
                        <div class="step-label">Locate Transaction</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">2</div>
                        <div class="step-label">Find the Block</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">3</div>
                        <div class="step-label">Verification</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">4</div>
                        <div class="step-label">Track Usage</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-circle">5</div>
                        <div class="step-label">Completion</div>
                    </div>
                </div>

                <div id="step1" class="game-step">
                    <h2>Step 1: Locate Our Transaction</h2>
                    <p>A $200 donation was made to the "New School in Ethiopia" project. As part of our transparency system, you need to locate the donation transaction among the following transactions. Look for the transaction ID TX-7529.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" data-tx="TX-6281">
                            <h3>Transaction #TX-6281</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $350</p>
                                <p><strong>Source:</strong> Wallet 0x83a...f92e</p>
                                <p><strong>Destination:</strong> Clean Water Project</p>
                                <p><strong>Time:</strong> 14:32:01</p>
                            </div>
                            <div class="transaction-hash">0x7c82b5c8f5a1e8b2a7d9b5c1e8f5a1e8b2a7d9b5</div>
                        </div>
                        
                        <div class="transaction-card" data-tx="TX-7529">
                            <h3>Transaction #TX-7529</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $200</p>
                                <p><strong>Source:</strong> Wallet 0x59f...d21c</p>
                                <p><strong>Destination:</strong> School in Ethiopia</p>
                                <p><strong>Time:</strong> 15:47:22</p>
                            </div>
                            <div class="transaction-hash">0x3f456a789c1d2e3f456a789c1d2e3f456a789c1d</div>
                        </div>
                        
                        <div class="transaction-card" data-tx="TX-7530">
                            <h3>Transaction #TX-7530</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $200</p>
                                <p><strong>Source:</strong> Wallet 0x71d...948f</p>
                                <p><strong>Destination:</strong> School in India</p>
                                <p><strong>Time:</strong> 15:48:03</p>
                            </div>
                            <div class="transaction-hash">0x9d8c7b6a5e4f3d2c1b0a9d8c7b6a5e4f3d2c1b0a</div>
                        </div>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>Learned: Transaction Identification</h3>
                        <p>Every transaction on the blockchain receives a unique identifier (like TX-7529) and a cryptographic signature (the hash). Both allow easy tracking of the transaction. Unlike closed systems, anyone can search for a transaction and see its complete details, ensuring transparency and public oversight.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-step1" class="btn" disabled>Continue to Next Step</button>
                    </div>
                </div>
                
                <div id="step2" class="game-step" style="display:none;">
                    <h2>Step 2: Finding the Block Containing the Transaction</h2>
                    <p>Great! You've found our transaction. Now we need to locate which block in the blockchain contains it. Click on each of the blocks to check which transactions they contain.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card selected">
                            <h3>Transaction #TX-7529</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $200</p>
                                <p><strong>Source:</strong> Wallet 0x59f...d21c</p>
                                <p><strong>Destination:</strong> School in Ethiopia</p>
                                <p><strong>Time:</strong> 15:47:22</p>
                            </div>
                            <div class="transaction-hash">0x3f456a789c1d2e3f456a789c1d2e3f456a789c1d</div>
                        </div>
                    </div>
                    
                    <div class="blockchain-display">
                        <p>Blockchain:</p>
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
                        <h3>Block Details <span class="block-number"></span></h3>
                        <p><strong>Timestamp:</strong> <span class="block-timestamp"></span></p>
                        <p><strong>Number of Transactions:</strong> <span class="block-tx-count"></span></p>
                        <p class="block-contains-tx" style="display:none; color:var(--secondary-color)">✓ This block contains our transaction!</p>
                        <p class="block-not-contains-tx" style="display:none; color:var(--error-color)">❌ This block does not contain our transaction.</p>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>Learned: Blocks in the Chain</h3>
                        <p>Transactions in blockchain are organized in groups called "blocks". Each block contains multiple transactions that were verified together. The blocks are arranged chronologically and connected to each other in a chain - each block contains the cryptographic signature of the previous block, which prevents retroactive data changes. This is why blockchain records are considered immutable.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step1" class="btn btn-secondary">Back</button>
                        <button id="btn-step2" class="btn" disabled>Continue to Next Step</button>
                    </div>
                </div>
                
                <div id="step3" class="game-step" style="display:none;">
                    <h2>Step 3: Transaction Verification</h2>
                    <p>Excellent! We found the block that contains our transaction. Now let's learn how the blockchain verifies that the transaction is valid and hasn't been altered. Which of the following mechanisms does blockchain use to verify the transaction?</p>
                    
                    <div class="verification-icons">
                        <div class="verification-icon" data-verification="hash">
                            <i class="fas fa-fingerprint"></i>
                            <span>Cryptographic Signature (Hash)</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="nodes">
                            <i class="fas fa-network-wired"></i>
                            <span>Multiple Node Verification</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="password">
                            <i class="fas fa-key"></i>
                            <span>Central Password</span>
                        </div>
                        
                        <div class="verification-icon" data-verification="central">
                            <i class="fas fa-building-columns"></i>
                            <span>Bank Approval</span>
                        </div>
                    </div>
                    
<div class="lesson" style="display:none;">
                        <h3>Learned: Decentralized Verification</h3>
                        <p><strong>Cryptographic Signature (Hash)</strong> - Each transaction receives a unique digital "fingerprint". Any change, even the smallest one, creates a completely different fingerprint, ensuring that data cannot be altered without detection.</p>
                        <p><strong>Multiple Node Verification</strong> - In the blockchain system, transactions are verified independently by many computers (nodes) in the network. Only if the majority of nodes agree that the transaction is valid will it be added to the chain. This differs from traditional systems where a single central entity (like a bank) approves transactions.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step2" class="btn btn-secondary">Back</button>
                        <button id="btn-step3" class="btn" disabled>Continue to Next Step</button>
                    </div>
                </div>
                
                <div id="step4" class="game-step" style="display:none;">
                    <h2>Step 4: Tracking Donation Usage</h2>
                    <p>Now let's see how we can track the use of the donation. Let's assume the project used some of the money to purchase equipment for the school. Which of the following transactions represents the use of our donation funds?</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" data-usage="refund">
                            <h3>Transaction #TX-8102</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $50</p>
                                <p><strong>Source:</strong> School in Ethiopia</p>
                                <p><strong>Destination:</strong> Wallet 0x59f...d21c</p>
                                <p><strong>Description:</strong> Donation surplus refund</p>
                            </div>
                            <div class="transaction-hash">0x76d5e4c3b2a19876d5e4c3b2a19876d5e4c3b2a1</div>
                        </div>
                        
                        <div class="transaction-card" data-usage="equipment">
                            <h3>Transaction #TX-7985</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $120</p>
                                <p><strong>Source:</strong> School in Ethiopia</p>
                                <p><strong>Destination:</strong> Educational Equipment Supplier</p>
                                <p><strong>Description:</strong> Purchase of books and equipment</p>
                            </div>
                            <div class="transaction-hash">0x2e3f4d5c6b7a8901234d5c6b7a8901234d5c6b7a</div>
                        </div>
                        
                        <div class="transaction-card" data-usage="other">
                            <h3>Transaction #TX-7840</h3>
                            <div class="transaction-details">
                                <p><strong>Amount:</strong> $200</p>
                                <p><strong>Source:</strong> Wallet 0x82c...37ab</p>
                                <p><strong>Destination:</strong> School in Ethiopia</p>
                                <p><strong>Description:</strong> Additional donation</p>
                            </div>
                            <div class="transaction-hash">0xa1b2c3d4e5f6789a1b2c3d4e5f6789a1b2c3d4e5</div>
                        </div>
                    </div>
                    
                    <div class="lesson" style="display:none;">
                        <h3>Learned: Transparency in Donation Usage</h3>
                        <p>Thanks to blockchain, we can track every movement of donation funds - from the moment of donation to their final use. Every expense is transparently and irreversibly recorded in the chain, allowing donors to see exactly where their money is going, and preventing inappropriate use of donation funds.</p>
                        <p>This transparency is not possible in traditional donation systems, where the donor loses the ability to track their money once it is handed over to an organization.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step3" class="btn btn-secondary">Back</button>
                        <button id="btn-step4" class="btn" disabled>Continue to Finish</button>
                    </div>
                </div>
                
                <div id="step5" class="game-step" style="display:none;">
                    <h2>Completion: Congratulations! 🎉</h2>
                    <p>You have successfully completed the "Track Your Donation" game! You now have a better understanding of how blockchain technology enables transparency and tracking of donations.</p>
                    
                    <div class="transaction-display">
                        <div class="transaction-card" style="flex-basis: 100%;">
                            <h3>Summary of Your Journey</h3>
                            <div class="transaction-details">
                                <p><strong>Located Transaction:</strong> #TX-7529 of $200 to a school in Ethiopia</p>
                                <p><strong>Found Block:</strong> #1059 containing the transaction</p>
                                <p><strong>Understood Verification:</strong> Cryptographic signatures and decentralized verification</p>
                                <p><strong>Tracked Usage:</strong> $120 for purchasing educational equipment</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson">
                        <h3>Benefits of Blockchain in the Donation World</h3>
                        <p>Blockchain is changing the world of donations in several significant ways:</p>
                        <ul>
                            <li><strong>Complete Transparency</strong> - Every donation and its use are publicly recorded and cannot be altered</li>
                            <li><strong>Built-in Trust</strong> - No need to trust an intermediary organization, as the data is verified in a decentralized manner</li>
                            <li><strong>Cost Reduction</strong> - Fewer intermediaries means more money reaches its destination</li>
                            <li><strong>Global Accessibility</strong> - Donations can reach directly to the places that need them most, without geographical limitations</li>
                            <li><strong>Accountability</strong> - Organizations using blockchain are committed to higher transparency and responsibility</li>
                        </ul>
                        <p>Thanks to lifeSpark, you can enjoy all these benefits and donate with confidence, knowing that your donation will reach its destination and be used for the purpose for which it was donated.</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="btn-back-to-step4" class="btn btn-secondary">Back</button>
                        <button id="btn-restart" class="btn">Restart</button>
                    </div>
                </div>
            </div>
            
            <!-- Block Information Modal -->
            <div id="blockModal" class="modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h2>Block Details <span class="modal-block-number"></span></h2>
                    
                    <div class="block-info">
                        <p><strong>Timestamp:</strong> <span class="modal-block-timestamp"></span></p>
                        <p><strong>Block Hash:</strong> <span class="modal-block-hash"></span></p>
                        <p><strong>Previous Block Hash:</strong> <span class="modal-prev-hash"></span></p>
                        <p><strong>Size:</strong> <span class="modal-block-size"></span></p>
                        <p><strong>Number of Transactions:</strong> <span class="modal-tx-count"></span></p>
                        
                        <div class="tx-list">
                            <h3>Transactions in Block:</h3>
                            <div class="modal-tx-list"></div>
                        </div>
                        
                        <div class="modal-contains-tx" style="display:none; margin-top: 20px; padding: 10px; background-color: rgba(16, 185, 129, 0.1); border: 1px solid var(--secondary-color); border-radius: var(--border-radius);">
                            <h3 style="color: var(--secondary-color); margin-top: 0;">You found our transaction! 🎉</h3>
                            <p>This block contains the donation transaction #TX-7529 we were looking for.</p>
                        </div>
                    </div>
                    
                    <div class="block-explainer" style="margin-top: 20px; text-align: left;">
                        <h3>How to Read Block Data:</h3>
                        <p>Each block contains a unique cryptographic signature (hash) and also references the previous block in the chain, creating an unbreakable "chain" of data.</p>
                        <p>If someone tries to change a transaction in one block, the signature of that block will change and so will the signatures of all the blocks after it - which will cause the change to be immediately detected.</p>
                    </div>
                    
                    <button class="btn modal-close-btn">Close</button>
                </div>
            </div>
        `;
        
        // Adding event listeners
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