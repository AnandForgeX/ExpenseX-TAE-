/* =====================================================
   EXPENSEX - AUTHENTICATION
   ===================================================== */


/* ================= AUTH ELEMENTS ================= */

const authScreen =
    document.getElementById("authScreen");

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");

const loginError =
    document.getElementById("loginError");

const registerError =
    document.getElementById("registerError");

const logoutBtn =
    document.getElementById("logoutBtn");

const userNameDisplay =
    document.getElementById("userNameDisplay");


/* ================= USER FUNCTIONS ================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("expenseXUsers")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "expenseXUsers",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "expenseXCurrentUser"
        )
    );

}


function setCurrentUser(user) {

    localStorage.setItem(
        "expenseXCurrentUser",
        JSON.stringify(user)
    );

}


function showAuthError(element, message) {

    element.textContent = message;

    element.classList.remove("hidden");

}


function hideAuthError(element) {

    element.textContent = "";

    element.classList.add("hidden");

}


/* ================= LOGIN / REGISTER SWITCH ================= */

showRegister.addEventListener(
    "click",
    function () {

        loginBox.classList.add("hidden");

        registerBox.classList.remove("hidden");

        hideAuthError(loginError);

        hideAuthError(registerError);

    }
);


showLogin.addEventListener(
    "click",
    function () {

        registerBox.classList.add("hidden");

        loginBox.classList.remove("hidden");

        hideAuthError(loginError);

        hideAuthError(registerError);

    }
);


/* ================= REGISTER ================= */

registerForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const name =
            document
                .getElementById("registerName")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        const users = getUsers();


        const existingUser =
            users.find(
                user =>
                    user.email === email
            );


        if (existingUser) {

            showAuthError(
                registerError,
                "An account with this email already exists."
            );

            return;

        }


        if (password.length < 6) {

            showAuthError(
                registerError,
                "Password must be at least 6 characters."
            );

            return;

        }


        const newUser = {

            id: Date.now(),

            name: name,

            email: email,

            password: password

        };


        users.push(newUser);

        saveUsers(users);


        setCurrentUser({

            id: newUser.id,

            name: newUser.name,

            email: newUser.email

        });


        registerForm.reset();


        initializeApp();

    }
);


/* ================= LOGIN ================= */

loginForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        const users = getUsers();


        const user =
            users.find(
                user =>
                    user.email === email &&
                    user.password === password
            );


        if (!user) {

            showAuthError(
                loginError,
                "Invalid email or password."
            );

            return;

        }


        setCurrentUser({

            id: user.id,

            name: user.name,

            email: user.email

        });


        loginForm.reset();


        initializeApp();

    }
);


/* ================= LOGOUT ================= */

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "expenseXCurrentUser"
        );


        location.reload();

    }
);


/* =====================================================
   TRANSACTION SYSTEM
   ===================================================== */


/* ================= FORM ELEMENTS ================= */

const form =
    document.getElementById("transactionForm");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const descriptionInput =
    document.getElementById("description");

const dateInput =
    document.getElementById("date");

const errorMessage =
    document.getElementById("errorMessage");


const searchInput =
    document.getElementById("search");

const categoryFilter =
    document.getElementById("categoryFilter");

const typeFilter =
    document.getElementById("typeFilter");


const transactionTable =
    document.getElementById("transactionTable");

const mobileTransactions =
    document.getElementById("mobileTransactions");

const emptyMessage =
    document.getElementById("emptyMessage");


const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");


const transactionCount =
    document.getElementById("transactionCount");

const mostUsedCategory =
    document.getElementById("mostUsedCategory");


const clearAllBtn =
    document.getElementById("clearAllBtn");


const descriptionWrapper =
    document.getElementById(
        "descriptionWrapper"
    );


const categoryLabel =
    document.querySelector(
        'label[for="category"]'
    );


const typeRadios =
    document.querySelectorAll(
        'input[name="type"]'
    );


/* ================= TRANSACTIONS ================= */

let transactions = [];


/* ================= CATEGORIES ================= */

const incomeCategories = [

    "Pocket Money",

    "Salary",

    "Scholarship",

    "Gift",

    "Freelance",

    "Other Income"

];


const expenseCategories = [

    "Food",

    "Travel",

    "Shopping",

    "Education",

    "Bills",

    "Other Expense"

];


/* ================= TRANSACTION STORAGE ================= */

function getTransactionKey() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        return null;

    }


    return `expenseXTransactions_${currentUser.email}`;

}


function loadUserTransactions() {

    const key =
        getTransactionKey();


    if (!key) {

        transactions = [];

        return;

    }


    transactions =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];

}


function saveTransactions() {

    const key =
        getTransactionKey();


    if (!key) {

        return;

    }


    localStorage.setItem(
        key,
        JSON.stringify(transactions)
    );

}


/* ================= CATEGORY UPDATE ================= */

function updateCategoryOptions() {

    const selectedType =
        document.querySelector(
            'input[name="type"]:checked'
        ).value;


    const categories =
        selectedType === "Income"
            ? incomeCategories
            : expenseCategories;


    categoryLabel.textContent =
        selectedType === "Income"
            ? "Income Category"
            : "Expense Category";


    categoryInput.innerHTML =
        `<option value="">
            Select ${selectedType} Category
        </option>`;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryInput.appendChild(
                option
            );

        }
    );


    /* Description for BOTH types */

    descriptionWrapper.classList.remove(
        "hidden"
    );


    descriptionInput.required = true;

}


typeRadios.forEach(
    radio => {

        radio.addEventListener(
            "change",
            updateCategoryOptions
        );

    }
);


/* ================= ERROR MESSAGE ================= */

function showError(message) {

    errorMessage.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            errorMessage.classList.add(
                "hidden"
            );

        },
        3000
    );

}


/* ================= ADD TRANSACTION ================= */

form.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const amount =
            parseFloat(
                amountInput.value
            );


        const category =
            categoryInput.value;


        const description =
            descriptionInput.value
                .trim();


        const date =
            dateInput.value;


        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;


        if (!amount || amount <= 0) {

            showError(
                "Please enter a valid amount."
            );

            return;

        }


        if (!category) {

            showError(
                "Please select a category."
            );

            return;

        }


        if (!description) {

            showError(
                "Description cannot be empty."
            );

            return;

        }


        if (!date) {

            showError(
                "Please select a date."
            );

            return;

        }


        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            category: category,

            date: date,

            type: type

        };


        transactions.push(
            transaction
        );


        saveTransactions();


        form.reset();


        document.querySelector(
            'input[name="type"][value="Income"]'
        ).checked = true;


        updateCategoryOptions();


        renderTransactions();


        updateDashboard();

    }
);


/* ================= DELETE TRANSACTION ================= */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();


    renderTransactions();


    updateDashboard();

}


/* ================= RENDER TRANSACTIONS ================= */

function renderTransactions() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const selectedType =
        typeFilter.value;


    const filteredTransactions =
        transactions.filter(
            transaction => {

                const description =
                    transaction.description ||
                    "";


                const matchesSearch =

                    description
                        .toLowerCase()
                        .includes(
                            searchTerm
                        )

                    ||

                    transaction.category
                        .toLowerCase()
                        .includes(
                            searchTerm
                        );


                const matchesCategory =

                    selectedCategory === "All"

                    ||

                    transaction.category ===
                    selectedCategory;


                const matchesType =

                    selectedType === "All"

                    ||

                    transaction.type ===
                    selectedType;


                return (

                    matchesSearch &&

                    matchesCategory &&

                    matchesType

                );

            }
        );


    transactionTable.innerHTML =
        "";


    mobileTransactions.innerHTML =
        "";


    if (
        filteredTransactions.length === 0
    ) {

        emptyMessage.classList.remove(
            "hidden"
        );

        return;

    }


    emptyMessage.classList.add(
        "hidden"
    );


    filteredTransactions
        .slice()
        .reverse()
        .forEach(
            transaction => {


                const amountClass =
                    transaction.type === "Income"

                        ? "text-green-600"

                        : "text-red-600";


                const sign =
                    transaction.type === "Income"

                        ? "+"

                        : "-";


                const typeBadge =
                    transaction.type === "Income"

                        ? "bg-green-100 text-green-700"

                        : "bg-red-100 text-red-700";


                /* Desktop Row */

                const row =
                    document.createElement(
                        "tr"
                    );


                row.className =
                    "border-b hover:bg-slate-50 transition-all duration-200";


                row.innerHTML = `

                    <td class="px-6 py-4 font-medium">
                        ${escapeHTML(
                            transaction.description ||
                            "-"
                        )}
                    </td>

                    <td class="px-6 py-4">
                        ${escapeHTML(
                            transaction.category
                        )}
                    </td>

                    <td class="px-6 py-4">
                        ${escapeHTML(
                            transaction.date
                        )}
                    </td>

                    <td class="px-6 py-4">

                        <span class="
                            px-3 py-1 rounded-full
                            text-xs font-semibold
                            ${typeBadge}
                        ">

                            ${transaction.type}

                        </span>

                    </td>

                    <td class="
                        px-6 py-4
                        font-bold
                        ${amountClass}
                    ">

                        ${sign} ₹${Number(
                            transaction.amount
                        ).toFixed(2)}

                    </td>

                    <td class="px-6 py-4">

                        <button
                            onclick="deleteTransaction(${transaction.id})"
                            class="
                                bg-red-50
                                text-red-600
                                px-3 py-1.5
                                rounded-lg
                                hover:bg-red-100
                                transition-all duration-200
                            ">

                            Delete

                        </button>

                    </td>

                `;


                transactionTable.appendChild(
                    row
                );


                /* Mobile Card */

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "bg-slate-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200";


                card.innerHTML = `

                    <div
                        class="flex justify-between
                               items-start gap-4">

                        <div>

                            <p class="font-bold">

                                ${escapeHTML(
                                    transaction.description ||
                                    transaction.category
                                )}

                            </p>

                            <p
                                class="text-sm
                                       text-slate-500 mt-1">

                                ${escapeHTML(
                                    transaction.category
                                )}

                                •

                                ${escapeHTML(
                                    transaction.date
                                )}

                            </p>

                        </div>


                        <p class="
                            font-bold
                            ${amountClass}
                        ">

                            ${sign}
                            ₹${Number(
                                transaction.amount
                            ).toFixed(2)}

                        </p>

                    </div>


                    <div
                        class="flex justify-between
                               items-center mt-4">


                        <span class="
                            px-3 py-1 rounded-full
                            text-xs font-semibold
                            ${typeBadge}
                        ">

                            ${transaction.type}

                        </span>


                        <button
                            onclick="deleteTransaction(${transaction.id})"
                            class="
                                text-red-600
                                text-sm
                                font-semibold
                                hover:text-red-800
                                transition-colors
                            ">

                            Delete

                        </button>

                    </div>

                `;


                mobileTransactions.appendChild(
                    card
                );

            }
        );

}


/* ================= HTML SECURITY ================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type ===
                "Income"
            ) {

                income += amount;

            } else {

                expense += amount;

            }

        }
    );


    totalIncome.textContent =
        `₹${income.toFixed(2)}`;


    totalExpense.textContent =
        `₹${expense.toFixed(2)}`;


    balance.textContent =
        `₹${(
            income - expense
        ).toFixed(2)}`;


    transactionCount.textContent =
        transactions.length;


    /* Most Used Expense Category */

    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type ===
                "Expense"
        );


    if (
        expenseTransactions.length === 0
    ) {

        mostUsedCategory.textContent =
            "None";

        return;

    }


    const categoryCounts = {};


    expenseTransactions.forEach(
        transaction => {

            categoryCounts[
                transaction.category
            ] =
                (
                    categoryCounts[
                        transaction.category
                    ] || 0
                ) + 1;

        }
    );


    const mostUsed =
        Object.keys(
            categoryCounts
        ).reduce(
            (a, b) =>

                categoryCounts[a] >=
                categoryCounts[b]

                    ? a

                    : b
        );


    mostUsedCategory.textContent =
        mostUsed;

}


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    renderTransactions
);


/* ================= CATEGORY FILTER ================= */

categoryFilter.addEventListener(
    "change",
    renderTransactions
);


/* ================= TYPE FILTER ================= */

typeFilter.addEventListener(
    "change",
    renderTransactions
);


/* ================= CLEAR ALL ================= */

clearAllBtn.addEventListener(
    "click",
    function () {


        if (
            transactions.length === 0
        ) {

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmClear) {

            return;

        }


        transactions = [];


        saveTransactions();


        renderTransactions();


        updateDashboard();

    }
);


/* =====================================================
   INITIALIZE APPLICATION
   ===================================================== */

function initializeApp() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        authScreen.classList.remove(
            "hidden"
        );

        return;

    }


    authScreen.classList.add(
        "hidden"
    );


    userNameDisplay.textContent =
        `👋 ${currentUser.name}`;


    loadUserTransactions();


    updateCategoryOptions();


    renderTransactions();


    updateDashboard();

}


/* ================= START APP ================= */

initializeApp();