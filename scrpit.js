  let transactions = [];

  document.getElementById("transactionForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = new Date().toISOString().split("T")[0];
  
    transactions.push({ date, description, type, amount });
  
    updateDashboard();
    updateMonthlyTotals(); // <-- Add this here
    calculatePreviousMonthBalance();
  
    this.reset();
  });
  

  function updateDashboard() {
    const tbody = document.querySelector("#transactions tbody");
    tbody.innerHTML = "";

    let balance = 0;

    const lastTen = transactions.slice(-10).reverse();

    lastTen.forEach((tx, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td>${tx.type}</td>
        <td>${tx.amount.toFixed(2)}</td>
        <td><button onclick="viewTransaction(${transactions.length - 1 - index})">View</button></td>
      `;
      tbody.appendChild(row);
    });

    transactions.forEach(tx => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
    });

    document.getElementById("balance").textContent = balance.toFixed(2);
  }
  

  function updateMonthlyTotals() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    let totalCredit = 0;
    let totalDebit = 0;
  
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === "credit") {
          totalCredit += tx.amount;
        } else {
          totalDebit += tx.amount;
        }
      }
    });
  
    document.getElementById("totalCredit").textContent = totalCredit.toFixed(2);
    document.getElementById("totalDebit").textContent = totalDebit.toFixed(2);
  }
  

  function viewTransaction(index) {
    const tx = transactions[index];     
    document.getElementById("modalDate").textContent = tx.date;
    document.getElementById("modalDescription").textContent = tx.description;
    document.getElementById("modalType").textContent = tx.type;
    document.getElementById("modalAmount").textContent = tx.amount.toFixed(2);

    document.getElementById("transactionModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("transactionModal").style.display = "none";
  }

  function showSection(id) {
    document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
  }

  function downloadReport() {
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;

    const filtered = transactions.filter(tx => {
      return (!from || tx.date >= from) && (!to || tx.date <= to);
    });

    const csv = ["Date,Description,Type,Amount"];
    filtered.forEach(tx => {
      csv.push(`${tx.date},${tx.description},${tx.type},${tx.amount}`);
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cash_report.csv";
    a.click();
  }

  function getLastDayOfPreviousMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0); // 0th day gives last of previous
  }

  function calculatePreviousMonthBalance() {
    const lastDay = getLastDayOfPreviousMonth().toISOString().split("T")[0];

    let balance = 0;
    transactions.forEach(tx => {
      if (tx.date <= lastDay) {
        balance += tx.type === "credit" ? tx.amount : -tx.amount;
      }
    });

    document.getElementById("lastMonthBalance").textContent = balance.toFixed(2);
  }


  // function updateHistoryTable() {
  //   const tbody = document.querySelector("#historyTable tbody");
  //   tbody.innerHTML = "";
    
  
  //   transactions.slice().reverse().forEach(tx => {
  //     const row = document.createElement("tr");
  //     row.innerHTML = `
  //       <td>${tx.date}</td>
  //       <td>${tx.description}</td>
  //       <td>${tx.type}</td>
  //       <td>${tx.amount.toFixed(2)}</td>
  //     `;
  //     tbody.appendChild(row);
  //   });
  // }
  