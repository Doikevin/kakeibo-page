// localStorage に保存するときのキー名
const STORAGE_KEY = "kakeibo-transactions";

// 登録データの一覧（1件ずつオブジェクトで持つ）
const transactions = loadTransactions();

// ===== ページ読み込み時 =====
document.addEventListener("DOMContentLoaded", () => {
  render();

  const form = document.querySelector("#entry-form");
  form.addEventListener("submit", handleSubmit);
});

// ===== フォーム送信時 =====
function handleSubmit(event) {
  // フォーム送信によるページの再読み込みを止める
  event.preventDefault();

  const transaction = {
    date: document.querySelector("#date").value,
    description: document.querySelector("#description").value,
    amount: Number(document.querySelector("#amount").value),
    type: document.querySelector("#type").value,
  };

  transactions.push(transaction);
  saveTransactions();
  render();

  // 入力欄を空に戻す
  event.target.reset();
}

// ===== localStorage とのやりとり =====
function loadTransactions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// ===== 画面の描画 =====
function render() {
  renderList();
  renderTotals();
}

function renderList() {
  const list = document.querySelector("#transaction-list");
  list.innerHTML = "";

  for (const transaction of transactions) {
    const row = document.createElement("tr");
    const typeLabel = transaction.type === "income" ? "収入" : "支出";

    row.appendChild(createCell(transaction.date));
    row.appendChild(createCell(transaction.description));
    row.appendChild(createCell(typeLabel));
    row.appendChild(createCell(transaction.amount.toLocaleString()));

    list.appendChild(row);
  }
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function renderTotals() {
  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }

  document.querySelector("#total-income").textContent = income.toLocaleString();
  document.querySelector("#total-expense").textContent = expense.toLocaleString();
  document.querySelector("#balance").textContent = (income - expense).toLocaleString();
}