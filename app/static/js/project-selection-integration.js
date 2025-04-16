// project-selection-integration.js
// קובץ זה מוסיף את הפונקציונליות לבחירת פרויקט ומשתלב עם המערכת הקיימת

document.addEventListener('DOMContentLoaded', function() {
    // נוסיף את סקריפט פרטי הפרויקט אם הוא לא קיים כבר
    if (!document.getElementById('project-detail-script')) {
        const script = document.createElement('script');
        script.id = 'project-detail-script';
        script.src = '/static/js/project-detail-modal.js';
        document.body.appendChild(script);
    }
    
    // מחכים לטעינת החלקים הרלוונטיים בדף
    const waitForElements = setInterval(function() {
        const projectsCarousel = document.getElementById('approvedProjectsCarousel');
        if (projectsCarousel) {
            clearInterval(waitForElements);
            enhanceProjectSelection();
        }
    }, 500);
});

// פונקציה לשיפור חווית המשתמש בבחירת פרויקטים
function enhanceProjectSelection() {
    console.log("משפר את חווית בחירת הפרויקטים");
    
    // משפר את כרטיסיות הפרויקטים
    enhanceProjectCards();
    
    // מוסיף האזנה לטעינת פרויקטים חדשים
    observeProjectCarousel();
}

// משפר את כרטיסיות הפרויקטים הנוכחיות
function enhanceProjectCards() {
    const projectSlides = document.querySelectorAll('.project-slide');
    
    projectSlides.forEach(slide => {
        // הופך את כל הכרטיסייה ללחיצה
        makeCardClickable(slide);
        
        // מוסיף אירוע hover לאנימציה
        addHoverEffect(slide);
    });
}

// הופך את כל הכרטיסייה ללחיצה
function makeCardClickable(slide) {
    const card = slide.querySelector('.approved-project-card');
    if (!card) return;
    
    // מוסיף מאזין אירועים לכל הכרטיסייה (לא רק לכפתור)
    card.addEventListener('click', function(e) {
        // מתעלם מלחיצה על הכפתור (יש לו כבר מאזין)
        if (e.target.closest('.project-select-btn')) {
            return;
        }
        
        // מדמה לחיצה על כפתור הבחירה
        const selectButton = slide.querySelector('.project-select-btn');
        if (selectButton) {
            selectButton.click();
        }
    });
    
    // מוסיף סמן כדי לציין שהכרטיסייה ניתנת ללחיצה
    card.style.cursor = 'pointer';
}

// מוסיף אפקט hover לכרטיסיות
function addHoverEffect(slide) {
    const card = slide.querySelector('.approved-project-card');
    if (!card) return;
    
    // מוסיף מאזיני אירועים ל-hover
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = 'var(--box-shadow-lg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
}

// מאזין לשינויים בקרוסלת הפרויקטים
function observeProjectCarousel() {
    const carousel = document.getElementById('approvedProjectsCarousel');
    if (!carousel) return;
    
    // יוצר צופה מוטציות
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // כאשר פרויקטים חדשים נוספים, משפר אותם
                enhanceProjectCards();
            }
        });
    });
    
    // מתחיל לצפות בשינויים
    observer.observe(carousel, {
        childList: true,
        subtree: true
    });
}

// אם נדרשת טעינה מחדש של הפרויקטים (אחרי תרומה מוצלחת)
function refreshProjectsAfterDonation() {
    // מנסה להשתמש בפונקציה הקיימת אם היא זמינה
    if (typeof manuallyLoadProjects === 'function') {
        manuallyLoadProjects();
    } 
    // אם לא, מנסה את הפונקציה השנייה שיכולה להיות זמינה
    else if (typeof loadApprovedProjects === 'function') {
        loadApprovedProjects();
    }
}