// Api
const api = "http://127.0.0.1:3000/all";
let apiData;

// Variables for session history
const sessionHistoryItems = [];
const historyDate = document.querySelector('.history__date');
const historyList = document.querySelector('.history__content__list');
const historyPlaceholder = document.querySelector('.placeholder-history');

// Settings variables
const showArticle = document.getElementById('checkbox-article');
const showEnTranslation = document.getElementById('checkbox-en');
const showRoTranslation = document.getElementById('checkbox-ro');

// Variables used in both displaying text and to hide and show articles & translations
const articlePlaceholderEn = document.querySelector('.game__article-2__placeholder')
const translationListEn = document.querySelector('.list-2');
const enTranslationOverlay = document.querySelector('.hidden-translation-2');
const articleOverlayEn = document.querySelector('.hidden-article-2');
const gameWordEn = document.querySelector('.game__word-2');

// Buttons
const generateBtn = document.querySelector('.generate-button');
const fetchBtn = document.querySelector('.fetch-button');

// Checks for window resize (mostly desktops)
function widthLowerThanTarget() {
  visibility.showArticle();
  visibility.showTranslation();
};

// Debounce
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};

// Functions which check for something grouped into an object
const check = {
  setting: (setting) => {
    return setting.checked? true: false;
  },
  enChecked: () => {
    showRoTranslation.checked = false;
  },
  roChecked: () => {
    showEnTranslation.checked = false;
  },
  // Checks if we have data stored apiData
  ifDataLoaded: () => {
    if(apiData) {
      visibility.showGetWordBtn();
    }
  },
  // Checks for device width (mostly desktops) and checks checkboxes when width lower than 608px
  deviceWidth: () => {
    if(window.innerWidth <= 608 || screen.width <= 608) {
      showEnTranslation.checked = true;
      showArticle.checked = true;
    };
  },
  // Checks for target width
  width: () => {
    const targetWidth = 608;
    if(window.innerWidth <= targetWidth) {
      widthLowerThanTarget();
    };
  }
};

// Triggers on window resize every 200 milliseconds
const debouncedCheckWidth = debounce(check.width, 200);
window.addEventListener('resize', debouncedCheckWidth);


// Checks for window or screen width on load
/* document.addEventListener("DOMContentLoaded", () => {
  if(window.innerWidth <= 608 || screen.width <= 608) {
    showEnTranslation.checked = true;
    showArticle.checked = true;
  };
}); */

// Manages article and translation visibility using the bottom method
const visibility = {
  showArticle: () => {
    visibility.switchElementVisibility(articlePlaceholderEn, articleOverlayEn);
  },
  hideArticle: () => {
    visibility.switchElementVisibility(articleOverlayEn, articlePlaceholderEn);
  },
  showTranslation: () => {
    visibility.switchElementVisibility(translationListEn, enTranslationOverlay);
  },
  hideTranslation: () => {
    visibility.switchElementVisibility(enTranslationOverlay, translationListEn);
  },
  showGetWordBtn: () => {
    visibility.switchElementVisibility(generateBtn, fetchBtn);
  },
  hideGetWordBtn: () => {
    visibility.switchElementVisibility(fetchBtn, generateBtn);
  },
  switchElementVisibility(elementToShow, elementToHide) {
    elementToShow.classList.remove('u-display-none');
    elementToHide.classList.add('u-display-none');
  }
};

// Checks session storage for data stored, if we dont have data then we show a button to load data
const checkForStoredData = (function() {
  if(JSON.parse(sessionStorage.getItem("fetchedData"))) {
    apiData = JSON.parse(sessionStorage.getItem("fetchedData"));
    visibility.showGetWordBtn();
  } else {
    visibility.hideGetWordBtn();
  }
})();

// Session history
const historySesh = {
  createObj: (value1, value2, value3)  => {
    const obj = new Object;
    obj.article = value1;
    obj.word = value2,
    obj.translation = value3;
    return obj;
  },
  pushToArray: (obj) => {
    sessionHistoryItems.push(obj);
  },
};

// Functions used in creating and appending elements
const dom = {
  createElement: (element) => {
    const createdElement = document.createElement(element);
    return createdElement;
  },
  appendElement: (element, placeToAppend) => {
    placeToAppend.append(element);
  },
  createAndAppendTranslation: (translation) => {
    const newItem = dom.createElement("li");
    newItem.innerText = translation;
    dom.appendElement(newItem, translationListEn)
  },
  createAndAppendHistory: () => {
    const newLi = dom.createElement("li");
    newLi.classList.add("history__content__list__items")
    const lastItem = sessionHistoryItems[sessionHistoryItems.length -1];
    dom.appendElement(newLi, historyList);
    for (const [key, value] of Object.entries(lastItem)) {
      const newDiv = dom.createElement("div");
      if(Array.isArray(value)) {
        newDiv.innerText = value.join(", ");
      } else {
        newDiv.innerText = value;
      };
      dom.appendElement(newDiv, newLi);
    };
  },
};

// Replaces inner text and the first 3 return the article, the word and the translation (ro or en) respectively
const replaceInnerText = {
  article: (wordObj) => {
    if(check.setting(showArticle)) {
      visibility.showArticle();
    } else {
      visibility.hideArticle();
    }
    return replaceInnerText.replaceArticle(wordObj.indefinite_article);
  },
  translation: (wordObj) => {
    translationListEn.innerHTML = '';
    if(check.setting(showEnTranslation) || check.setting(showRoTranslation)) {
      visibility.showTranslation();
      if(check.setting(showEnTranslation)) {
        return replaceInnerText.appendTranslation(wordObj.en_translation);
      } else {
        return replaceInnerText.appendTranslation(wordObj.ro_translation);
      };
    } else {
      visibility.hideTranslation();
      return replaceInnerText.appendTranslation(wordObj.en_translation);
    };
  },
  word: (wordObj) => {
    gameWordEn.innerText = wordObj.word;
    return gameWordEn.innerText;
  },

  // These are used above
  appendTranslation: (item) => {
    const translationArray = [];
    if(Array.isArray(item)) {
      item.forEach((translation) => {
        dom.createAndAppendTranslation(translation);
        translationArray.push(translation);
      })
      return translationArray;
    } else {
      dom.createAndAppendTranslation(item);
      return item;
    };
    
  },
  replaceArticle: (item) => {
    if(item) {
      articlePlaceholderEn.innerText = item;
      return item;
    } else {
      articlePlaceholderEn.innerHTML = '&#8212;';
      return articlePlaceholderEn.innerHTML;
    };
  },
  time: () => {
    const date = new Date();
    historyDate.innerText = `Created on: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  }
};

// Function used to replace all texts at once, binded on get random word button
function getWord() {  
  const randomWordObj = apiData[Math.floor(Math.random() * apiData.length)];
  check.deviceWidth();
  historySesh.pushToArray(historySesh.createObj(replaceInnerText.article(randomWordObj),
                                                replaceInnerText.word(randomWordObj),
                                                replaceInnerText.translation(randomWordObj)));
  console.log(sessionHistoryItems);
  replaceInnerText.time();
  dom.createAndAppendHistory();
};

// Fetch data then store it in a variable
async function fetchData() {
  await fetch(api, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      apiData = res;
      sessionStorage.setItem("fetchedData", JSON.stringify(apiData));
      check.ifDataLoaded();
    })
};

// Console.log the data coming from api
function logData() {
  fetch(api, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(res => console.log(res))
};

// Functions used for post
function commaRemover(inputValue) {
  let newInput = inputValue;
  if(inputValue.includes(',')) {
    newInput = inputValue.replace(/\s*,\s*/g, ",").split(',')
  }
  return newInput
};

async function postData() {
  const word = await document.getElementById('word').value?.trim().toLowerCase();
  const article = await document.getElementById('article').value?.trim().toLowerCase();
  const ro_translation = await document.getElementById('ro-trans').value?.toLowerCase();
  const en_translation = await document.getElementById('en-trans').value?.toLowerCase();

  const res = await fetch(fetchURL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({word,
                          article, 
                          ro_translation: commaRemover(ro_translation),
                          en_translation: commaRemover(en_translation)
    })
  })

  const data = await res.json();
  if(data.acknowledged) {
    console.log('Successfully added:', article, word, '|', 'Ro:', ro_translation, '|', 'En:', en_translation);
  } else {
    console.error('Could not add:', word);
  }
};