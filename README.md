# LifeSpark
## Development of a Blockchain-Based Donation System Using Digital Currencies to Support Iron Swords War Victims

<div align="center">
  <img src="https://github.com/user-attachments/assets/b830093e-2866-457b-b9ca-35e363b8fdb0" alt="LifeSpark Animation" width="400">
</div>


### Final Year Project 2025
**Ben-Gurion University of the Negev**  
**Faculty of Engineering Sciences**  
**Department of Software and Information Systems Engineering**

**Developers:** Omer Sabag & Avital Gelper  
**Academic Year:** 2025

---

## Overview

LifeSpark is a blockchain-based donation platform specifically designed to support victims of the Iron Swords War. The platform brings transparency and trust to charitable giving during crisis situations, connecting donors directly with communities in need across Israel. Using Ethereum smart contracts, every donation is tracked and verifiable, ensuring maximum impact for those affected by the conflict.

## Problem Statement

Traditional donation systems lack transparency, making it difficult for donors to track how their money is used during emergency situations like the Iron Swords War. This creates trust issues and often results in high administrative costs that reduce the actual impact of donations reaching war victims. Our platform addresses these critical challenges by using blockchain technology to create a transparent, direct donation system specifically focused on supporting those affected by the conflict.

## Solution

lifeSpark provides:
- **Complete Transparency**: Every donation is recorded on the blockchain and can be tracked in real-time
- **Direct Impact**: Donations go directly to approved projects without unnecessary intermediaries
- **Project Verification**: Admin approval system ensures legitimate projects reach the platform
- **Geographic Mapping**: Visual representation of projects across Israel
- **User-Friendly Interface**: Simple design that makes blockchain technology accessible to everyone

## Technology Stack

### Backend
- **Flask** (Python) - Web framework
- **MongoDB** - Database for user and project data
- **PyMongo** - MongoDB integration
- **JWT** - Authentication system
- **Flask-Mail** - Email notifications

### Blockchain
- **Ethereum** - Smart contract platform
- **Solidity** - Smart contract development
- **Web3.py** - Blockchain integration
- **MetaMask** - Wallet connection

### Frontend
- **HTML5/CSS3/JavaScript** - Core web technologies
- **Leaflet.js** - Interactive maps
- **Responsive Design** - Mobile-friendly interface

## Key Features

### For Donors
- Connect crypto wallet (MetaMask)
- Browse approved projects on interactive map
- Donate to specific projects or regions
- Track donation progress in real-time
- Receive blockchain transaction confirmations

### For Project Requesters
- Submit detailed project proposals
- Upload supporting documentation
- Receive funds directly to their wallet
- Provide progress updates to donors

### For Administrators
- Review and approve/reject project submissions
- Monitor platform activity
- Manage user accounts and project status

## Smart Contract Features

```solidity
// Core donation functionality
function donate(string memory region) public payable {
    require(msg.value > 0, "Donation must be greater than 0");
    balances[region] += msg.value;
}

// Direct project donations
function donateToProject(string memory projectId) public payable {
    require(projects[projectId].exists, "Project does not exist");
    projects[projectId].currentAmount += msg.value;
    // Transfer directly to project beneficiary
    (bool sent, ) = projects[projectId].beneficiary.call{value: msg.value}("");
    require(sent, "Failed to send Ether");
}
```

## Project Structure

```
lifeSpark/
├── app/
│   ├── routes/          # API endpoints
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── static/          # CSS, JS, images
│   └── templates/       # HTML templates
├── contracts/           # Smart contracts
├── requirements.txt     # Python dependencies
└── run.py              # Application entry point
```

## Installation & Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd lifeSpark
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/lifeSparkDB

# Blockchain settings
BLOCKCHAIN_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138

# Email configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

4. **Run the application**
```bash
python run.py
```

## Security Features

- **JWT Authentication** - Secure user sessions
- **Custom CAPTCHA** - Prevents automated abuse
- **Input Validation** - Server-side data validation
- **File Upload Security** - Safe document handling
- **Role-based Access** - Different permissions for users

## Testing

The platform has been tested with:
- Local Ethereum development environment (Ganache)
- MongoDB database operations
- User authentication flows
- Smart contract functionality
- File upload and validation

## Future Enhancements

- Mobile application development
- Support for additional cryptocurrencies
- Advanced analytics dashboard
- Multi-language interface
- Integration with other blockchain networks

## Challenges & Solutions

**Challenge**: Making blockchain technology accessible to non-technical users  
**Solution**: Intuitive interface with guided wallet connection and clear transaction feedback

**Challenge**: Ensuring project legitimacy  
**Solution**: Multi-step admin approval process with document verification

**Challenge**: Balancing transparency with privacy  
**Solution**: Public transaction tracking while protecting personal information

## Impact

LifeSpark demonstrates how blockchain technology can solve real-world problems in charitable giving during crisis situations. Specifically developed in response to the Iron Swords War, the platform helps ensure that donations reach war victims efficiently and verifiably, providing both immediate aid and long-term support for affected communities.

## License

This project is developed as an academic final year project for Information Systems Engineering.

---

**Note**: This project was developed as a final year thesis for the Department of Software and Information Systems Engineering at Ben-Gurion University of the Negev, specifically addressing the humanitarian needs arising from the Iron Swords War.