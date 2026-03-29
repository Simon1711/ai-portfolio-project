const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // 1. Remove token from localStorage
        sessionStorage.removeItem("token");

        // 2. Optional: show message
        alert("Logged out successfully");

        // 3. Redirect to login page
        window.location.href = "login.html";
    });
}