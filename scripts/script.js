let selectedRow = null;
//maintains unique empId
const empIdSet = new Set();
const employeeTable = document.getElementById("empTable").tBodies[0];
let empIdErrorMsg = new Set();
let fullNameErroMsg = new Set();
let ageErrorMsg = new Set();
let genderErrorMsg= new Set();





// Function to remove error class and call flush() 
 handleInputFocus = (event)=> {
  const inputField = event.target;
  const parentDiv = inputField.parentNode;
  
  parentDiv.classList.remove('error');
  flush(inputField);
}

// Add event listener to each input field whenever input is clicked

removeErrorsAfterClick = (formData)=>{

  Object.values(formData).forEach(inputField => {
  inputField.addEventListener('click', handleInputFocus);
});
}




const onFormSubmit = () => {
  event.preventDefault();

  let formData = readFormData();
  removeErrorsAfterClick(formData);

  
  if (!isFormValid(formData)) {
    return false;
  } 

  if (selectedRow == null) {
    insertNewRecord(formData);
    sortTable();
  } else {
    updateRecord(formData);
    sortTable();
    document.getElementById("addUpdatebtn").innerHTML = "+ Add";
  }
  resetForm();
};

//*******************crud operation starts *******************

//Edit the data

const resetErrorsBeforeManipulation = ()=>{
  var form = document.getElementById('inputform');
  var inputElements = form.getElementsByTagName('input');
  flush(document.getElementById('gender'));
  inputElements=Array.from(inputElements);
  inputElements.forEach((formInput)=>{
    flush(formInput)
  })
}
const onEdit = (button) => {
  resetErrorsBeforeManipulation();
  document.getElementById("addUpdatebtn").innerHTML = "Update";
  selectedRow = button.parentElement.parentElement.parentElement;
  document.getElementById("empId").value = selectedRow.cells[0].innerHTML;
  document.getElementById("fullName").value = selectedRow.cells[1].innerHTML;
  document.getElementById("age").value = selectedRow.cells[2].innerHTML;
  document.getElementById("gender").value = selectedRow.cells[3].innerHTML;
};
const updateRecord = (formData) => {
  selectedRow.cells[0].innerHTML = formData.empId.value;
  selectedRow.cells[1].innerHTML = formData.fullName.value.replace(/\s+/g, ' ').trim();
  selectedRow.cells[2].innerHTML = formData.age.value;
  selectedRow.cells[3].innerHTML = formData.gender.value;
};

//Delete the data
const onDelete = (button) => {
  resetErrorsBeforeManipulation();
  if(selectedRow==null){
    if (confirm("Do you want to delete this record?")) {
      row = button.parentElement.parentElement.parentElement;
      document.getElementById("empTable").deleteRow(row.rowIndex);
      resetForm();
      sortTable();
    }
  }else{
    alert("you have selected a row for update, try delete after edit")
  }
 
};

//Reset the data
const resetForm = () => {
  document.getElementById("empId").value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "";
  selectedRow = null;
};

// readFormData returns input field in the form of object
const readFormData = () => {
  data = {};
  // read input form data and store it in variable
  const empId = document.getElementById("empId");
  const fullName = document.getElementById("fullName");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  data["empId"] = empId;
  data["fullName"] = fullName;
  data["age"] = age;
  data["gender"] = gender;
  return data;
};

const isFormValid = (formData) => {
  let empId = isEmpIdValid(formData);
  let FLname = isFullNameValid(formData);
  let age = isAgeValid(formData);
  let gender = isGenderValid(formData);
  return empId && FLname && age && gender;
};
const showError = (input, message) => {
  
  const formcontrol = input.parentElement;
   flush(input);
   console.log(formcontrol.classList);
  formcontrol.classList.add("error");
  message.forEach((msg)=>{
    

    let errorMessage = document.createElement('small');
    errorMessage.innerText = msg;
formcontrol.appendChild(errorMessage);
  })
  
  
 
};

const isEmpIdValid = (formData) => {
  let isRequired = true;
  let isIdValid = true;
  let isPositive = true;
  let emptyMsgError ="employee Id is required";
  let idExistMsgError ="employee ID already exists";
  let idNegativeMsgError ="employee ID can't be negative";

  if (formData.empId.value === "") {
    isRequired = false;
    flush(formData.empId,emptyMsgError);
    empIdErrorMsg.forEach((message)=>{
      empIdErrorMsg.delete(message);
    })
    empIdErrorMsg.add(emptyMsgError);
  }else{
    flush(formData.empId);
    empIdErrorMsg.delete(emptyMsgError);
  



  if (selectedRow == null) {
    if (empIdSet.has(formData.empId.value)) {
      isIdValid = false;
         empIdErrorMsg.add(idExistMsgError);

    }else{
      flush(formData.empId);
      empIdErrorMsg.delete(idExistMsgError);
    }

  } else {
    const tempId = selectedRow.cells[0].innerHTML;
    empIdSet.delete(tempId);

    if (empIdSet.has(formData.empId.value)) {
      empIdSet.add(tempId);
         empIdErrorMsg.add(idExistMsgError);
         isIdValid=false;

    } else {
      flush(formData.empId);
      empIdErrorMsg.delete(idExistMsgError);
      empIdSet.add(formData.empId.value);
    }
  }

  if (formData.empId.value < 0) {
    isPositive = false;
         empIdErrorMsg.add(idNegativeMsgError);

  }else{
    flush(formData.empId);
    empIdErrorMsg.delete(idNegativeMsgError);
  }
  }
  
 if((isRequired && isIdValid && isPositive)==false){
  showError(formData.empId, empIdErrorMsg);
  
  return false;
 }else{
  return true;
 }
  

  
};


const flush = (input)=>{
 let parentElement= input.parentElement;
 parentElement.classList.remove('error');

 var smallElements = parentElement.querySelectorAll('small');
  smallElements.forEach(function(smallElement) {
    parentElement.removeChild(smallElement);
  });
 
 
}

//*********validation starts*************
const isFullNameValid = (formData) => {
  let isValidName = true;
  let fullName = formData.fullName.value.replace(/\s+/g, ' ').trim();
  let emptyMsgError="Name Required";
  let lengthExceedeMsgError ="only FirstName & LastName required";
  let alphabetMsgError="only alphabets allowed";
  let onlyFnameError = "FullName Required";
  if (!isEmpty(fullName)) {
    flush(formData.fullName);
    fullNameErroMsg.delete(emptyMsgError);
    if (checkLength(fullName)>2) {
      fullNameErroMsg.add(lengthExceedeMsgError);
      isValidName=false;
    } else {
      flush(formData.fullName);
      fullNameErroMsg.delete(lengthExceedeMsgError);
      if(checkLength(fullName)<2){
        fullNameErroMsg.add(onlyFnameError)
        isValidName = false;
      }else{
        flush(formData.fullName);
        fullNameErroMsg.delete(onlyFnameError);

      }
    }

    if (!isNameAlphabeticOnly(fullName)) {
      fullNameErroMsg.add(alphabetMsgError);

      isValidName = false;
    } else {
      flush(formData.fullName);
      fullNameErroMsg.delete(alphabetMsgError);
    }
  } else {
    
    fullNameErroMsg.add(emptyMsgError)
    isValidName = false;
  }
  if(!isValidName){
    showError(formData.fullName, fullNameErroMsg);
return false;
  }else{
    return true;
  }

};
// not empty validation
const isEmpty = (inputValue) => {
  return inputValue == "";
};

// Name field alphabet only validation
const isNameAlphabeticOnly = (fullname) => {
  let isNameValid = true;
  const nameArray = fullname.trim().split(" ");

  nameArray.forEach((word) => {
    if (!/^[a-zA-Z]+$/.test(word)) {
      isNameValid = false;
    }
  });
  return isNameValid;
};

// Name field both firstName and lastName should be there
const checkLength = (fullname) => {
  const nameArray = fullname.trim().split(" ");
  return nameArray.length;
};

// validating age
const isAgeValid = (formData) => {
  let isValidAge = true;
  let emptyMsgError ="age is required";
  let overAge = "age more than 65 not allowed";
  let underAge="age less than 18 not allowed";
  let age = formData.age.value;
  if (age === "") {
    flush(formData.age);
    ageErrorMsg.forEach((msg)=>{
      ageErrorMsg.delete(msg);
    })
    ageErrorMsg.add(emptyMsgError);
    isValidAge=false;
  }else{
      flush(formData.age);
      ageErrorMsg.delete(emptyMsgError);

    if (age > 17) {
      if (age > 65) {
        ageErrorMsg.delete(underAge);
        ageErrorMsg.add(overAge);
        
        isValidAge = false;
      }else{
        flush(formData.age);
        ageErrorMsg.delete(overAge);
      }
    } else {
      flush(formData.age);
      ageErrorMsg.forEach(msg => {
        ageErrorMsg.delete(msg);
      });
      ageErrorMsg.add(underAge);
      isValidAge = false;
    }

  }
  
  if(!isValidAge){
    showError(formData.age,ageErrorMsg);
    return false;
  }else{
    return true;
  }
};

const isGenderValid = (formData) => {
  let genderValid=true;
  let emptyGenderError="Gender is required";
  if (formData.gender.value === "") {
    genderErrorMsg.add(emptyGenderError);
    showError(formData.gender, genderErrorMsg);
    genderValid=false;
  }else{
    flush(formData.gender);
    genderErrorMsg.delete(emptyGenderError)
  }
  return genderValid;
};
// insert new table record

const insertNewRecord = (data) => {
  var table = document
    .getElementById("empTable")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.empId.value;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.fullName.value.replace(/\s+/g, ' ').trim();
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.age.value;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.gender.value;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = `<div class="buttons"><button onClick="onEdit(this)" class='edit-btn'>Edit</button> <button onClick="onDelete(this)" class="dlt-btn">Delete</button></div>`;

  empIdSet.add(data.empId.value);
};

//*********sorting starts*************

const sortTableByColumn = (table, column, asc = true) => {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    
    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
};

document.querySelectorAll(".content-table th").forEach((headerCell) => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");
    let actionCoulmnIndex = 4;
    //avoiding action column as a separate sort functionality column (limit form 0 to 3)

    if (employeeTable.rows.length>1 && headerIndex < actionCoulmnIndex) {
      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    }
  });
});

//sort Table by empId after add, update or delet
const sortTable = () => {
  const ascending = true;
  const column = 0;
  if(employeeTable.rows.length>1){
    sortTableByColumn(employeeTable.parentElement, column, ascending);
  }
  
};

//*********sorting ends*************
