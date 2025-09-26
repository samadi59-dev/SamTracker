// --- FORM ELEMENTS
const trackerForm = document.getElementById("trackerForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInputs = document.querySelectorAll("input[name='type']");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submit");

// --- DASHBOARD VALUES
const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");

// --- HISTORY CONTROLS
const searchInput = document.querySelector("input[type='search']");
const filterSelect = document.getElementById("options-tran");

// --- TRANSACTION DISPLAY
const noView = document.getElementById("no-view");
const transContainer = document.querySelector("#list-cont");
const tranNoSer = document.querySelector("#trnas-dis");

// - models btn/

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const cancelEditBtn = document.getElementById("cancelEdit");

// - print and pdf 

const printed = document.getElementById("printBtn")
const pdfs =document.getElementById("pdfBtn")

// - Edit Inputs
const editDescription = document.getElementById("editDescription");
const editAmount = document.getElementById("editAmount");
const editDate = document.getElementById("editDate");
const editType = document.getElementById("editType");
const editCategory = document.getElementById("editCategory");

// clear button
const clearBtn = document.getElementById("clear-btn");
const clearModal = document.getElementById("clear-modal");
const confirmClear = document.getElementById("confirmClear");
const cancelClear = document.getElementById("cancelClear");

// darkmode toggle and actions
const toggleBtn = document.querySelector("#mode-toggle");

dateInput.value = new Date().toISOString().split("T")[0];

toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.classList.remove("bxs-moon");
        toggleBtn.classList.add("bxs-sun");
        localStorage.setItem("mode", "dark");
    } else {
        toggleBtn.classList.remove("bxs-sun");
        toggleBtn.classList.add("bxs-moon");
        localStorage.setItem("mode", "light");
    }
});

window.addEventListener("DOMContentLoaded", function () {
    const GetToLocal = localStorage.getItem("mode");

    if (GetToLocal === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.classList.replace("bxs-moon", "bxs-sun");
    }
});

// --- PRINT and pdf functions

function TransPrint() {
    const transactions = GetToLocal();

    if (transactions.length === 0) {
        alert("No transactions to print!");
        return;
    }

    // Diyaari rows
    let rows = transactions
        .map(
            (t, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td>${t.date}</td>
            <td>${t.type === "income" ? "Income" : "Expense"}</td>
            <td>${formatCurrency(t.amount)}</td>
        </tr>
    `
        )
        .join("");

    // Xisaabi summary
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    // Jadwalka print-ka
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(`
        <html>
            <head>
                <title>Transactions Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                    th { background: #2980b9; color: white; }
                    tfoot td { font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>Expense Tracker - Transactions Report</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5">Total Income</td>
                            <td>${formatCurrency(income)}</td>
                        </tr>
                        <tr>
                            <td colspan="5">Total Expenses</td>
                            <td>${formatCurrency(expenses)}</td>
                        </tr>
                        <tr>
                            <td colspan="5">Balance</td>
                            <td>${formatCurrency(balance)}</td>
                        </tr>
                    </tfoot>
                </table>
                <script>window.print();</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function transPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const transactions = GetToLocal();

    if (transactions.length === 0) {
        alert("No transactions to export!");
        return;
    }

    // -------- Xisaabinta Summary --------
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // -------- Title --------
    doc.setFontSize(16);
    doc.text("Expense Tracker - Transactions Report", 14, 15);

    // -------- Summary Dashboard --------
    doc.setFontSize(12);
    doc.text(`Total Income: ${formatCurrency(income)}`, 14, 25);
    doc.text(`Total Expenses: ${formatCurrency(expenses)}`, 14, 32);
    doc.text(`Balance: ${formatCurrency(balance)}`, 14, 39);

    // -------- Table Data --------
    const tableData = transactions.map((t, index) => [
        index + 1,
        t.description,
        t.category,
        t.date,
        t.type === "income" ? "Income" : "Expense",
        formatCurrency(t.amount),
    ]);

    doc.autoTable({
        startY: 50,
        head: [["#", "Description", "Category", "Date", "Type", "Amount"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }, // buluug
        styles: { fontSize: 10 },
    });

    // -------- Save --------
    doc.save("transactions_report.pdf");
}



// LocalStorage Functions
function GetToLocal() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveLocalTran(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addLocalTran(transaction) {
    const transactions = GetToLocal();
    transactions.push(transaction);
    saveLocalTran(transactions);
}

// format currency

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

// update dashboard

function dashboardUpdate() {
    const transaction = GetToLocal();

    const income = transaction
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transaction
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    const getNumericValue = (el) =>
        parseFloat(el.textContent.replace(/[^0-9.-]+/g, "")) || 0;

    // animateValue(totalIncomeEl, getNumericValue(totalIncomeEl),income,500)
    // animateValue(totalBalanceEl, getNumericValue(totalBalanceEl),balance,500)
    // animateValue(totalExpensesEl, getNumericValue(totalExpensesEl),expenses,500)

    totalIncomeEl.textContent = formatCurrency(income);
    totalBalanceEl.textContent = formatCurrency(balance);
    totalExpensesEl.textContent = formatCurrency(expenses);
}

function tranSearchSwitch() {
    transContainer.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = filterSelect.value;

    const transactions = GetToLocal();

    // Filter
    let FilterTransactions = transactions.filter(
        (t) =>
            (t.description ?? "").toLowerCase().includes(searchTerm) ||
            (t.category ?? "").toLowerCase().includes(searchTerm)
    );

    // Sort
    FilterTransactions.sort((a, b) => {
        switch (sortValue) {
            case "date_asc":
                return new Date(a.date) - new Date(b.date);
            case "date_desc":
                return new Date(b.date) - new Date(a.date);
            case "amount_desc":
                return b.amount - a.amount;
            case "amount_asc":
                return a.amount - b.amount;
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });

    // Render filtered results
    if (FilterTransactions.length === 0) {
        noView.style.display = "none";
        const row = document.createElement("tr");
        row.className = "no-search";
        row.innerHTML = `<td>No transactions match your search.</td>`;
        transContainer.appendChild(row);
    } else {
        FilterTransactions.forEach((tr) => {
            const row = renderTransectionItem(tr);
            transContainer.appendChild(row);
        });
    }
}
function renderTransectionItem(tra) {
    const div = document.createElement("div");
    div.classList.add("tran-view");

    const amountColor = tra.type === "income" ? "green" : "red";
    const amountSign = tra.type === "income" ? "+" : "-";

    div.innerHTML = `
        <span class="list-span serv">${tra.description} <br><small>${tra.category
        }</small></span>
        <span class="list-span">${tra.date}</span>
        <span class="list-span" style="color:${amountColor}">${amountSign} ${formatCurrency(
            tra.amount
        )}</span>
        <div class="list-span">
            <button class="edit-btn"><i class="bx bxs-edit"></i></button>
            <button class="delete-btn"><i class="bx bxs-trash"></i></button>
        </div>
    `;

    // Edit event
    div.querySelector(".edit-btn").addEventListener("click", () => {
        openEditModal(tra);
    });

    // Delete event
    div.querySelector(".delete-btn").addEventListener("click", () => {
        openDeleteModal(tra.id);
    });

    return div;
}

// --- Render all Transactions ---
function renderTransection() {
    transContainer.innerHTML = "";
    const transactions = GetToLocal();

    if (transactions.length === 0) {
        noView.style.display = "flex";
    } else {
        noView.style.display = "none";
        transactions.forEach((tra) => {
            const row = renderTransectionItem(tra);
            transContainer.appendChild(row);
        });
    }
}

function openDeleteModal(id) {
    currentDeleteId = id;
    deleteModal.style.display = "flex";
}
function openEditModal(transaction) {
    currentEditId = transaction.id;
    editDescription.value = transaction.description;
    editAmount.value = transaction.amount;
    editDate.value = transaction.date;
    editType.value = transaction.type;
    editCategory.value = transaction.category;
    editModal.style.display = "flex";
}

// --- Close Modals ---
function closeDeleteModal() {
    deleteModal.style.display = "none";
    currentDeleteId = null;
}
function closeEditModal() {
    editModal.style.display = "none";
    currentEditId = null;
}

// clear all data actions

clearBtn.addEventListener("click", function () {
    clearModal.style.display = "flex";
});

cancelClear.addEventListener("click", function () {
    clearModal.style.display = "none";
});
clearModal.addEventListener("click", function (e) {
    if (e.target === clearModal) {
        clearModal.style.display = "none";
    }
});

confirmClear.addEventListener("click", function () {
    let transactions = GetToLocal();

    transactions = [];
    saveLocalTran(transactions);
    dashboardUpdate();
    renderTransection();

    clearModal.style.display = "none";
});

// --- Delete Confirm ---
confirmDeleteBtn.addEventListener("click", () => {
    let transactions = GetToLocal();
    transactions = transactions.filter((t) => t.id !== currentDeleteId);
    saveLocalTran(transactions);
    renderTransection();
    dashboardUpdate();
    closeDeleteModal();
});
deleteModal.addEventListener("click", function (e) {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

cancelDeleteBtn.addEventListener("click", closeDeleteModal);

// --- Edit Save ---
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let transactions = GetToLocal();

    transactions = transactions.map((t) => {
        if (t.id === currentEditId) {
            return {
                ...t,
                description: editDescription.value,
                amount: parseFloat(editAmount.value),
                date: editDate.value,
                type: editType.value,
                category: editCategory.value,
            };
        }
        return t;
    });

    saveLocalTran(transactions);
    renderTransection();
    dashboardUpdate();
    closeEditModal();
});
editModal.addEventListener("click", function (e) {
    if (e.target === editModal) {
        closeEditModal();
    }
});

cancelEditBtn.addEventListener("click", closeEditModal);

// --- Form Submit ---
trackerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const type = [...typeInputs].find((r) => r.checked).value;

    const transaction = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value,
        type: type,
        category: categorySelect.value,
    };

    console.log(transaction.description);

    addLocalTran(transaction);
    renderTransection();
    dashboardUpdate();

    trackerForm.reset();
});

// pdf and print event 

printed.addEventListener("click",TransPrint)
pdfs.addEventListener("click",transPdf)

// search and sort event

searchInput.addEventListener("input", tranSearchSwitch);
filterSelect.addEventListener("change", tranSearchSwitch);

// Load Transactions  Page  ---
document.addEventListener("DOMContentLoaded", function () {
    renderTransection();
    dashboardUpdate();
});
