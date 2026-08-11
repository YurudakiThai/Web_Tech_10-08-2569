// 2.1 เข้าถึง HTML Element
const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const transactionList = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

// 2.2 สร้าง Array สำหรับเก็บข้อมูล (ดึงจาก LocalStorage ถ้ามี)
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ส่วนที่ 4: Function แสดงรายการบนหน้าเว็บ
function renderTransactions() {
    // ล้างรายการเดิมก่อนแสดงข้อมูลใหม่
    transactionList.innerHTML = "";
    
    // วนทำงานกับข้อมูลทุก Object ใน Array
    transactions.forEach(function (transaction) {
        const listItem = document.createElement("li");
        
        // [งานต่อยอดข้อ 1]: แสดงสีเขียวสำหรับรายรับและสีแดงสำหรับรายจ่าย
        const colorClass = transaction.type === "income" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200";
        const typeText = transaction.type === "income" ? "รายรับ" : "รายจ่าย";
        
        listItem.className = `flex justify-between items-center p-3 border rounded shadow-sm ${colorClass}`;
        listItem.innerHTML = `
            <div>
                <span class="font-bold">${transaction.title}</span>
                <span class="text-xs text-gray-500 ml-2">${transaction.date} ${transaction.time}</span>
                <br>
                <span class="text-sm">${typeText}: ${transaction.amount.toLocaleString()} บาท</span>
            </div>
            <button class="delete-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm" data-id="${transaction.id}">ลบ</button>
        `;
        
        // เพิ่ม <li> เข้าไปในรายการบนหน้าเว็บ
        transactionList.appendChild(listItem);
    });
}

// ส่วนที่ 5: Function คำนวณรายรับ รายจ่าย และยอดคงเหลือ
function updateSummary() {
    // 5.1 หารายการเฉพาะรายรับ ใช้ filter() และ reduce()
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);
        
    // 5.2 หารายการเฉพาะรายจ่าย ใช้ filter() และ reduce()
    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);
        
    // 5.3 คำนวณยอดคงเหลือ
    const balance = income - expense;
    
    totalIncomeEl.textContent = income.toLocaleString();
    totalExpenseEl.textContent = expense.toLocaleString();
    balanceEl.textContent = balance.toLocaleString();
    
    // [งานต่อยอดข้อ 9]: แสดงยอดคงเหลือติดลบด้วยข้อความเตือน
    if (balance < 0) {
        balanceEl.classList.add("text-red-700", "font-extrabold");
        balanceEl.classList.remove("text-blue-700");
    } else {
        balanceEl.classList.add("text-blue-700");
        balanceEl.classList.remove("text-red-700", "font-extrabold");
    }
}

// ส่วนที่ 3: จัดการเหตุการณ์ Submit
form.addEventListener("submit", function (event) {
    event.preventDefault(); // ป้องกันการโหลดหน้าใหม่
    
    // อ่านค่าจาก Input และแปลงเป็น Number
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const time = timeInput.value;
    const type = typeInput.value;

    // ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น (Validation)
    if (!title) return alert("กรุณากรอกชื่อรายการ");
    if (amount <= 0) return alert("จำนวนเงินต้องมากกว่า 0");
    if (title.length > 50) return alert("ชื่อรายการไม่ควรเกิน 50 ตัวอักษร");

    // สร้าง Object จากข้อมูลในฟอร์ม
    const transaction = {
        id: Date.now(), // ใช้ Timestamp เป็น ID
        title: title,
        amount: amount,
        date: date,
        time: time,
        type: type
    };

    // เพิ่ม Object ลงใน Array
    transactions.push(transaction);
    saveData(); // บันทึกลง LocalStorage
    
    // เชื่อมการทำงาน (ส่วนที่ 6.1)
    renderTransactions();
    updateSummary();
    
    // ล้างข้อมูลเพื่อให้ผู้ใช้กรอกรายการใหม่ได้สะดวก (ส่วนที่ 6.2)
    form.reset();
});

// ส่วนที่ 7: เพิ่มปุ่มลบรายการ (ใช้ Event Delegation)
transactionList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = Number(event.target.getAttribute("data-id"));
        
        // [งานต่อยอดข้อ 4]: เพิ่มการยืนยันก่อนลบรายการ
        if (confirm("คุณแน่ใจหรือไม่ที่ต้องการลบรายการนี้?")) {
            transactions = transactions.filter(t => t.id !== id);
            saveData();
            renderTransactions();
            updateSummary();
        }
    }
});

// โหลดข้อมูลตอนเปิดหน้าเว็บครั้งแรก
renderTransactions();
updateSummary();
