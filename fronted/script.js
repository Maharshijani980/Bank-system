const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";

// Helper function to handle fetch responses
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {"Content-Type": "application/json"},
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

function adminLogin() {
    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (username === "Rushikesh" && password === "Rj12345@") {
        window.location.href = "admin.html";
    } else {
        alert("Invalid admin credentials. Please check username and password.");
    }
}

function login() {
    const loginId = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!loginId || !password) {
        alert("Please enter both Login ID and password.");
        return;
    }

    fetchAPI("/customer/login", {
        method: "POST",
        body: JSON.stringify({ loginId, password })
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else if (data.message === "Login Success") {
            localStorage.setItem("customerLoginId", data.customer.LoginId);
            window.location.href = "dashboard.html";
        } else {
            alert("Unexpected response");
        }
    })
    .catch(err => alert("Login Error: " + err.message));
}

function register() {
    const name = document.getElementById("name").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("regPassword").value.trim();
    const internetBanking = document.getElementById("internetBanking").checked;

    if (!name || !contact || !dob) {
        alert("Please fill in all required fields.");
        return;
    }

    // Validate contact - only 10 digits
    if (!/^\d{10}$/.test(contact)) {
        alert("Contact number must be exactly 10 digits with no letters or special characters.");
        return;
    }

    const [firstName = "", ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ");

    fetchAPI("/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, contact, email, address, dob, password, internetBanking })
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(`Registered successfully!\nLogin ID: ${data.loginId}\nPassword: ${data.password}`);
            document.getElementById("name").value = "";
            document.getElementById("contact").value = "";
            document.getElementById("email").value = "";
            document.getElementById("address").value = "";
            document.getElementById("dob").value = "";
            document.getElementById("regPassword").value = "";
            document.getElementById("internetBanking").checked = false;
        }
    })
    .catch(err => alert("Registration Error: " + err.message));
}

function createCustomerAdmin() {
    const name = document.getElementById("adminName").value.trim();
    const contact = document.getElementById("adminContact").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const address = document.getElementById("adminAddress").value.trim();
    const dob = document.getElementById("adminDob").value;
    const aadharCard = document.getElementById("adminAadharCard").value.trim();
    const documentFile = document.getElementById("adminDocument").files[0];
    const accountType = document.getElementById("adminAccountType").value;
    const initialDeposit = document.getElementById("adminInitialDeposit").value;
    const internetBanking = document.getElementById("adminInternetBanking").checked;

    if (!name || !contact || !dob) {
        alert("Please fill in all required fields (Name, Contact, DOB).");
        return;
    }

    // Validate contact - only 10 digits
    if (!/^\d{10}$/.test(contact)) {
        alert("Contact number must be exactly 10 digits with no letters or special characters.");
        return;
    }

    // Validate Aadhar - only 12 digits
    if (aadharCard && !/^\d{12}$/.test(aadharCard)) {
        alert("Aadhar Card number must be exactly 12 digits with no letters or special characters.");
        return;
    }

    if (documentFile) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (documentFile.size > maxSize) {
            alert("Document file is too large. Maximum size is 5MB.");
            return;
        }
    }

    // Generate random password
    const password = `Bank${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.floor(Math.random() * 1000)}`;

    const [firstName = "", ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ");

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("contact", contact);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("dob", dob);
    formData.append("aadharCard", aadharCard);
    formData.append("password", password);
    formData.append("accountType", accountType);
    formData.append("initialDeposit", initialDeposit || 0);
    formData.append("internetBanking", internetBanking);
    if (documentFile) {
        formData.append("document", documentFile);
    }

    // Use native fetch for FormData with file upload
    fetch("http://localhost:3000/admin/createCustomer", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            document.getElementById("adminResult").textContent = `${data.message}\nLogin ID: ${data.loginId}\nPassword: ${data.password}${data.accountNumber ? `\nAccount Number: ${data.accountNumber}` : ""}`;
            document.getElementById("adminName").value = "";
            document.getElementById("adminContact").value = "";
            document.getElementById("adminEmail").value = "";
            document.getElementById("adminAddress").value = "";
            document.getElementById("adminDob").value = "";
            document.getElementById("adminAadharCard").value = "";
            document.getElementById("adminDocument").value = "";
            document.getElementById("adminAccountType").value = "";
            document.getElementById("adminInitialDeposit").value = "";
            document.getElementById("adminInternetBanking").checked = false;
        }
    })
    .catch(err => alert("Error creating customer: " + err.message));
}

function createAccountAdmin() {
    const loginId = document.getElementById("existingLoginId").value.trim();
    const accountType = document.getElementById("existingAccountType").value;
    const initialDeposit = document.getElementById("existingInitialDeposit").value;
    const internetBanking = document.getElementById("existingInternetBanking").checked;

    if (!loginId || !accountType) {
        alert("Please enter the customer Login ID and account type.");
        return;
    }

    fetchAPI("/admin/createAccount", {
        method: "POST",
        body: JSON.stringify({
            loginId,
            accountType,
            initialDeposit: initialDeposit || 0,
            internetBanking
        })
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            document.getElementById("adminResult").textContent = `${data.message}\nCustomer ID: ${data.customerId}\nAccount Number: ${data.accountNumber}`;
            document.getElementById("existingLoginId").value = "";
            document.getElementById("existingAccountType").value = "";
            document.getElementById("existingInitialDeposit").value = "";
            document.getElementById("existingInternetBanking").checked = false;
        }
    })
    .catch(err => alert("Error creating account: " + err.message));
}

function getAccountDetails() {
    // Disabled for customer dashboard - moved to admin only
    alert("Account details search has been moved to the Admin Dashboard.");
    return;
}

function getCustomerLoginId() {
    return localStorage.getItem("customerLoginId");
}

function initDashboard() {
    const loginId = getCustomerLoginId();
    if (!loginId) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    fetchAPI(`/customer/profile/${loginId}`)
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }
        document.getElementById("customerIdDisplay").textContent = data.customer.LoginId;
        document.getElementById("customerName").textContent = data.customer.Name;
        populateAccounts(data.accounts);
    })
    .catch(err => alert("Dashboard Error: " + err.message));
}

function populateAccounts(accounts) {
    const select = document.getElementById("txnAccSelect");
    const summary = document.getElementById("accountSummary");

    select.innerHTML = '<option value="">-- Select Account --</option>';
    summary.innerHTML = "";

    if (!Array.isArray(accounts) || accounts.length === 0) {
        summary.innerHTML = "<p>No accounts found for this customer.</p>";
        return;
    }

    accounts.forEach(acc => {
        const opt = document.createElement("option");
        opt.value = acc.AccountNumber;
        opt.setAttribute("data-type", acc.AccountType);
        opt.textContent = `${acc.AccountType.toUpperCase()} - ${acc.AccountNumber}`;
        select.appendChild(opt);

        const card = document.createElement("div");
        card.className = "account-card";
        card.innerHTML = `
            <h3>${acc.AccountType.toUpperCase()} - ${acc.AccountNumber}</h3>
            <p><strong>Balance:</strong> ₹${parseFloat(acc.Balance).toFixed(2)}</p>
            <p><strong>IFSC:</strong> ${acc.IFSC}</p>
            <p><strong>Status:</strong> ${acc.Status}</p>
            <p><strong>Internet Banking:</strong> ${acc.InternetBankingEnabled ? "Enabled" : "Disabled"}</p>
        `;
        summary.appendChild(card);
    });
}

function redirectToTransactionPage() {
    const select = document.getElementById("txnAccSelect");
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || !selectedOption.value) return;
    
    const accountType = selectedOption.getAttribute("data-type");
    const accountNumber = selectedOption.value;
    
    if (accountType === "current") {
        window.location.href = `current-transaction.html?account=${accountNumber}`;
    } else if (accountType === "saving") {
        window.location.href = `saving-transaction.html?account=${accountNumber}`;
    }
}

function previewAllTransactions() {
    const loginId = getCustomerLoginId();
    if (!loginId) {
        alert("Please login first");
        return;
    }
    
    fetchAPI(`/transactions-all/${loginId}`)
    .then(data => {
        displayTransactions(data);
    })
    .catch(err => alert("Error loading transactions: " + err.message));
}

function loadTransactions() {
    const select = document.getElementById("txnAccSelect");
    if (!select || !select.value) {
        alert("Please select an account first.");
        return;
    }

    fetchAPI(`/transactions/${select.value}`)
    .then(data => displayTransactions(data))
    .catch(err => alert("Error loading transactions: " + err.message));
}

function displayTransactions(data) {
    const tableBody = document.getElementById("tableBody");
    const chartContainer = document.getElementById("chartContainer");

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No transactions found.</td></tr>';
        chartContainer.style.display = "none";
        return;
    }

    let html = "";
    let totalAmount = 0;

    data.forEach(transaction => {
        // Format date from TxnDate
        const dateObj = new Date(transaction.TxnDate);
        const formattedDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        // Format time from TxnTime (format: HH:MM:SS)
        const timeString = transaction.TxnTime || "00:00:00";
        const [hours, minutes, seconds] = timeString.split(':');
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
        const formattedTime = timeDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        
        html += `
            <tr>
                <td>${transaction.TransId}</td>
                <td>${transaction.AccountId}</td>
                <td>₹${parseFloat(transaction.Amount).toFixed(2)}</td>
                <td><strong>${transaction.Type.toUpperCase()}</strong></td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
            </tr>
        `;
        totalAmount += parseFloat(transaction.Amount);
    });

    tableBody.innerHTML = html;
    document.getElementById("totalTrans").textContent = data.length;
    document.getElementById("totalAmount").textContent = `₹${totalAmount.toFixed(2)}`;
    chartContainer.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith("dashboard.html")) {
        initDashboard();
    }
});

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("customerLoginId");
        window.location.href = "index.html";
    }
}

function changePassword() {
    const loginId = getCustomerLoginId();
    if (!loginId) {
        alert("Please login first");
        return;
    }

    const oldPassword = prompt("Enter your current password:");
    if (!oldPassword) return;

    const newPassword = prompt("Enter your new password (min 6 characters):");
    if (!newPassword) return;

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    const confirmPassword = prompt("Confirm your new password:");
    if (confirmPassword !== newPassword) {
        alert("Passwords do not match");
        return;
    }

    fetchAPI("/customer/change-password", {
        method: "POST",
        body: JSON.stringify({ loginId, oldPassword, newPassword })
    })
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert(data.message);
        }
    })
    .catch(err => alert("Password change error: " + err.message));
}

// Real-time input validation for phone and Aadhar numbers
document.addEventListener("DOMContentLoaded", () => {
    // Contact input - allow only digits, max 10
    const contactInputs = document.querySelectorAll('input[placeholder*="Contact"]');
    contactInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    });

    // Aadhar input - allow only digits, max 12
    const aadharInputs = document.querySelectorAll('input[placeholder*="Aadhar"], input[placeholder*="aadhar"]');
    aadharInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 12);
        });
    });
});
