const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const transactionList = document.getElementById("transactionList");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpenseElement = document.getElementById("totalExpense");
const balanceElement = document.getElementById("balance");
const balanceWarning = document.getElementById("balanceWarning");
const emptyMessage = document.getElementById("emptyMessage");
const filterType = document.getElementById("filterType");
const clearAllButton = document.getElementById("clearAllButton");

// 2.2 Object 5 รายการใน Array
let transactions = [
  { id: 1, title: "เงินค่าขนม", amount: 1000, type: "income",
    date: "2026-08-01", time: "08:00" },
  { id: 2, title: "ค่าอาหาร", amount: 80, type: "expense",
    date: "2026-08-01", time: "12:00" },
  { id: 3, title: "ค่าเดินทาง", amount: 50, type: "expense",
    date: "2026-08-01", time: "17:30" },
  { id: 4, title: "รับจ้างทำงาน", amount: 500, type: "income",
    date: "2026-08-02", time: "14:00" },
  { id: 5, title: "ค่าอุปกรณ์การเรียน", amount: 120, type: "expense",
    date: "2026-08-03", time: "10:15" }
];

const formatMoney = value =>
  value.toLocaleString("th-TH", { minimumFractionDigits: 2,
    maximumFractionDigits: 2 });

function setDefaultDateTime() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  dateInput.value = local.toISOString().slice(0, 10);
  timeInput.value = local.toTimeString().slice(0, 5);
}

// 3 รับข้อมูลจากฟอร์ม
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const typeInput = document.querySelector('input[name="type"]:checked');

  if (title === "" || title.length > 50) {
    alert("กรุณากรอกชื่อรายการไม่เกิน 50 ตัวอักษร");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    alert("จำนวนเงินต้องมากกว่า 0");
    return;
  }
  if (!dateInput.value || !timeInput.value || !typeInput) {
    alert("กรุณากรอกวันที่ เวลา และเลือกประเภทให้ครบ");
    return;
  }

  const transaction = {
    id: Date.now(),
    title,
    amount,
    type: typeInput.value,
    date: dateInput.value,
    time: timeInput.value
  };

  transactions.push(transaction);
  renderTransactions();
  updateSummary();
  form.reset();
  setDefaultDateTime();
  titleInput.focus();
});

// 4 แสดงรายการ และ 7 เพิ่มปุ่มลบ
function renderTransactions() {
  transactionList.innerHTML = "";
  const selectedType = filterType.value;
  const visibleTransactions = transactions.filter(transaction =>
    selectedType === "all" || transaction.type === selectedType
  );

  emptyMessage.hidden = visibleTransactions.length !== 0;

  visibleTransactions.forEach(function (transaction) {
    const listItem = document.createElement("li");
    listItem.className = transaction.type;

    const text = document.createElement("span");
    const typeText = transaction.type === "income" ? "รายรับ" : "รายจ่าย";
    text.textContent = `${transaction.date} ${transaction.time} | ` +
      `${transaction.title} | ${formatMoney(transaction.amount)} บาท | ${typeText}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "ลบ";
    deleteButton.addEventListener("click", function () {
      if (!confirm(`ยืนยันการลบรายการ “${transaction.title}” หรือไม่`)) return;
      transactions = transactions.filter(item => item.id !== transaction.id);
      renderTransactions();
      updateSummary();
    });

    listItem.append(text, deleteButton);
    transactionList.appendChild(listItem);
  });
}

// 5 filter() + reduce() และคำนวณยอดคงเหลือ
function updateSummary() {
  const totalIncome = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;
  totalIncomeElement.textContent = `${formatMoney(totalIncome)} บาท`;
  totalExpenseElement.textContent = `${formatMoney(totalExpense)} บาท`;
  balanceElement.textContent = `${formatMoney(balance)} บาท`;
  balanceElement.classList.toggle("negative", balance < 0);
  balanceWarning.textContent = balance < 0 ? "คำเตือน: ยอดคงเหลือติดลบ" : "";
}

filterType.addEventListener("change", renderTransactions);
clearAllButton.addEventListener("click", function () {
  if (transactions.length === 0) return;
  if (!confirm("ยืนยันการลบข้อมูลทั้งหมดหรือไม่")) return;
  transactions = [];
  renderTransactions();
  updateSummary();
});

setDefaultDateTime();
renderTransactions();
updateSummary();
