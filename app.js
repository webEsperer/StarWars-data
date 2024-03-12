import { rowData } from "./data.js";

const parseRowData = JSON.parse(rowData);
const loadingPage = document.querySelector(".startPage");
const hideOverlay = document.querySelector("#hide-overlay");
const hideWrapper = document.querySelector("#hide-wrapper");
const puzzleClose = document.querySelector("#puzzle-close");
const puzzleMod2 = document.querySelector("#puzzle-mod2");
const titlesBtn = document.querySelector("#titles-buttons");
const containerItem = document.querySelector(".container-item");
const modeTheme = document.querySelector(".toggleLight");
const darkTheme = document.querySelector("#darkness");
const lightTheme = document.querySelector("#lighter");
const searchMenu = document.querySelector(".searchBar");
const enigmaItem = document.querySelector(".puzzle-enigma");
const wraperTables = document.querySelector(".wrapperTable");
const tableContent = document.querySelector(".mainTableContainer");
const puzzleMod = document.querySelector("#puzzle-mod");
const mainTable = document.querySelector(".firstTable");
const deleteBtn = document.querySelector(".deleteChecked");
const nav = document.querySelector(".navigation");
const secondTable = document.querySelector("#second-table");
const audioEnigma = document.querySelector("#audio-enigma");
const displaySecondTable = document.querySelector("#display-second-table");
const title = "starwars";

let row = [];
let bodyItem = [];
let tableBodyItems = [];
let arrayOfName = [];
let lengthOfTableBody = 0;
let nameItem = [];
let currentPage = 1;
let startIndex = 0;
let lastIndex = 0;
let selectValue = 10;
let countPages = 0;
let cheatCodes = "";

function startMainPage() {
  const titleArray = title.split("");
  const titleList = document.createElement("ul");
  titleList.className = "loadingText";
  titleArray.forEach((item) => {
    const rowItem = document.createElement("li");
    rowItem.innerHTML = item;
    titleList.appendChild(rowItem);
  });

  loadingPage.appendChild(titleList);
}

startMainPage();

setTimeout(() => {
  loadingPage.style.opacity = "0";
}, 3000);

setTimeout(() => {
  loadingPage.style.display = "none";
}, 5500);

function createTitleBtn() {
  Object.keys(parseRowData).forEach((title) => {
    const titleBtn = document.createElement("button");
    titleBtn.className = "mainBtn";
    titleBtn.innerHTML = title;
    titlesBtn.appendChild(titleBtn);
  });
}

createTitleBtn();

function createMainTable(e) {
  tableContent.style.display = "flex";
  wraperTables.style.flexDirection = "column";

  if (!e.target.classList.contains("mainBtn")) return;

  mainTable.innerHTML = "";

  const titleHeadTable = e.target.innerHTML;
  const titlesTableHeader = findTitleForHeader(titleHeadTable);
  const valueOfObject = parseRowData[titleHeadTable];

  secondTable.style.display = "none";
  createTableHead(titlesTableHeader);
  createTableBody(titlesTableHeader, titleHeadTable, valueOfObject);
}

function findTitleForHeader(titleHeadTable) {
  const arrayOfTitleItem = Object.keys(parseRowData[titleHeadTable][0]);
  const titlesForMainTable = [
    "id",
    ...arrayOfTitleItem.slice(0, 3),
    "created",
    "actions",
  ];

  secondTable.innerHTML = "";

  return titlesForMainTable;
}

function createTableHead(titlesTableHeader) {
  const headTable = document.createElement("thead");
  const rowThead = document.createElement("tr");
  rowThead.className = "headTable";
  headTable.appendChild(rowThead);
  mainTable.appendChild(headTable);

  titlesTableHeader.forEach((titleItems) => {
    const rowTheadItems = document.createElement("th");
    rowTheadItems.textContent = titleItems;
    rowThead.appendChild(rowTheadItems);
  });
}

function createTableBody(titlesTableHeader, titleHeadTable, valueOfObject) {
  const tableBody = document.createElement("tbody");
  tableBody.id = "table-body";
  mainTable.appendChild(tableBody);

  nameItem = [];
  const [id, title1, title2, title3, created, actions] = titlesTableHeader;

  bodyItem = valueOfObject.map((valueItems, index) => {
    index += 1;
    nameItem.push(valueItems[title1]);
    return `<tr class='itemTable' id=${index} data-name='${titleHeadTable}'>
              <td>${index}</td>
              <td data-name='${title1}'>${valueItems[title1]}</td>
              <td>${valueItems[title2]}</td>
              <td>${valueItems[title3]}</td>
              <td>${createDate(valueItems[created])}</td>
              <td>
                <button class='addButton' data-title='${titleHeadTable}'>+</button>
                <button class='removeButton'>
                <img class='deleteIcon' src="./images/eraser-solid.svg" alt="Delete button">
                <input type='checkbox'></button>
              </td>
            </tr>
              `;
  });

  tableBodyItems = [...bodyItem];
  searchMenu.innerHTML = "";
  containerItem.style.display = "flex";

  clear();
  createFooterNav();
  updateIndex();
  createSearchMenu();
  newPage();
}

function createDate(date) {
  const now = new Date(date);
  return `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
}

function deleteButton(e) {
  row.forEach((item) => item.remove());
  deleteBtn.innerHTML = "";
  row = [];
  deleteBtn.style.display = "none";
}

function modifyItemsTable(e) {
  if (
    e.target.className === "removeButton" ||
    e.target.className === "deleteIcon"
  ) {
    const itemToRemove = e.target.closest("tr");
    itemToRemove.remove();
  }

  if (e.target.tagName === "INPUT") {
    createArrayOfDeleteItems(e.target);
  }

  createSecondTable(e);
}

function createArrayOfDeleteItems(tagName) {
  const itemToRemove = tagName.closest("tr");

  if (tagName.checked === true) {
    row.push(itemToRemove);
  } else {
    const check = row.indexOf(itemToRemove);
    if (check !== -1) {
      row.splice(check, 1);
    }
  }

  if (row.length > 0) {
    deleteBtn.style.display = "flex";
    deleteBtn.textContent = `Delete marked items?`;
  } else {
    deleteBtn.style.display = "none";
    deleteBtn.textContent = "";
  }
}

function createSecondTable(e) {
  displaySecondTable.style.display = "flex";

  if (e.target.tagName === "BUTTON" && e.target.dataset.title) {
    secondTable.innerHTML = "";
    closeTab(e);
    const idItem = Number(e.target.closest("tr").id);
    const secondeHeadKeys = ["Key", "Values"];

    const headTable = document.createElement("thead");
    const rowThead = document.createElement("tr");
    rowThead.className = "secondTableRow";

    headTable.appendChild(rowThead);
    secondTable.appendChild(headTable);

    secondeHeadKeys.forEach((titleKeys) => {
      const rowTheadItems = document.createElement("th");
      rowTheadItems.className = "secondThead";
      rowTheadItems.textContent = titleKeys;
      rowThead.appendChild(rowTheadItems);
    });

    const mainKey = e.target.dataset.title;
    const singleValueOfItems = parseRowData[mainKey][idItem - 1];
    const arraysOfKeyValues = Object.entries(singleValueOfItems);

    arraysOfKeyValues.forEach((item) => {
      let unpackArray;
      const [name, value] = item;

      if (value.length === 0) {
        unpackArray = `NO DATA`;
      } else if (typeof value === "object") {
        unpackArray = value.join(" ");
      } else {
        unpackArray = value;
      }

      const tableBody = document.createElement("tbody");
      secondTable.appendChild(tableBody);

      tableBody.innerHTML += `
                <tr class='secondTbody'>
                    <td>${name}</td>
                    <td>${unpackArray}</td>
                </tr>
                `;
    });

    const windowWith = window.innerWidth;

    if (windowWith > 1100) {
      wraperTables.style.flexDirection = "row";
    }

    secondTable.style.display = "block";
    handleResize();
  }
}

function closeTab() {
  const close = document.createElement("div");
  close.innerHTML = `<img src='./images/x-mark-256.png'>`;
  close.className = "closeTab";
  secondTable.appendChild(close);

  const closeItem = document.querySelector(".closeTab");

  closeItem.addEventListener("click", () => {
    secondTable.style.display = "none";
    secondTable.innerHTML = "";
    displaySecondTable.classList.remove("overlaySecondTable");
    displaySecondTable.style.display = "none";
    document.body.style.overflow = "visible";
    wraperTables.style.flexDirection = "column";
  });
}

function handleResize() {
  const windowWith = window.innerWidth;
  if (windowWith <= 540) {
    displaySecondTable.classList.add("overlaySecondTable", "flex");
    document.body.style.overflow = "hidden";
  } else {
    displaySecondTable.classList.remove("overlaySecondTable", "flex");
    document.body.style.overflow = "visible";
  }
}

function clear() {
  currentPage = 1;
  startIndex = 0;
  lastIndex = 0;
  selectValue = 10;
  countPages = 0;
}

function createFooterNav() {
  const navItem = document.querySelector(".navigation");
  navItem.innerHTML = "";

  const arrowLeftBtn = document.createElement("button");
  arrowLeftBtn.className = "arrowLeft";
  arrowLeftBtn.id = "arrow-left";
  arrowLeftBtn.innerHTML = `<img class='left' src='./images/arrow-left-long-solid.svg'>`;
  navItem.appendChild(arrowLeftBtn);

  const page = document.createElement("input");
  page.id = "input-page";
  page.value = "1";
  page.min = "1";
  page.type = "number";
  navItem.appendChild(page);

  const textInput = document.createElement("span");
  textInput.id = "text-page";
  textInput.innerHTML = "from 1";
  navItem.appendChild(textInput);

  const arrowRightBtn = document.createElement("button");
  arrowRightBtn.className = "arrowRight";
  arrowRightBtn.id = "arrow-right";
  arrowRightBtn.innerHTML =
    "<img class='right' src='./images/arrow-right-long-solid.svg'>";
  navItem.appendChild(arrowRightBtn);

  const selectItems = document.createElement("select");
  selectItems.id = "select-countity";
  navItem.appendChild(selectItems);
  const option10 = document.createElement("option");
  option10.innerHTML = "10";
  selectItems.appendChild(option10);
  const option20 = document.createElement("option");
  option20.innerHTML = "20";
  selectItems.appendChild(option20);

  const arrowRight = document.querySelector(".right");
  const arrowLeft = document.querySelector(".left");
  const countityItems = document.querySelector("#select-countity");

  arrowRight.addEventListener("click", handleArrowClick);
  arrowLeft.addEventListener("click", handleArrowClick);
  countityItems.addEventListener("change", changeCountity);
  page.addEventListener("blur", changePage);
}

function handleArrowClick(e) {
  e.stopPropagation();
  pages();

  const arrowRight = document.querySelector(".right");
  const arrowLeft = document.querySelector(".left");

  if (currentPage > 1 && e.target === arrowLeft) {
    currentPage--;
  }

  if (e.target === arrowRight && currentPage < countPages) {
    currentPage++;
  }

  deleteBtn.style.display = "none";

  updateIndex();
  newPage();
}

function changeCountity() {
  const countityItems = document.querySelector("#select-countity");
  const prevSelectValue = selectValue;
  const currentValue = +countityItems.value;

  if (currentValue === 20 && currentPage % 2 === 0) {
    startIndex = (currentPage - 1 - 1) * prevSelectValue;
  } else {
    startIndex = (currentPage - 1) * prevSelectValue;
  }

  lastIndex = startIndex + currentValue;
  selectValue = currentValue;
  currentPage = Math.ceil((startIndex + 1) / selectValue);

  displayTableBody();
  newPage();
  pages();
}

function changePage(e) {
  const inputPage = document.querySelector("#input-page");

  if (+inputPage.value > countPages) {
    inputPage.value = countPages;
  }

  currentPage = +inputPage.value;
  updateIndex();
}

function pages(itemlength = 0) {
  const textPages = document.querySelector("#text-page");

  if (itemlength > 0) {
    lengthOfTableBody = itemlength;
  } else {
    lengthOfTableBody = tableBodyItems.length;
  }

  countPages = Math.ceil(lengthOfTableBody / selectValue);

  if (countPages === 1) {
    nav.classList.add("navigationDisabled");
  } else {
    nav.classList.remove("navigationDisabled");
  }

  textPages.innerHTML = `from ${countPages}`;
}

function updateIndex() {
  startIndex = (currentPage - 1) * selectValue;
  lastIndex = startIndex + selectValue;

  displayTableBody();
  pages();
}

function newPage() {
  const inputPage = document.querySelector("#input-page");
  inputPage.value = currentPage;
}

function displayTableBody() {
  const mainTableBody = document.querySelector("#table-body");

  mainTableBody.innerHTML = tableBodyItems
    .slice(startIndex, lastIndex)
    .join("");
}

function createSearchMenu() {
  const divId = document.createElement("div");
  divId.className = "searchId";
  searchMenu.appendChild(divId);

  const inputId = document.createElement("input");
  inputId.type = "number";
  inputId.dataset.input = "searchItem";
  inputId.min = `1`;
  inputId.max = `${tableBodyItems.length}`;

  inputId.placeholder = `Search ID from 0 to ${tableBodyItems.length}`;
  divId.appendChild(inputId);

  const searchButtonOfItems = document.createElement("button");
  searchButtonOfItems.id = "search-id";
  searchButtonOfItems.innerHTML = "Search";
  divId.appendChild(searchButtonOfItems);

  const divName = document.createElement("div");
  divName.className = "searchName";
  searchMenu.appendChild(divName);

  const valueOfName = document.querySelector("td[data-name]").dataset.name;
  const findItemsByName = document.createElement("input");
  findItemsByName.dataset.input = "searchName";
  findItemsByName.placeholder = `Search by ${valueOfName}`;
  divName.appendChild(findItemsByName);

  const searchButtonOfName = document.createElement("button");
  searchButtonOfName.id = "search-name";
  searchButtonOfName.innerHTML = "Search";
  divName.appendChild(searchButtonOfName);

  modeTheme.style.display = "block";
}

function solvePuzzle(e) {
  createPuzzle();
  enigmaItem.style.opacity = "0";
  const puzzleArea = document.querySelector("#puzzle-Input");
  const puzzleText = document.querySelector("#puzzle-cod");
  const puzzleBtn = document.querySelector("#puzzle-button");

  if (e.target === enigmaItem || e.target === puzzleMod) {
    if (!hideWrapper.classList.contains("activeTab")) {
      puzzleText.innerHTML =
        `<p class="alertSolve">Solve the puzzle in JavaScript and feel the power</p>
         <p class="solve">"b" + "a" + + "a" + "a"</p>
        `;
      
      puzzleArea.style.display = "block";
      puzzleBtn.style.display = "block";
      puzzleBtn.innerHTML = "CHECK";

      puzzleClose.style.display = "block";
      puzzleMod2.style.display = "block";
      hideOverlay.classList.add("overlay", "flex", "fixed");
      hideWrapper.classList.add("activeTab", "flex");
      puzzleBtn.style.opacity = "1";
      puzzleArea.style.opacity = "1";
    }
  }
}

function createPuzzle() {
  const puzzleItem = document.querySelector("#puzzle-cod");

  if (!puzzleItem) {
    createAlert();

    const puzzleInput = document.createElement("input");
    puzzleInput.type = "text";
    puzzleInput.placeholder = "Your solution";
    puzzleInput.id = "puzzle-Input";
    puzzleInput.className = "puzzleInputClass";
    hideWrapper.appendChild(puzzleInput);

    const puzzleButton = document.createElement("button");
    puzzleButton.id = "puzzle-button";
    puzzleButton.className = "puzzleCheck";
    hideWrapper.appendChild(puzzleButton);

    const puzzleBtn = document.querySelector("#puzzle-button");
    puzzleBtn.addEventListener("click", checkSolution);
  }
}

function alertErrors() {
  createAlert();
  const puzzleText = document.querySelector("#puzzle-cod");

  if (!hideWrapper.classList.contains("activeTab")) {
    puzzleText.innerHTML = "<p class='alertData'>Submit correct data</p>";

    puzzleClose.style.display = "block";
    hideOverlay.classList.add("overlay", "flex", "fixed");
    hideWrapper.classList.add("activeTab", "flex");
  }
}

function createAlert() {
  const textAlert = document.createElement("div");
  textAlert.id = "puzzle-cod";
  hideWrapper.appendChild(textAlert);
}

function checkSolution() {
  const puzzleArea = document.querySelector("#puzzle-Input");
  const puzzleText = document.querySelector("#puzzle-cod");
  const puzzleBtn = document.querySelector("#puzzle-button");

  if (puzzleArea.value.toLowerCase() === "banana") {
    puzzleText.innerHTML = `<p class="alertSolve">WELL DONE !!!<br>Type on your keyboard:</p><p class='solve'>VADER</p>`;
    puzzleArea.style.display = "none";
    puzzleBtn.style.opacity = "0";
    puzzleArea.style.opacity = "0";
    window.addEventListener("keydown", checkCheatCodes);
  } else {
    puzzleText.innerHTML = "";
    puzzleText.innerHTML = `<p class="alertSolve">WRONG ANSWER</p><p class='solve'>"b" + "a" + + "a" + "a"</p>`;
    puzzleBtn.style.opacity = "1";
    puzzleArea.style.opacity = "1";
  }
}

function checkCheatCodes(e) {
  cheatCodes += e.key.toLowerCase();

  if (cheatCodes.includes("vader")) {
    cheatCodes = "";
    playAudio(audioEnigma);
  }
}

function playAudio(sound) {
  sound.currentTime = 0;
  sound.play();
}

function closePuzzle() {
  const puzzleArea = document.querySelector("#puzzle-Input");
  const puzzleText = document.querySelector("#puzzle-cod");
  const puzzleBtn = document.querySelector("#puzzle-button");

  hideWrapper.classList.remove("activeTab", "flex");
  hideOverlay.classList.remove("overlay", "flex", "fixed");
  puzzleClose.style.display = "none";
  puzzleText.remove();

  if (enigmaItem.style.opacity === "0") {
    enigmaItem.style.opacity = "1";
    puzzleText.innerHTML = "";
    puzzleMod2.style.display = "none";
    puzzleArea.value = "";
    puzzleBtn.remove();
    puzzleArea.remove();
  }
}

function findItems(e) {
  const mainTableBody = document.querySelector("#table-body");
  const itemOfsearchById = document.querySelector("#search-id");
  const inputOfId = document.querySelector('input[data-input="searchItem"]');
  const itemOfSearchByName = document.querySelector("#search-name");
  const inputOfName = document.querySelector('input[data-input="searchName"]');

  if (e.target === itemOfsearchById) {
    if (inputOfId.value === "") return;

    if (+inputOfId.value > bodyItem.length || +inputOfId.value < 1) {
      alertErrors();
      return;
    }

    mainTableBody.innerHTML = findItemsOfId(inputOfId);
    secondTable.style.display = "none";
  }

  if (e.target === itemOfSearchByName) {
    if (inputOfName.value === "") return;

    const content = findItemsOfName(inputOfName);
    if (content.length === 0) {
      alertErrors();
      return;
    }

    secondTable.style.display = "none";
  }
}

function findItemsOfId(inputOfId) {
  const valueOfId = +inputOfId.value;
  const findItem = [bodyItem[valueOfId - 1]];

  pages(findItem.length);
  clear();
  newPage();

  inputOfId.value = "";
  return findItem;
}

function findItemsOfName(inputOfName) {
  const valueOfName = inputOfName.value.toLowerCase();
  const findName = nameItem.filter((nameElement) => {
    return nameElement.toLowerCase().includes(valueOfName);
  });

  arrayOfName = [];
  for (const item of findName) {
    for (const name of bodyItem) {
      if (name.toLowerCase().includes(item.toLowerCase())) {
        arrayOfName.push(name);
      }
    }
  }

  if (arrayOfName.length >= 1) {
    tableBodyItems = arrayOfName;
  }

  clear();
  changeCountity();

  inputOfName.value = "";

  return arrayOfName.join("");
}

const bodyTheme = document.querySelector("body");
let theme = localStorage.getItem("theme");

modeTheme.addEventListener("click", () => {
  if (theme === "dark") {
    bodyTheme.classList.remove("dark");
    lightTheme.style.display = "none";
    darkTheme.style.display = "flex";
    theme = "light";
  } else {
    bodyTheme.classList.add("dark");
    theme = "dark";
    lightTheme.style.display = "flex";
    darkTheme.style.display = "none";
  }

  localStorage.setItem("theme", theme);
});

window.addEventListener("resize", () => {
  const windowWith = window.innerWidth;
  if (windowWith < 1100) {
    wraperTables.style.flexDirection = "column";
  } else {
    wraperTables.style.flexDirection = "row";
  }
});

if (theme === "dark") {
  bodyTheme.classList.add("dark");
  lightTheme.style.display = "flex";
  darkTheme.style.display = "none";
}

titlesBtn.addEventListener("click", createMainTable);
mainTable.addEventListener("click", modifyItemsTable);
deleteBtn.addEventListener("click", deleteButton);
searchMenu.addEventListener("click", findItems);
enigmaItem.addEventListener("click", solvePuzzle);
puzzleClose.addEventListener("click", closePuzzle);
