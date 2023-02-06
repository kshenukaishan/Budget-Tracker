const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function generateTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
  <p>
    <span>${source}</span>
    <span class="time">${time}</span>
  </p>
  $<span>${Math.abs(amount)}</span>
  <button class="delete">X</button>
</li>`;
}

function addTransactionDom(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time);
  }
}

function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source,
    amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDom(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.source.value.trim() === "" || form.amount.value === "") {
    return alert("Please add propper values");
  }
  addTransaction(form.source.value, Number(form.amount.value));
  updateStatistics();
  form.reset();
});

function getTransactions() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}

function deleteTranscation(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTranscation(Number(e.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTranscation(Number(e.target.parentElement.dataset.id));
    updateStatistics();
  }
});

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);
  console.log(updatedIncome);
  income.textContent = updatedIncome;

  const updatedexpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  console.log(updatedexpense);
  expense.textContent = updatedexpense;

  const updatedBalance = updatedIncome - updatedexpense;
  balance.textContent = updatedBalance;
}

function init() {
  getTransactions();
  updateStatistics();
}

init();
