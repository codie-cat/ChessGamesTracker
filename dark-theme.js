// Add this to your existing script.js

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Save theme preference in localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Load theme preference on page load
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkTheme');
    
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
    }
}

// Add theme toggle button to your HTML
function createThemeToggleButton() {
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.innerHTML = '🌓'; // Moon and sun emoji
    themeToggleBtn.id = 'theme-toggle-btn';
    themeToggleBtn.style.position = 'fixed';
    themeToggleBtn.style.bottom = '20px';
    themeToggleBtn.style.right = '20px';
    themeToggleBtn.style.zIndex = '1000';
    themeToggleBtn.style.backgroundColor = 'transparent';
    themeToggleBtn.style.border = 'none';
    themeToggleBtn.style.fontSize = '24px';
    themeToggleBtn.style.cursor = 'pointer';
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    document.body.appendChild(themeToggleBtn);
}

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    createThemeToggleButton();
});