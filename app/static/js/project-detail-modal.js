// project-detail-modal.js
// This module enables detailed display of project details with an integrated donation form

// When the page loads, initialize the system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the project details display system
    initProjectDetailModal();
});

function initProjectDetailModal() {
    if (window.projectModalInitialized) {
        return;
    }
    window.projectModalInitialized = true;
    
    // Create the modal if it doesn't exist
    let projectDetailModal = document.getElementById('projectDetailModal');
    if (!projectDetailModal) {
        projectDetailModal = document.createElement('div');
        projectDetailModal.id = 'projectDetailModal';
        projectDetailModal.className = 'modal project-detail-modal';
        document.body.appendChild(projectDetailModal);
        
        // Define the HTML structure of the modal
        projectDetailModal.innerHTML = `
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3 id="projectDetailTitle">Project Details</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="project-detail-container">
                        <div class="project-detail-content">
                            <!-- Project information will be displayed here -->
                            <div id="projectDetailInfo"></div>
                        </div>
                        <div class="project-detail-sidebar">
                            <!-- Donation form will be displayed here -->
                            <div id="projectDonationForm"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to the close button
        const closeButton = projectDetailModal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            hideModal(projectDetailModal);
        });
        
        // Add event listener to close when clicking outside the modal
        projectDetailModal.addEventListener('click', (event) => {
            if (event.target === projectDetailModal) {
                hideModal(projectDetailModal);
            }
        });
    }
    
    // Add event listeners to project selection buttons
    setupProjectSelectionListeners();  
}

// Add event listeners to project selection buttons
function setupProjectSelectionListeners() {
    // Add event listeners to project selection buttons on initial load
    addProjectButtonListeners();
    
    // Add listener for DOM mutations to add listeners to new buttons that are added
    const projectsObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // When new elements are added, add event listeners to buttons
                addProjectButtonListeners();
            }
        });
    });
    
    // Start observing changes in the projects container
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    if (projectsCarousel) {
        projectsObserver.observe(projectsCarousel, {
            childList: true,
            subtree: true
        });
    }
}

// Add event listeners to project selection buttons
function addProjectButtonListeners() {
    const selectButtons = document.querySelectorAll('.project-select-btn');
    
    selectButtons.forEach(function(button) {
        // Remove existing event listeners to prevent duplicates
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Add new event listener
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the corresponding project
            const projectSlide = this.closest('.project-slide');
            if (!projectSlide) return;
            
            // Extract project information
            const projectId = projectSlide.dataset.projectId;
            const projectTitle = projectSlide.dataset.projectTitle;
            const projectETH = projectSlide.dataset.ethereumAddress
            const projectDescription = projectSlide.querySelector('.project-description')?.textContent;
            const projectRegion = projectSlide.dataset.projectRegion;
            
            // Extract progress information
            const progressFill = projectSlide.querySelector('.progress-fill');
            const progressPercent = progressFill ? 
                parseInt(progressFill.style.width.replace('%', '')) : 0;
            
            const progressStats = projectSlide.querySelector('.progress-stats');
            const progressText = progressStats ? progressStats.textContent : '';
            
            // Extract amounts from the text
            let currentAmount = 0;
            let goalAmount = 0;
            
            if (progressText) {
                const amountMatch = progressText.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
                if (amountMatch && amountMatch.length >= 3) {
                    currentAmount = parseFloat(amountMatch[1]);
                    goalAmount = parseFloat(amountMatch[2]);
                }
            }
            
            // Create project object
            const project = {
                id: projectId,
                title: projectTitle,
                ethereum_address: projectETH,
                description: projectDescription,
                region: projectRegion,
                currentAmount: currentAmount,
                goalAmount: goalAmount,
                progressPercent: progressPercent
            };
            
            // Display project details
            showProjectDetails(project);
        });
    });
}

// Display project details in the modal
function showProjectDetails(project) {
    // Add ethereum_address field if missing
    if (!project.ethereum_address) {
        project.ethereum_address = '';
        console.warn("Project is missing wallet address, added empty field:", project);
    }
    // Find the modal
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;
    
    // Update the title
    const titleElement = modal.querySelector('#projectDetailTitle');
    if (titleElement) {
        titleElement.textContent = project.title;
    }
    
    // Display project details
    const detailsContainer = modal.querySelector('#projectDetailInfo');
    if (detailsContainer) {
        // Extract region name based on current language
        const regionText = project.region === 'south' ? 'Southern Region' : 'Northern Region';
        
        // Update project information content
        detailsContainer.innerHTML = `
            <div class="project-detail-badge ${project.region}">
                ${regionText}
            </div>
            
            <div class="project-detail-description">
                <h4>Project Description</h4>
                <p>${project.description}</p>
            </div>
            
            <div class="project-detail-progress">
                <h4>Funding Progress</h4>
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
    
    // Update the donation form
    const donationFormContainer = modal.querySelector('#projectDonationForm');
    if (donationFormContainer) {
        setupProjectDonationForm(donationFormContainer, project);
    }
    
    // Display the modal
    showModal(modal);
}

// Set up the donation form for the project
function setupProjectDonationForm(container, project) {
    // Check if wallet is connected
    const isWalletConnected = window.userWalletAddress !== null;
    
    // Define the donation form content
    container.innerHTML = `
        <div class="project-donation-form">
            <h4>Donate to this Project</h4>
            
            ${!isWalletConnected ? `
                <div class="wallet-connection-required">
                    <p>You need to connect a wallet to donate</p>
                    <button id="projectConnectWalletBtn" class="btn btn-primary">
                        <i class="fas fa-link"></i> 
                        <span>Connect Wallet</span>
                    </button>
                </div>
            ` : `
                <form id="projectDonationSubmitForm">
                    <div class="form-group">
                        <label for="projectDonationAmount">Donation Amount (ETH):</label>
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
                        <label for="projectDonationMessage">Message (Optional):</label>
                        <textarea id="projectDonationMessage" rows="3" placeholder="Personal support message..."></textarea>
                        <small>This message will be saved on the blockchain</small>
                    </div>
                    
                    <div class="donation-summary">
                        <h4>Donation Summary</h4>
                        <div class="summary-row">
                            <span>Selected Project:</span>
                            <span id="summaryProjectTitle">${project.title}</span>
                        </div>
                        <div class="summary-row">
                            <span>Donation Amount:</span>
                            <span id="summaryProjectAmount">0.1 ETH</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Gas Fee:</span>
                            <span>~ 0.001 ETH</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="summaryProjectTotal">0.101 ETH</span>
                        </div>
                    
                    <button type="submit" class="donate-button btn-primary btn-block">
                        <i class="fas fa-heart"></i> Donate Now
                    </button>
                </form>
            `}
        </div>
    `;
    
    // Add event listeners to form elements
    if (!isWalletConnected) {
        // Listener for the connect wallet button
        const connectWalletBtn = container.querySelector('#projectConnectWalletBtn');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', function() {
                // Call the existing wallet connection function in the system
                if (typeof connectWallet === 'function') {
                    connectWallet().then(() => {
                        // After successful connection, update the form
                        if (window.userWalletAddress) {
                            setupProjectDonationForm(container, project);
                        }
                    });
                }
            });
        }
    } else {
        // Listener for quick amount buttons
        const quickAmountButtons = container.querySelectorAll('.quick-amount-btn');
        const amountInput = container.querySelector('#projectDonationAmount');
        const summaryAmount = container.querySelector('#summaryProjectAmount');
        const summaryTotal = container.querySelector('#summaryProjectTotal');
        
        if (quickAmountButtons.length && amountInput) {
            quickAmountButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    // Update the requested amount
                    const amount = parseFloat(this.dataset.amount);
                    amountInput.value = amount;
                    
                    // Update button styles
                    quickAmountButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update donation summary
                    updateDonationSummary(amountInput, summaryAmount, summaryTotal);
                });
            });
            
            // Listener for changes in the amount field
            amountInput.addEventListener('input', function() {
                // Update donation summary
                updateDonationSummary(amountInput, summaryAmount, summaryTotal);
                
                // Update button styles
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
            
            // Update donation summary for the first time
            updateDonationSummary(amountInput, summaryAmount, summaryTotal);
        }
        
        // Listener for donation form submission

        if (project.location_lat && project.location_lng && 
            parseFloat(project.location_lat) !== 0 && parseFloat(project.location_lng) !== 0) {
            donationForm.insertAdjacentHTML('beforeend', `
                <button type="button" class="btn btn-outline btn-sm view-on-map-btn" 
                        onclick="viewProjectOnMap('${project.id || project._id}', ${project.location_lat}, ${project.location_lng})">
                    <i class="fas fa-map-marked-alt"></i> View on Map
                </button>
            `);
        }
        const donationForm = container.querySelector('#projectDonationSubmitForm');
        if (donationForm) {
            donationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Collect data from the form
                const amount = parseFloat(amountInput.value);
                const message = container.querySelector('#projectDonationMessage').value;
                
                // Process the donation
                processDonationToProject(project, amount, message);
            });
        }
    }
}


// Function for real-time gas cost estimation
async function estimateGasFee(project, amount) {
    try {
        // Connect to smart contract
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
            window.CONTRACT_ABI, 
            window.CONTRACT_ADDRESS
        );
        
        // Convert amount to wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        // Estimate required gas
        const estimatedGas = await contract.methods.donate(project.region)
            .estimateGas({
                from: window.userWalletAddress,
                value: amountInWei
            });
        
        // Get current gas price on the network
        const gasPrice = await web3.eth.getGasPrice();
        
        // Calculate total cost
        const gasCost = web3.utils.toBN(estimatedGas).mul(web3.utils.toBN(gasPrice));
        const gasCostInEther = parseFloat(web3.utils.fromWei(gasCost, 'ether'));
        
        return gasCostInEther;
    } catch (error) {
        // In case of error, return default value
        return 0.001;
    }
}

// Update donation summary
async function updateDonationSummary(amountInput, summaryAmount, summaryTotal) {
    if (!amountInput || !summaryAmount || !summaryTotal) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const project = {
        region: selectedRegion // Global variable containing the selected region
    };
    const gasFee = await estimateGasFee(project, amount);
    const total = amount + gasFee;

    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    const summaryGasFee = document.getElementById('summaryGasFee');
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(6)} ETH`;
    summaryTotal.textContent = `${total.toFixed(6)} ETH`;
}

// Process donation to specific project
async function processDonationToProject(project, amount, message) {
    try {
        // Display processing message
        showNotification('info', 'Processing your donation...');
        
        // Display loading indicator in button
        const submitButton = document.querySelector('#projectDonationSubmitForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> Processing...';
        }
        

        try {
            // Make direct donation via blockchain or smart contract
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(
                window.CONTRACT_ABI, 
                window.CONTRACT_ADDRESS
            );
            
            // Convert amount to wei
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
            
            let txHash;
            
            // Check if project is registered in smart contract
            try {
                // Try to read project details from contract
                const projectId = project.id || project._id;
                const projectDetails = await contract.methods.getProjectDetails(projectId).call().catch(() => null);
                
                if (projectDetails && projectDetails[3]) { // Fourth value is exists
                    // If project is registered in contract, use donateToProject function
                    txHash = await contract.methods.donateToProject(projectId).send({
                        from: window.userWalletAddress,
                        value: amountInWei,
                        gas: 200000
                    });
                } else {
                    // If project is not registered in contract, make direct donation to project wallet address                    
                    txHash = await web3.eth.sendTransaction({
                        from: window.userWalletAddress,
                        to: project.ethereum_address,
                        value: amountInWei,
                        gas: 21000
                    });
                    
                    // Also update the region balance in smart contract
                    try {
                        await contract.methods.donate(project.region).send({
                            from: window.userWalletAddress,
                            value: 0, // Symbolic donation of 0 just to update data
                            gas: 100000
                        });
                    } catch (regionError) {
                        console.warn('Error updating region balance in contract:', regionError);
                    }
                }
                
                // Update project in database
                const token = localStorage.getItem('token');
                const updateResponse = await fetch(`/projects/${projectId}/update-donation`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount,
                        txHash: txHash.transactionHash || txHash,
                        message: message
                    })
                });
                
                if (!updateResponse.ok) {
                    console.warn('Donation recorded on blockchain but not updated in database');
                }
                
                // Display success message
                const txId = txHash.transactionHash || txHash;
                showNotification('success', 
                    `Donation completed successfully! Transaction: ${txId.substring(0, 10)}... 
                    <a href="#" onclick="alert('Transaction Hash:\\n${txId}\\n\\nThis transaction was executed on your local Ganache network.\\nYou can view full details in Ganache GUI or console.'); return false;" style="color: #fff; text-decoration: underline; margin-left: 10px;">
                        <i class="fas fa-info-circle"></i> View Full Hash
                    </a>`
                );
                
            } catch (contractError) {
                console.warn('Error in smart contract, performing direct donation:', contractError);
                
                // If there's an error in smart contract, try direct donation
                const txResult = await web3.eth.sendTransaction({
                    from: window.userWalletAddress,
                    to: project.ethereum_address,
                    value: amountInWei,
                    gas: 21000
                });
                
                // Update project in database
                const token = localStorage.getItem('token');
                const projectId = project.id || project._id;
                const updateResponse = await fetch(`/projects/${projectId}/update-donation`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount,
                        txHash: txResult.transactionHash,
                        message: message
                    })
                });
                
                if (!updateResponse.ok) {
                    console.warn('Donation recorded on blockchain but not updated in database');
                }
                
                // Display success message
                showNotification('success', 
                    `Donation completed successfully directly! ${txResult.transactionHash ? `Transaction: ${txResult.transactionHash.substring(0, 10)}...` : ''}`
                );
            }
            const modal = document.getElementById('projectDetailModal');
            if (modal) {
                hideModal(modal);
            }
            // manuallyLoadProjects();

        } catch (error) {
            throw error;
        }
        
    } catch (error) {
        showNotification('error', error.message || 'Error processing donation');
        
        // Restore button to normal state
        const submitButton = document.querySelector('#projectDonationSubmitForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = `<i class="fas fa-heart"></i> Donate Now`;
        }
    }
}

window.showProjectDetails = showProjectDetails;

window.viewProjectOnMap = function(projectId, lat, lng) {
    // Navigate to map page
    showSection('map');
    
    // Wait for map to load
    setTimeout(() => {
        if (mapInstance) {
            // Focus on project location
            mapInstance.setView([lat, lng], 15);
            
            // Find the matching marker and open popup
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