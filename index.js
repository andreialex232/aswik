// Api
const api = "http://127.0.0.1:3000/all";

// Settings variables
const showArticle = document.getElementById('checkbox-article');
const showEnTranslation = document.getElementById('checkbox-en');
const showRoTranslation = document.getElementById('checkbox-ro');

// Variables used to hide articles & translations
const articleOverlay = document.querySelector('.hidden-article');
const enTranslationOverlay = document.querySelector('.hidden-translation-2');

// Variables used in both english game and used to hide and show articles & translations
const articlePlaceholder = document.querySelector('.game__article-2__placeholder')
const translationList = document.querySelector('.list');

// Variables for english game box
const gameWord = document.querySelector('.game__word-2');
const gameEnTranslation = document.querySelector('.game__translation-2');
const translationItem = document.querySelector('.list__item');

// Function to check settings and returns a boolean
function checkSetting(setting) {
  return setting.checked ? true : false;
}

// Function which shows or hides elements. Used in displaying articles/translations
function switchElementVisibility(elementToShow, elementToHide) {
  elementToShow.classList.remove('u-display-none');
  elementToHide.classList.add('u-display-none');
}

// Function used in creating and appending translations
function createElementAndAppend(word) {
  const li = document.createElement('li');
  li.innerText = word;
  translationList.append(li);
}

// Replace game inner text
const replaceInnerText = {
  article: (wordObj) => {
    // Checks if show article is checked
    if(checkSetting(showArticle)) {
      // Showing article and hiding the overlay
      switchElementVisibility(articlePlaceholder, articleOverlay);
      // Checking to see if data coming is not empty string
      if(wordObj.indefinite_article) {
        articlePlaceholder.innerText = wordObj.indefinite_article;
        return;
      // If data coming is an empty string
      } else {
        articlePlaceholder.innerHTML = '&#8212;';
        return;
      }
    }

    // Checks if show article is checked
    if(!checkSetting(showArticle)) {
      // Hiding article and showing overlay
      switchElementVisibility(articleOverlay, articlePlaceholder);
      // Checking to see if data coming is not empty string
      if(wordObj.indefinite_article) {
        articlePlaceholder.innerText = wordObj.indefinite_article;
        return;
      // If data coming is an empty string
      } else {
        articlePlaceholder.innerHTML = '&#8212;';
        return;
      }
    }
  },
  enTranslation: (wordObj) => {
    // Emptying / Reseting the 'playing field'
    translationList.innerHTML = '';

    // Checks if show english translation is checked
    if(checkSetting(showEnTranslation)) {
      // Showing translation and hiding the overlay
      switchElementVisibility(translationList, enTranslationOverlay);
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.en_translation)) {
        wordObj.en_translation.forEach((translation) => {
          this.createElementAndAppend(translation);
          console.log('bifat, este array');
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.en_translation);
        console.log('bifat, nu este array');
        return;
      };
    };

    // Checks if show english translation is checked
    if(!checkSetting(showEnTranslation)) {
      // Hiding translation and showing the overlay
      switchElementVisibility(enTranslationOverlay, translationList);
      // Checking to see if data coming is an array
      if(Array.isArray(wordObj.en_translation)) {
        wordObj.en_translation.forEach((translation) => {
          this.createElementAndAppend(translation);
          console.log('nebifat, este array');
          return;
        });
      // If data coming is not an array
      } else {
        this.createElementAndAppend(wordObj.en_translation);
        console.log('nebifat, nu este array');
        return;
      }
    }
  }
}








// Get random word
async function getEnWord() {
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
      replaceInnerText.article(randomWordObj);
      replaceInnerText.enTranslation(randomWordObj);
    })
}

// Console.log the data coming from api
function logData() {
  fetch(api, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

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