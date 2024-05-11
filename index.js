// Api
const api = "http://127.0.0.1:3000/all";

// Settings variables
const showArticle = document.getElementById('checkbox-article');
const showEnTranslation = document.getElementById('checkbox-en');
const showRoTranslation = document.getElementById('checkbox-ro');

// Variables used in both english game and used to hide and show articles & translations
const articlePlaceholderEn = document.querySelector('.game__article-2__placeholder')
const translationListEn = document.querySelector('.list-2');
const enTranslationOverlay = document.querySelector('.hidden-translation-2');
const articleOverlayEn = document.querySelector('.hidden-article-2');

// Variables used in both romanian game and used to hide and show articles & tranlations
const articlePlaceholderRo = document.querySelector('.game__article-3__placeholder');
const translationListRo = document.querySelector('.list-3');
const roTranslationOverlay = document.querySelector('.hidden-translation-3');
const articleOverlayRo = document.querySelector('.hidden-article-3');

// Word for ro box
const gameWordRo = document.querySelector('.game__word-3');

// Word for en box
const gameWordEn = document.querySelector('.game__word-2');

// Function to check settings and returns a boolean
function checkSetting(setting) {
  return setting.checked ? true : false;
};

// Function which shows or hides elements. Used in displaying articles/translations
function switchElementVisibility(elementToShow, elementToHide) {
  elementToShow.classList.remove('u-display-none');
  elementToHide.classList.add('u-display-none');
};

// Manages article visibility using the above function
const visibility = {
  enShowArticle: () => {
    switchElementVisibility(articlePlaceholderEn, articleOverlayEn);
  },
  enHideArticle: () => {
    switchElementVisibility(articleOverlayEn, articlePlaceholderEn);
  },
  enShowTranslation: () => {
    switchElementVisibility(translationListEn, enTranslationOverlay);
  },
  enHideTranslation: () => {
    switchElementVisibility(enTranslationOverlay, translationListEn);
  },
  roShowArticle: () => {
    switchElementVisibility(articlePlaceholderRo, articleOverlayRo);
  },
  roHideArticle: () => {
    switchElementVisibility(articleOverlayRo, articlePlaceholderRo);
  },
  roShowTranslation: () => {
    switchElementVisibility(translationListRo, roTranslationOverlay);
  },
  roHideTranslation: () => {
    switchElementVisibility(roTranslationOverlay, translationListRo);
  }
};

// Function used in creating and appending translations
function createElementAndAppend(word, whereToAppend) {
  const li = document.createElement('li');
  li.innerText = word;
  whereToAppend.append(li);
};

// Replace game inner text
const replaceInnerText = {
  article: (wordObj, gameArticle, lang) => {
    // Checks if show article is checked
    if(checkSetting(showArticle)) {
      // Showing article and hiding the overlay based on lang chosen
      if(lang === "en") {
        visibility.enShowArticle();
      } else {
        visibility.roShowArticle();
      }
      // Checking to see if data coming is not empty string
      if(wordObj.indefinite_article) {
        gameArticle.innerText = wordObj.indefinite_article;
        return;
      // If data coming is an empty string
      } else {
        gameArticle.innerHTML = '&#8212;';
        return;
      };
    };

    // Checks if show article is checked
    if(!checkSetting(wordObj, gameArticle)) {
      // Hiding article and showing overlay
      if(lang === "en") {
        visibility.enHideArticle();
      } else {
        visibility.roHideArticle();
      }
      // Checking to see if data coming is not empty string
      if(wordObj.indefinite_article) {
        gameArticle.innerText = wordObj.indefinite_article;
        return;
      // If data coming is an empty string
      } else {
        gameArticle.innerHTML = '&#8212;';
        return;
      };
    };
  },
  enTranslation: (wordObj) => {
    // Emptying / Reseting the 'playing field'
    translationListEn.innerHTML = '';

    // Checks if show english translation is checked
    if(checkSetting(showEnTranslation)) {
      // Showing translation and hiding the overlay
      visibility.enShowTranslation();
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.en_translation)) {
        wordObj.en_translation.forEach((translation) => {
          this.createElementAndAppend(translation, translationListEn);
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.en_translation, translationListEn);
        return;
      };
    };

    // Checks if show english translation is checked
    if(!checkSetting(showEnTranslation)) {
      // Hiding translation and showing the overlay
      visibility.enHideTranslation();
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.en_translation)) {
        wordObj.en_translation.forEach((translation) => {
          this.createElementAndAppend(translation, translationListEn);
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.en_translation, translationListEn);
        return;
      };
    };
  },
  roTranslation: (wordObj) => {
    // Emptying / Reseting the 'playing field'
    translationListRo.innerHTML = '';

    // Checks if show english translation is checked
    if(checkSetting(showRoTranslation)) {
      // Showing translation and hiding the overlay
      visibility.roShowTranslation();
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.ro_translation)) {
        wordObj.ro_translation.forEach((translation) => {
          this.createElementAndAppend(translation, translationListRo);
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.ro_translation, translationListRo);
        return;
      };
    };

    // Checks if show english translation is checked
    if(!checkSetting(showRoTranslation)) {
      // Hiding translation and showing the overlay
      visibility.roHideTranslation();
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.ro_translation)) {
        wordObj.ro_translation.forEach((translation) => {
          this.createElementAndAppend(translation, translationListRo);
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.ro_translation, translationListRo);
        return;
      };
    };
  },
  enWord: (wordObj) => {
    gameWordEn.innerText = wordObj.word;
  },
  roWord: (wordObj) => {
    gameWordRo.innerText = wordObj.word;
  }
}

// Get random word
async function getWord(lang) {
  await fetch(api, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then((res) => {
      const random = Math.floor(Math.random() * res.length);
      const randomWordObj = res[random];
      if(lang === 'en') {
        replaceInnerText.article(randomWordObj, articlePlaceholderEn, "en");
        replaceInnerText.enWord(randomWordObj);
        replaceInnerText.enTranslation(randomWordObj);
      } else if(lang === 'ro') {
        replaceInnerText.article(randomWordObj, articlePlaceholderRo, "ro");
        replaceInnerText.roWord(randomWordObj);
        replaceInnerText.roTranslation(randomWordObj);
      } else {
        console.log('something went wrong')
      };
    });
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