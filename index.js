// Api
const api = "http://127.0.0.1:3000/all";
let apiData;

// Time variable
const date = new Date();

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
  ifArrayAndAppend: (item) => {
    if(Array.isArray(item)) {
      item.forEach((translation) => {
        createAndAppendLi(translation);
      })
    } else {
      createAndAppendLi(item);
    };
  },
  ifArticleExistsReplace: (item) => {
    if(item) {
      articlePlaceholderEn.innerText = item;
    } else {
      articlePlaceholderEn.innerHTML = '&#8212;';
    }
  },
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
};

// This combines both of the above into 1
function createAndAppendLi(translation) {
  const newItem = dom.createElement("li");
  newItem.innerText = translation;
  dom.appendElement(newItem, translationListEn);
}

// Replaces inner text
const replaceInnerText = {
  article: (wordObj) => {
    check.ifArticleExistsReplace(wordObj.indefinite_article);
    if(check.setting(showArticle)) {
      visibility.showArticle();
    } else {
      visibility.hideArticle();
    }
  },
  translation: (wordObj) => {
    translationListEn.innerHTML = '';
    if(check.setting(showEnTranslation) || check.setting(showRoTranslation)) {
      visibility.showTranslation();
      if(check.setting(showEnTranslation)) {
        check.ifArrayAndAppend(wordObj.en_translation);
        return;
      } else {
        check.ifArrayAndAppend(wordObj.ro_translation);
        return;
      };
    } else {
      visibility.hideTranslation();
      check.ifArrayAndAppend(wordObj.en_translation);
      return;
    };
  },
  word: (wordObj) => {
    gameWordEn.innerText = wordObj.word;
  }
};

// Function used to replace all texts at once, binded on get random word button
function getWord() {  
  const randomWordObj = apiData[Math.floor(Math.random() * apiData.length)];
  replaceInnerText.article(randomWordObj);
  replaceInnerText.translation(randomWordObj);
  replaceInnerText.word(randomWordObj);
}

// Fetch data then store in a variable
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