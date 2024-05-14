// Api
const api = "http://127.0.0.1:3000/all";
let apiData;

// Variables for session history
const date = new Date();
const sessionHistoryItems = [];
const historyDate = document.querySelector('.history-date');

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

// Function which shows or hides elements. Used in displaying articles/translations
function switchElementVisibility(elementToShow, elementToHide) {
  elementToShow.classList.remove('u-display-none');
  elementToHide.classList.add('u-display-none');
};

// Manages article and translation visibility using the above function
const visibility = {
  showArticle: () => {
    switchElementVisibility(articlePlaceholderEn, articleOverlayEn);
  },
  hideArticle: () => {
    switchElementVisibility(articleOverlayEn, articlePlaceholderEn);
  },
  showTranslation: () => {
    switchElementVisibility(translationListEn, enTranslationOverlay);
  },
  hideTranslation: () => {
    switchElementVisibility(enTranslationOverlay, translationListEn);
  },
  showGetWordBtn: () => {
    switchElementVisibility(generateBtn, fetchBtn);
  },
  hideGetWordBtn: () => {
    switchElementVisibility(fetchBtn, generateBtn);
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
  }
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
  }
};

// Functions used in creating and appending translations
const dom = {
  createElement: (element) => {
    const createdElement = document.createElement(element);
    return createdElement;
  },
  appendElement: (element, placeToAppend) => {
    placeToAppend.append(element);
  },
  createAndAppendLi: (translation) => {
    const newItem = dom.createElement("li");
    newItem.innerText = translation;
    dom.appendElement(newItem, translationListEn)
   }
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
        dom.createAndAppendLi(translation);
        translationArray.push(translation);
      })
      return translationArray;
    } else {
      dom.createAndAppendLi(item);
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
  }
};

// Function used to replace all texts at once, binded on get random word button
function getWord() {  
  const randomWordObj = apiData[Math.floor(Math.random() * apiData.length)];
  /* replaceInnerText.article(randomWordObj);
  replaceInnerText.translation(randomWordObj);
  replaceInnerText.word(randomWordObj); */
  historySesh.pushToArray(historySesh.createObj(replaceInnerText.article(randomWordObj),
                                                replaceInnerText.word(randomWordObj),
                                                replaceInnerText.translation(randomWordObj)));
  console.log(sessionHistoryItems);
}

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