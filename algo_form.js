/ ตกแต่งหน้าเว็บด้วย JavaScript โดยสร้าง CSS แบบฝังในเอกสารอัตโนมัติ
const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px;
    font-family: Arial, "Noto Sans Thai", sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background: linear-gradient(135deg, #eff6ff, #f8fafc);
  }
  h1 {
    max-width: 850px;
    margin: 0 auto 24px;
    padding: 18px;
    color: white;
    text-align: center;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(37, 99, 235, .2);
  }
  h2 { margin-top: 0; color: #1e3a8a; }
  section {
    max-width: 850px;
    margin: 0 auto 20px;
    padding: 22px;
    background: rgba(255, 255, 255, .95);
    border: 1px solid #dbeafe;
    border-radius: 14px;
    box-shadow: 0 5px 18px rgba(30, 64, 175, .1);
  }
  form { display: grid; gap: 10px; }
  label { margin-top: 4px; font-weight: bold; color: #374151; }
  input, select, button {
    width: 100%;
    min-height: 42px;
    padding: 9px 11px;
    font: inherit;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
  }
  input:focus, select:focus {
    outline: 3px solid #bfdbfe;
    border-color: #2563eb;
  }
  button {
    margin-top: 8px;
    color: white;
    background: #2563eb;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: transform .15s ease, background .15s ease;
  }
  button:hover { background: #1d4ed8; transform: translateY(-1px); }
  #searchInput, #filterType { width: calc(50% - 6px); margin-right: 8px; }
  #incomeTotal { color: #15803d; font-weight: bold; }
  #expenseTotal { color: #b91c1c; font-weight: bold; }
  #balance { color: #1d4ed8; font-weight: bold; }
  #transactionList { margin: 16px 0 0; padding: 0; list-style: none; }
  #transactionList li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    padding: 13px;
    background: #f8fafc;
    border-left: 6px solid #64748b;
    border-radius: 9px;
    box-shadow: 0 2px 7px rgba(15, 23, 42, .06);
  }
  #transactionList li:nth-child(even) { background: #eff6ff; }
  #transactionList li button {
    width: auto;
    min-width: 58px;
    margin: 0;
    padding: 6px 11px;
    background: #dc2626;
  }
  #transactionList li button:hover { background: #b91c1c; }
  @media (max-width: 600px) {
    body { padding: 12px; }
    section { padding: 16px; }
    #searchInput, #filterType { width: 100%; margin: 0 0 8px; }
    #transactionList li { align-items: flex-start; flex-direction: column; }
  }
`;
document.head.appendChild(style);

// เข้าถึง HTML Element
const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transactionList");
const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const balance = document.getElementById("balance");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

// Array สำหรับเก็บ Object จำนวน 5 รายการ
let transactions = [
  {
    id: 1,
    title: "เงินค่าขนม",
    amount: 1000,
    date: "2026-08-01",
    time: "08:00",
    type: "income"
  },
  {
    id: 2,
    title: "ค่าอาหาร",
    amount: 80,
    date: "2026-08-01",
    time: "12:00",
    type: "expense"
  },
  {
    id: 3,
    title: "ค่าเดินทาง",
    amount: 50,
    date: "2026-08-01",
    time: "17:30",
    type: "expense"
  },
  {
    id: 4,
    title: "ค่าหนังสือ",
    amount: 300,
    date: "2026-08-02",
    time: "10:15",
    type: "expense"
  },
  {
    id: 5,
    title: "รายได้พิเศษ",
    amount: 500,
    date: "2026-08-03",
    time: "18:00",
    type: "income"
  }
];

function formatMoney(value) {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// รับข้อมูลจากฟอร์มและเพิ่มรายการใหม่
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const time = timeInput.value;
  const type = typeInput.value;

  if (!title) {
    alert("กรุณากรอกชื่อรายการ");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("จำนวนเงินต้องมากกว่า 0");
    return;
  }

  const transaction = {
    id: Date.now(),
    title: title,
    amount: amount,
    date: date,
    time: time,
    type: type
  };

  transactions.push(transaction);
  refreshUI();
  form.reset();
  setDefaultDateTime();
});

// แสดงรายการทั้งหมดบนหน้าเว็บ
function renderTransactions() {
  transactionList.innerHTML = "";

  const keyword = searchInput.value.trim().toLowerCase();
  const selectedType = filterType.value;

  const visibleTransactions = transactions.filter(function (transaction) {
    const matchesKeyword = transaction.title.toLowerCase().includes(keyword);
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesKeyword && matchesType;
  });

  visibleTransactions.forEach(function (transaction) {
    const listItem = document.createElement("li");
    const typeText = transaction.type === "income" ? "รายรับ" : "รายจ่าย";

    listItem.textContent =
      `${transaction.title} | ${formatMoney(transaction.amount)} บาท | ` +
      `${typeText} | ${transaction.date} ${transaction.time}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "ลบ";

    deleteButton.addEventListener("click", function () {
      if (confirm("ยืนยันการลบรายการนี้หรือไม่?")) {
        deleteTransaction(transaction.id);
      }
    });

    listItem.appendChild(deleteButton);
    transactionList.appendChild(listItem);
  });
}

// คำนวณรายรับ รายจ่าย และยอดคงเหลือ
function updateSummary() {
  const income = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentBalance = income - expense;

  incomeTotal.textContent = formatMoney(income);
  expenseTotal.textContent = formatMoney(expense);
  balance.textContent = formatMoney(currentBalance);
}

// ลบรายการตาม id
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  refreshUI();
}

// ค้นหาและกรองรายการ
searchInput.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);

function refreshUI() {
  renderTransactions();
  updateSummary();
}

function setDefaultDateTime() {
  const now = new Date();
  dateInput.value = now.toISOString().slice(0, 10);
  timeInput.value = now.toTimeString().slice(0, 5);
}

setDefaultDateTime();
refreshUI();
