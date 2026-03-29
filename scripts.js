// Banking System Script File

// userdata storage 
let storeduser = JSON.parse(localStorage.getItem('regaccountdetails')) || [];
let founduser = null;
// user data registration inputs
let userregname = document.getElementById("userregname");
let userregactype = document.getElementById("userregactype");
let userregemail = document.getElementById("userregemail");
let userregpin = document.getElementById("userregpin");
let userregconfpin = document.getElementById("userregconfpin");
let userreginitialdpamount = document.getElementById("userreginitialdpamount");
let userregacnumber = document.getElementById("userregacnumber");
let addamountinput = document.getElementById("addamountinput");
let deductamountinput = document.getElementById("deductamountinput");
let userregprofilepic = document.getElementById("userregprofilepic");
let userregimagedisplay = document.getElementById("userregimagedisplay");
let searchaccountbox = document.getElementById("searchaccountbox");
let deletemodalbox = document.getElementById("deletemodalbox");


// convert the image in BASE64
function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result); // Base64 string
    };
    reader.readAsDataURL(file);
}


// Loader Function
function loader(show) {

    const loader = document.getElementById("loader");
    loader.style.display = show ? "flex" : "none";
    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
}


// Check Session Login Status
(function checkSessionLogin() {
    let loggedAccount = sessionStorage.getItem("loggedUserAccount");

    if (loggedAccount) {
        let storedusers = JSON.parse(localStorage.getItem("regaccountdetails")) || [];

        founduser = storedusers.find(
            u => u.accountnumber === Number(loggedAccount)
        );

        if (founduser) {
            setTimeout(() => dashboard(), 100);
        } else {
            sessionStorage.clear();
            loginpage();
        }
    } else {
        loginpage();
    }
})();


// Dashboard Function
function dashboard() {
    loader(true);
    document.getElementById("loginedusername").innerText = founduser.name;
    document.getElementById("dbacholdername").value = founduser.name;
    document.getElementById("dbacnumber").value = founduser.accountnumber;
    document.getElementById("dbactype").value = founduser.accounttype;
    document.getElementById("dbbalance").value = founduser.initialamount;
    if (founduser.imageFile !== null && storeduser.some(u => u.accountnumber === founduser.accountnumber) && founduser.imageFile !== undefined) {
        userregimagedisplay.src = founduser.imageFile;
        userregimagedisplay.style.display = "block";
    }
    document.getElementById("dashboardsec").style.display = "block";
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "none";
}


// Input Error  Msg
addamountinput.addEventListener('input', () => {
    if (addamountinput.value < 0) {
        showToast("Pls Enter the Valid Number", "red");
    }
})



// Add Money Modal Box  

function opendepositmodal() {
    let closedepositmodal = document.getElementById("depositmodalbox");
    closedepositmodal.style.display = "block";

}
function Closedeposit() {
    let closedepositmodal = document.getElementById("depositmodalbox");
    closedepositmodal.style.display = "none";
}



// Withdraw Money Modal Box  

function openwithdrawmodel() {
    let withdrawmodal = document.getElementById("withdrawmodalbox");
    withdrawmodal.style.display = "block";

}
function Closewithdraw() {
    let withdrawmodal = document.getElementById("withdrawmodalbox");
    withdrawmodal.style.display = "none";
}


// search account modal box
function opensearchaccountmodal() {
    searchaccountbox.style.display = "block";
}

function closeSearchAccountBox() {
    searchaccountbox.style.display = "none";
    document.getElementById("cancelsearchbtn").style.display = "block";
    document.getElementById("usersearchaccnumber").value = "";
    document.getElementById("usersearchederrormsg").style.display = "none";
    document.getElementById("searcherrormsgmodal").style.display = "none";
}

// Transfer  modal box
function opentranferamountmodal() {
    let transferwmodalbox = document.getElementById("transferwmodalbox");
    transferwmodalbox.style.display = "block";
}
function CloseTransfer() {
    let transferwmodalbox = document.getElementById("transferwmodalbox");
    transferwmodalbox.style.display = "none";
    document.getElementById("recipientaccountnumber").value = "";
    document.getElementById("transferamountinput").value = "";
}

// Delete  modal box


function opendeletemodel() {
    deletemodalbox.style.display = "block";
}
function closedeletemodel() {
    deletemodalbox.style.display = "none";
    document.getElementById("userdeletepin").value = ""
}
// Account Registration Logic
function registerpage() {
    loader(true);
    document.getElementById("registration").style.display = "block"
    document.getElementById("login").style.display = "none"

}
function registeraccount() {

    if (userregpin.value !== userregconfpin.value) {
        alert("PIN not matched");
        return;
    }

    if (storeduser.some(u => u.email.toLowerCase() === userregemail.value.toLowerCase())) {
        alert("Email Already Exist, Pls Try Different Email id or Login by clicking on Login Now Button")
        return;
    }
    if (userregname.value === "" || userregname.value === null) {
        alert("Pls enter the Name !");
        return;
    }
    let max = 100000000000;
    let generateaccountnumber;


    do {
        generateaccountnumber = Math.floor(Math.random() * max);
    } while (storeduser.some(u => u.accountnumber === generateaccountnumber));

    let regaccountdetails = {
        name: userregname.value,
        accounttype: userregactype.value,
        email: userregemail.value,
        pin: Number(userregpin.value),
        initialamount: Number(userreginitialdpamount.value),
        accountnumber: generateaccountnumber,
        registerationstatus: true,
        transactionhistory: [],
        transactiondate: [],
        imageFile: null
    };
    if (userregprofilepic.files[0]) {
        convertToBase64(userregprofilepic.files[0], function (base64Image) {
            regaccountdetails.imageFile = base64Image;

            storeduser.push(regaccountdetails);
            localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));

        });
    } else {
        storeduser.push(regaccountdetails);
        localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));
    }

    userregacnumber.value = generateaccountnumber;
    document.getElementById("acnumbershow").style.display = "block"
}

// Account login Logic Starts Here

let useremailname = document.getElementById("useremailname");
let userloginpin = document.getElementById("userloginpin");
let userloginattempt = 3;
let seconds = 60;
const btn = document.getElementById("loginsubmit");
function loginpage() {
    loader(true);
    sessionStorage.clear();
    founduser = null;
    document.getElementById("login").style.display = "block";
    document.getElementById("transactions").style.display = "none";
    document.getElementById("dashboardsec").style.display = "none";
    document.getElementById("registration").style.display = "none";
    document.getElementById("bankerloginpage").style.display = "none";
    document.getElementById("adminpanel").style.display = "none";

}

function accountlogin() {
    founduser = storeduser.find(u => u.email.toLowerCase() === useremailname.value.toLowerCase() && u.pin === Number(userloginpin.value));
    if (useremailname.value === "" || useremailname.value === null) {
        showToast("Please enter a valid email", "red");
        return;
    }
    else if (storeduser.length <= 0 || !storeduser.some(u => u.email.toLowerCase() === useremailname.value.toLowerCase())) {
        showToast("No Registered Users Available Please Register First", "red");
        return;
    }
    else {
        if (founduser) {
            showToast("User Login Successfull", "green");
            sessionStorage.setItem("loggedUserAccount", founduser.accountnumber);
            dashboard();

        }
        else {
            userloginattempt--;
            showToast(userloginattempt + " Login attempts Left  ", "red");

        }
        if (userloginattempt <= 0) {
            btn.disabled = true;
            showToast(" Account Locked pls try again later !", "red");
            let timer = setInterval(() => {
                seconds--;
                btn.innerText = `Try again in ${seconds}s`;

                if (seconds <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.innerText = "Submit";
                    userloginattempt = 3;
                }
            }, 1000); // 1 second

        }
    }


}


function depositmoney() {
    if (addamountinput.value <= 0) {
        showToast("Please enter a valid amount", "red");
        return;
    }
    else {
        showToast(`${addamountinput.value} Amount Deposit Success`, "green");

        let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
        storeduser[storeduserindex].initialamount += Number(addamountinput.value);
        storeduser[storeduserindex].transactionhistory.push(Number(addamountinput.value));
        const date = new Date();
        const localFormatted = date.toLocaleString("en-IN");
        storeduser[storeduserindex].transactiondate.push(localFormatted)
        document.getElementById("dbbalance").value = storeduser[storeduserindex].initialamount;
        localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
        addamountinput.value = null;;

    }
}

function deductmoney() {

    if (deductamountinput.value <= 0) {
        showToast("Please enter a valid amount", "red");
        return;
    }
    if (deductamountinput.value > founduser.initialamount) {
        showToast("Insufficient Balance", "red");
        return;
    }
    else {
        showToast(`${deductamountinput.value} Amount Deduct Success`, "green");

        let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
        storeduser[storeduserindex].initialamount -= Number(deductamountinput.value);
        storeduser[storeduserindex].transactionhistory.push(-Number(deductamountinput.value));
        const date = new Date();
        const localFormatted = date.toLocaleString("en-IN");
        storeduser[storeduserindex].transactiondate.push(localFormatted)
        document.getElementById("dbbalance").value = storeduser[storeduserindex].initialamount;
        localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
        addamountinput.value = null;;

    }
}

function transanctionhistory() {
    document.getElementById("transactions").style.display = "block";
    let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
    const tablebody = document.getElementById("tablebody");
    let transactions = storeduser[storeduserindex].transactionhistory;
    let dates = storeduser[storeduserindex].transactiondate;

    tablebody.innerHTML = "";
    if (transactions.length <= 0) {
        document.getElementById("transactionsstatus").innerText = "No Transaction History Available";
        return;
    }
    else {
        document.getElementById("transactionsstatus").innerText = "Transaction History";
    }
    for (let i = transactions.length - 1; i >= 0; i--) {

        let tablerow = document.createElement("tr");
        let tablecell1 = document.createElement("td");
        let tablecell2 = document.createElement("td");
        let tablecell3 = document.createElement("td");

        tablecell1.innerText = dates[i];
        tablecell2.innerText = transactions[i];

        if (transactions[i] < 0) {
            tablecell3.innerText = "Debit";
            tablecell3.style.color = "red";
        } else {
            tablecell3.innerText = "Credit";
            tablecell3.style.color = "green";
        }

        tablerow.appendChild(tablecell1);
        tablerow.appendChild(tablecell2);
        tablerow.appendChild(tablecell3);

        tablebody.appendChild(tablerow);
    }
}

function closetransactions() {
    document.getElementById("transactions").style.display = "none";
}
function deletefrombankerportal(accountnumber) {
    let index = storeduser.findIndex(u => u.accountnumber === accountnumber);
    if (index !== -1) {
        storeduser.splice(index, 1);
        localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));
        showToast("Account Deleted Successfully", "green"); document.getElementById("adminpaneltablebody").innerHTML = "";
        displayallaccounts();
    }

}
function deleteaccount() {
    let userdeletepin = Number(document.getElementById("userdeletepin").value);

    if (userdeletepin !== founduser.pin) {
        document.getElementById("errordeletepin").style.display = "block"
        document.getElementById("errordeletepin").innerText = "Invalid PIN"
        document.getElementById("errordeletepin").style.color = "red"
        setTimeout(() => {
            document.getElementById("errordeletepin").style.display = "none"
        }, 2000);
        return;
    }
    if (founduser.pin === Number(userdeletepin)) {
        if (confirm("Are your sure to delete your account ?")) {

            let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
            storeduser.splice(storeduserindex, 1);
            localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
            alert("Account Deleted Successfully");
            loginpage();
            document.getElementById("userdeletepin").value = ""
            closedeletemodel()
        }
        else {
            showToast("Use Cancelled to Delete Account", "Green")
            document.getElementById("userdeletepin").value = ""
            closedeletemodel()
        }
    }


}


// transfer money logic
document.getElementById("transfermoneybtn").addEventListener("click", () => {
    document.getElementById("searchaccountbox").style.display = "none";
    document.getElementById("searcherrormsgmodal").style.display = "none";
    document.getElementById("transferwmodalbox").style.display = "block";
    document.getElementById("usersearchederrormsg").style.display = "none";
});
function transfermoney() {
    let founduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
    let recipientaccountnumber = document.getElementById("recipientaccountnumber").value;
    let transferamountinput = document.getElementById("transferamountinput").value;
    let recipientindex = storeduser.findIndex(u => u.accountnumber === Number(recipientaccountnumber));

    if (transferamountinput <= 0 || transferamountinput > storeduser[founduserindex].initialamount) {
        showToast("Invalid Transfer Amount", "red");
        return;
    }
    if (founduser.accountnumber === Number(recipientaccountnumber)) {
        showToast("You cannot transfer to your own account", "red");
        return;
    }
    // Deduct from sender
    storeduser[founduserindex].initialamount -= Number(transferamountinput);
    storeduser[founduserindex].transactionhistory.push(-Number(transferamountinput));
    const date = new Date();
    const localFormatted = date.toLocaleString("en-IN");
    storeduser[founduserindex].transactiondate.push(localFormatted);
    // Add to recipient
    storeduser[recipientindex].initialamount += Number(transferamountinput);
    storeduser[recipientindex].transactionhistory.push(Number(transferamountinput));
    storeduser[recipientindex].transactiondate.push(localFormatted);
    localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
    document.getElementById("dbbalance").value = storeduser[founduserindex].initialamount;

    showToast(`${transferamountinput} Transfer Successful`, "green");
}

// search account logic
document.getElementById("searchaccbtn").addEventListener("click", function accountsearch() {
    let searchaccnumber = Number(document.getElementById("usersearchaccnumber").value);
    let searcheduser = storeduser.find(u => u.accountnumber === searchaccnumber);
    if (!searcheduser) {
        showToast("Account Not Found", "red");
        return;
    }
    else {
        document.getElementById("searcherrormsgmodal").style.display = "block";
        document.getElementById("usersearchederrormsg").style.display = "block";
        document.getElementById("usersearchederrormsg").style.color = "green";
        document.getElementById("usersearchederrormsg").innerText = `Send Money to ${searcheduser.name} ?`;
        document.getElementById("cancelsearchbtn").style.display = "none";
    }
});



function filtertransaction(type) {
    let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
    const tablebody = document.getElementById("tablebody");
    let transactions = storeduser[storeduserindex].transactionhistory;
    let dates = storeduser[storeduserindex].transactiondate;
    tablebody.innerHTML = "";

    for (let i = transactions.length - 1; i >= 0; i--) {
        if (type === 'all' || (type === 'credit' && transactions[i] > 0) || (type === 'debit' && transactions[i] < 0)) {
            let tablerow = document.createElement("tr");
            let tablecell1 = document.createElement("td");
            let tablecell2 = document.createElement("td");
            let tablecell3 = document.createElement("td");
            tablecell1.innerText = dates[i];
            tablecell2.innerText = transactions[i];
            if (transactions[i] < 0) {
                tablecell3.innerText = "Debit";
                tablecell3.style.color = "red";
            } else {
                tablecell3.innerText = "Credit";
                tablecell3.style.color = "green";
            }
            tablerow.appendChild(tablecell1);
            tablerow.appendChild(tablecell2);
            tablerow.appendChild(tablecell3);
            tablebody.appendChild(tablerow);
        }
    }
}

// dark mode toggle
function toggleTheme() {
    document.body.classList.toggle("dark");
    const toggleImg = document.getElementById("toggleimg");
    if (document.body.classList.contains("dark")) {
        toggleImg.src = "img/togglelighttheme.svg";
    } else {
        toggleImg.src = "img/toggledarktheme.svg";
    }
}
// download transaction history as PDF
function downloadPdfTable() {
    // Initialize jsPDF
    const doc = new jspdf.jsPDF();

    // Use autoTable to process the HTML table element directly
    doc.autoTable({ html: '#transactionshistodytable' });
    doc.text("Transaction History", 14, 10);
    doc.text(`${founduser.name}`, 94, 10);
    doc.text(`${founduser.accountnumber}`, 144, 10);

    // Save the PDF file
    doc.save('statement.pdf');
}
// banker login logic
function adminpanel() {
    loader(true);
    document.getElementById("bankerloginpage").style.display = "block";
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "none";
}

function bankerlogin() {
    let bankermailid = document.getElementById("bankermailid").value;
    let bankerpswd = document.getElementById("bankerpswd").value;
    if (bankermailid === "" || bankermailid === null) {

        showToast("Please enter a valid Mail ID", "red");
        return;
    }
    if (bankermailid === "admin@bank.com" && bankerpswd === "admin123") {
        showToast("Banker Login Successfull", "green");
        document.getElementById("adminpanel").style.display = "block";
        document.getElementById("bankerloginpage").style.display = "none";
        document.getElementById("adminpaneltablebody").innerHTML = "";
        displayallaccounts();
    }
    else {

        showToast("Invalid Mail ID or Password", "red");
    }
}
// display all accounts in admin panel
function displayallaccounts() {
    const adminpaneltablebody = document.getElementById("adminpaneltablebody");
    storeduser.forEach((user) => {
        let tablerow = document.createElement("tr");
        let tablecell1 = document.createElement("td");
        let tablecell2 = document.createElement("td");
        let tablecell3 = document.createElement("td");
        let tablecell4 = document.createElement("td");
        let tablecell5 = document.createElement("td");
        tablecell1.innerText = user.name;
        tablecell2.innerText = user.accountnumber;
        tablecell3.innerText = user.accounttype;
        tablecell4.innerText = user.initialamount;
        tablecell5.innerHTML = `<button onclick="deletefrombankerportal(${user.accountnumber})">Delete Account</button>`;
        tablerow.appendChild(tablecell1);
        tablerow.appendChild(tablecell2);
        tablerow.appendChild(tablecell3);
        tablerow.appendChild(tablecell4);
        tablerow.appendChild(tablecell5);
        adminpaneltablebody.appendChild(tablerow);
    });
}
// Toast Message Function
function showToast(msg, color = "red") {
    const toast = document.getElementById("toasterrormsg");

    toast.innerText = msg;

    // color logic
    if (color === "green") {
        toast.style.background = "#28a745";
    } else if (color === "red") {
        toast.style.background = "#dc3545";
    } else {
        toast.style.background = "#333";
    }

    // show animation
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// Update Account Details Modal Box
function showupdateaccountbox() {

    document.getElementById("dashboardsec").style.display = "none";
    let updateaccountbox = document.getElementById("updateaccountbox");
    updateaccountbox.style.display = "block";
}
function closeupdateaccountbox() {
    document.getElementById("dashboardsec").style.display = "block";
    let updateaccountbox = document.getElementById("updateaccountbox");
    updateaccountbox.style.display = "none";
}
function updateaccountdetails() {
    let updatedname = document.getElementById("updateaccountname").value;
    let updatedpin = document.getElementById("updateaccountpin").value;
    let updateimage = document.getElementById("updateimage");

    let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);

    if (!updatedname && !updatedpin && !updateimage.files[0]) {

        showToast("Nothing to update", "red");
        return;
    }
    // NAME
    if (updatedname) {
        storeduser[storeduserindex].name = updatedname;
        founduser.name = updatedname;
        showToast("Account Name Updated Successfully", "green");
    }

    // PIN
    if (updatedpin && !isNaN(updatedpin)) {
        storeduser[storeduserindex].pin = Number(updatedpin);
        founduser.pin = Number(updatedpin);
        showToast("Account Pin Updated Successfully", "green");
    }
    if (updateimage.files[0]) {
        convertToBase64(updateimage.files[0], function (base64Image) {
            storeduser[storeduserindex].imageFile = base64Image;
            founduser.imageFile = base64Image;

            dashboard(); // yaha call kar (callback ke andar)
        });
        showToast("Account Image Updated Successfully", "green");
    }

    localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));

    closeupdateaccountbox();
    // update UI
    dashboard();
}


// End of Script File

