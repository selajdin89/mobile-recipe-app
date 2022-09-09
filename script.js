const mealsEl = document.querySelector(".lower-block");
const favContainer = document.getElementById("favourite");
const heartBtn = document.querySelector(".heart-btn");
const searchEL = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const closePopup = document.querySelector(".close-btn");
const mealInfoEl = document.querySelector(".meal-info");
const mealPopup = document.querySelector(".popup-container");
const searchElement = document.querySelector(".search-form");
const popupContainer = document.querySelector(".popup-info");

const getRandomMeal = async function () {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  const randomData = data.meals[0];
  console.log(randomData);

  addMeal(randomData, true);
};

getRandomMeal();

fetchFavMeals();

async function getMealById(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  const data = await response.json();
  console.log(data);
  const mealData = data.meals[0];
  console.log(mealData);

  return mealData;
}

const getMealByName = async function (name) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  const data = await response.json();

  const meals = data.meals;

  return meals;
};

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
  <div class="meal">
    <div class="random-recipe">
  ${random ? '<h3 class="random">Random Recipe</h3>' : ""}
          
          <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
          />
        </div>

        <footer class="footer">
          <h3>${mealData.strMeal}</h3>
          <button class="heart-btn">
            <i class="fas fa-heart"></i>
          </button>
          
        </footer>
        </div>    
  `;

  // const btn = meal.querySelector('.heart-btn');

  // meal.addEventListener('click', function () {
  //   showMealInfo(mealData);
  // });

  mealsEl.appendChild(meal);
  // let btn;
  const btnShowMealInfo = meal.querySelector(".random-recipe");
  const btn = meal.querySelector(".heart-btn");
  btn.addEventListener("click", function (e) {
    if (!btn) return;

    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealTolS(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeals();

    btnShowMealInfo.addEventListener("click", function () {
      showMealInfo(mealData);
    });
  });
}

function getMealsFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

function addMealTolS(mealId) {
  const mealIds = getMealsFromLS();
  console.log(mealIds);

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsFromLS();
  console.log(mealIds);

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function addFavMeal(mealData) {
  const favMeals = document.createElement("li");

  favMeals.innerHTML = `
  
    <img class="fav-meal"
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
    /><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fa-solid fa-rectangle-xmark"></i></button>
  `;

  const btn = favMeals.querySelector(".clear");

  btn.addEventListener("click", function () {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });

  favMeals.addEventListener("click", function (e) {
    const btn = e.target.closest(".fav-meal");

    if (!btn) return;
    showMealInfo(mealData);
  });

  favContainer.appendChild(favMeals);
}

async function fetchFavMeals() {
  favContainer.innerHTML = "";
  const mealIds = getMealsFromLS();
  console.log(mealIds);
  // const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    const meal = await getMealById(mealId);

    addFavMeal(meal);
  }
}

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = "";

  const mealEl = document.createElement("div");

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
          <h2>${mealData.strMeal}</h2>
          <img
            src="${mealData.strMealThumb}"
            alt=""
          />
          <p>
            ${mealData.strInstructions}
          </p>
          <h3>ingredients:</h3>
          <ul>
              ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
              
          </ul>
        `;

  mealInfoEl.appendChild(mealEl);

  mealPopup.classList.remove("hidden");
}

searchElement.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Clean container

  mealsEl.innerHTML = "";

  const query = searchEL.value;

  const meals = await getMealByName(query);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
      searchEL.value = "";
    });
  }
});

popupContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".close-popup");

  if (!btn) return;

  mealPopup.classList.add("hidden");
});
