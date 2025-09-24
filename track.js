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

// - models btn/

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const cancelEditBtn = document.getElementById("cancelEdit");

// - Edit Inputs 
const editDescription = document.getElementById("editDescription");
const editAmount = document.getElementById("editAmount");
const editDate = document.getElementById("editDate");
const editType = document.getElementById("editType");
const editCategory = document.getElementById("editCategory");

// clear button
const clearBtn = document.getElementById("clear-btn")
const clearModal = document.getElementById("clear-modal");
const confirmClear = document.getElementById("confirmClear");
const cancelClear = document.getElementById("cancelClear");

// darkmode toggle and actions
const toggleBtn = document.querySelector("#mode-toggle")

toggleBtn.addEventListener("click",function(){
    document.body.classList.toggle("dark-mode")

    if (document.body.classList.contains("dark-mode")) {
        
        toggleBtn.classList.remove("bxs-moon")
        toggleBtn.classList.add("bxs-sun")
        localStorage.setItem("mode","dark")
    }else{
        toggleBtn.classList.remove ("bxs-sun")
        toggleBtn.classList.add("bxs-moon")
        localStorage.setItem("mode","light")

    }


})

window.addEventListener("DOMContentLoaded",function(){
    const GetToLocal = localStorage.getItem("mode")

    if (GetToLocal === "dark") {
        document.body.classList.add ("dark-mode")
        toggleBtn.classList.replace("bxs-moon","bxs-sun")
    }
})








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

// --- Render Transactions ---
function renderTransection() {
    transContainer.innerHTML = "";

    const transactions = GetToLocal();

    if (transactions.length === 0) {
        noView.style.display = "flex";
    } else {
        noView.style.display = "none";
    }

    transactions.forEach((tra) => {
        const div = document.createElement("div");
        div.classList.add("tran-view");
        const amountColor = tra.type === "income" ? "green" : "red";
        const amountSign = tra.type === "income" ? "+" : "-";
        div.innerHTML = `
            <span class="list-span serv">${tra.description} <br><small>${tra.category
            }</small></span>
            <span class="list-span" >${tra.date}</span>
            <span class="list-span" style="color:${amountColor}">${amountSign} ${formatCurrency(
                tra.amount
            )}</span>

            <div class="list-span">
                <button class="edit-btn"><i class="bx bxs-edit"></i></button>
                <button class="delete-btn"><i class="bx bxs-trash"></i></button>
            </div>
        `;
        div.querySelector(".edit-btn").addEventListener("click", () => {
            openEditModal(tra);
        });

        // delete click
        div.querySelector(".delete-btn").addEventListener("click", () => {
            openDeleteModal(tra.id);
        });

        transContainer.appendChild(div);
    });
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

clearBtn.addEventListener("click",function(){
    clearModal.style.display = "flex"
})

cancelClear.addEventListener("click",function(){
    clearModal.style.display = "none"
})
clearModal.addEventListener("click",function ( e) {
    if (e.target === clearModal) {
        clearModal.style.display = "none"
    }
})

confirmClear.addEventListener("click",function(){
    let transactions = GetToLocal();

    transactions = [];
    saveLocalTran(transactions)
    dashboardUpdate()
    renderTransection()

    clearModal.style.display = "none"


})

// --- Delete Confirm ---
confirmDeleteBtn.addEventListener("click", () => {
    let transactions = GetToLocal();
    transactions = transactions.filter((t) => t.id !== currentDeleteId);
    saveLocalTran(transactions);
    renderTransection();
    dashboardUpdate();
    closeDeleteModal();
});
deleteModal.addEventListener("click",function(e){
    if (e.target === deleteModal) {
        closeDeleteModal()
    }
})

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
editModal.addEventListener("click",function(e){
    if (e.target === editModal) {
        closeEditModal()
    }
})

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



// Load Transactions  Page  ---
document.addEventListener("DOMContentLoaded", function () {
    renderTransection();
    dashboardUpdate();
});
