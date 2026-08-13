
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

  visibleTransactions.forEach(function (transaction, index) {
    const row = document.createElement("tr");
    const typeText = transaction.type === "income" ? "รายรับ" : "รายจ่าย";
    const values = [
      index + 1,
      transaction.title,
      `${formatMoney(transaction.amount)} บาท`,
      transaction.date || "ไม่ระบุ",
      transaction.time || "ไม่ระบุ",
      typeText,
    ];

    values.forEach(function (value) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "ลบ";
    deleteButton.addEventListener("click", function () {
      if (confirm("ยืนยันการลบรายการนี้หรือไม่?")) {
        deleteTransaction(transaction.id);
      }
    });
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    transactionList.appendChild(row);
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

function formatDateTime(transaction) {
  const date = transaction.date || "ไม่ระบุวันที่";
  const time = transaction.time || "ไม่ระบุเวลา";
  return `${date} ${time}`;
}

refreshUI();
