pragma solidity ^0.8.0;

contract Donation {
    address public owner;
    mapping(string => uint) public balances;
    
    // מבנה נתונים לפרויקט
    struct Project {
        address beneficiary;   // כתובת הארנק של מגיש הפרויקט
        uint256 goalAmount;    // יעד גיוס הכספים
        uint256 currentAmount; // הסכום שגויס עד כה
        bool exists;           // האם הפרויקט קיים
        string region;         // האזור שאליו שייך הפרויקט
    }
    
    // מיפוי לפרויקטים לפי מזהה
    mapping(string => Project) public projects;
    
    constructor() {
        owner = msg.sender;
    }

    // הפונקציה המקורית של donate - נשמור עליה לתאימות לאחור
    function donate(string memory region) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        balances[region] += msg.value;
    }
    
    // הוספת פרויקט חדש - רק בעל החוזה יכול לעשות זאת
    function registerProject(string memory projectId, address beneficiary, uint256 goalAmount, string memory region) public {
        require(msg.sender == owner, "Only owner can register projects");
        require(!projects[projectId].exists, "Project already exists");
        
        projects[projectId] = Project({
            beneficiary: beneficiary,
            goalAmount: goalAmount,
            currentAmount: 0,
            exists: true,
            region: region
        });
    }
    
    // תרומה לפרויקט ספציפי - הכסף מועבר ישירות לכתובת הנהנה
    function donateToProject(string memory projectId) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(projects[projectId].exists, "Project does not exist");
        
        projects[projectId].currentAmount += msg.value;
        
        // מעדכנים גם את מאזן האזור
        balances[projects[projectId].region] += msg.value;
        
        // העברת הכסף ישירות לכתובת הנהנה של הפרויקט
        (bool sent, ) = projects[projectId].beneficiary.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    // הפונקציה המקורית של withdraw - נשמור עליה לתאימות לאחור
    function withdraw(string memory region) public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint amount = balances[region];
        balances[region] = 0;
        payable(owner).transfer(amount);
    }
    
    // החלפנו את הפונקציה balances עם getter פונקציה כדי לשמור על שמות
    function getBalance(string memory region) public view returns (uint) {
        return balances[region];
    }
    
    // קבלת פרטי פרויקט
    function getProjectDetails(string memory projectId) public view returns (address, uint256, uint256, bool, string memory) {
        Project memory project = projects[projectId];
        return (project.beneficiary, project.goalAmount, project.currentAmount, project.exists, project.region);
    }
}