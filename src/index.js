'use strict'
import "./styles/index.scss";

let  currentPlace = '';
let bck = '';


function loadingPage() {
  document.querySelector('.loading').style.display = "none";
  document.querySelector('.wrap').style.display = "flex";

}


 function getLocation() {
   if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`)

    .then(function (response) {
      if (response.status !== 200) {
        alert('err in getLocation')
        return
      };
      response.json().then(function (data) {
        currentPlace = data.city === ""  ?  data.countryName : data.city;
        getApiData()
      });
    })
 }, error => {
  let result = prompt('Не удалось определить местоположение, укажите:' );
  currentPlace = result;
  getApiData()
   console.error(error)
 })
}
 }


 function changeCity() {
  let value = document.querySelector('.cityInput').value;
  currentPlace = value;
  getApiData(currentPlace);
}


function getApiData() {
  let currentWether = []
  let lon = ''
  let lat = ''

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentPlace}&units=metric,{state%20code}&appid=7a272ee75ecd163ddfed4a4a57d3e611&lang=ru`)

.then(function (response) {
  if (response.status !== 200) {
    alert('err in getApiData')
    return
  };
  response.json().then(function (data) {
    currentWether = data;
    lon = currentWether.coord.lon.toString().slice(0,5)
    lat = currentWether.coord.lat.toString().slice(0,5)
    bck = currentWether.weather[0].description
    setBckground(bck)
    renderCurrentWether(currentWether)
    loadingPage()

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${Number(lat)}&lon=${Number(lon)}&exclude=hourly&appid=7a272ee75ecd163ddfed4a4a57d3e611&lang=ru`)

.then(function (response) {
  response.json().then(function (data) {
    let daily = []
    for (let i=0; i<8; i++) {
      let customObject = {
        ["day"]: getDay(data.daily[i].dt),
        ["icon"]: `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`,
        ["temp"]: data.daily[i].temp.day,
        ["mounth"]: getMounth(data.daily[i].dt)
      }
      daily.push(customObject)
    }
    renderDailyInfo(daily);
  })
})

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${Number(lat)}&lon=${Number(lon)}&exclude=daily&appid=7a272ee75ecd163ddfed4a4a57d3e611&lang=ru`) 

.then(function (response) {
  response.json().then(function (data) {
    let hourly = []
    for (let i=0; i < 12; i++) {
      let customObject = {
        ["day"]: getHour(data.hourly[i].dt),
        // ["mainInfo"]: data.hourly[i].weather[0].description,
        ["icon"]: `https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png`,
        ["temp"]: data.hourly[i].temp
      }
      hourly.push(customObject)
    }
    renderHourlyInfo(hourly)
  })
})
.catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  });
  })
})
}

document.querySelector('.showHourly').onclick = function() {
  document.querySelector('.daily').style.display = "none";
  document.querySelector('.hourly').style.display = "flex";
  document.querySelector('.showHourly').style.border = "1px solid";
  document.querySelector('.showDaily').style.border = "inherit";
}
document.querySelector('.showDaily').onclick = function() {
  document.querySelector('.daily').style.display = "flex";
  document.querySelector('.hourly').style.display = "none";
  document.querySelector('.showDaily').style.border = "1px solid";
  document.querySelector('.showHourly').style.border = "inherit";
}

getLocation()

document.querySelector('.cityInput').onkeydown = function(event) {
  if (event.keyCode == 13) {
    changeCity();
  }
}
document.querySelector('.searchIcon').onclick = function() {
  changeCity()
}


function getHour(timestamp) {
  let i = new Date(timestamp * 1000);
  let hour = i.getHours()
  return hour
}
function getDay(timestamp) {
  let i = new Date(timestamp * 1000);
  let day = i.getDate()
  return day
}
function getMounth(timestamp) {
  var months = ['Янв','Фев','Мар','Апр','Мая','Июня','Июля','Авг','Сен','Окт','Ноя','Дек'];
  let i = new Date(timestamp * 1000);
  let mounth = months[i.getMonth()];
  return mounth
}


  class CreateItem {
    constructor(day, mounth, temp, icon, parentSelector, ...classes) {
      this.day = day;
      this.mounth = mounth;
      this.temp = Math.round(temp -273.15 );
      this.icon = icon;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector)
    }
    render() {
      const element = document.createElement('div');
      this.classes.forEach(className => element.classList.add(className));
        element.innerHTML = `
       ${ this.mounth ===  null ? 
        // ``
        `<div></div>`
        : `<div>${this.mounth}</div>`} 
        <div  class="day">${this.day}</div>
        <img class="icon" src=${this.icon}>
        <div class="temp">${this.temp}</div>
        `
        this.parent.append(element);
    }
  }

//рендер общей информации
  function renderCurrentWether(currentWether) {
    document.querySelector('.current__city').textContent = currentWether.name;
    document.querySelector('.current__day').textContent = getDay(currentWether.dt) + ' ' + getMounth(currentWether.dt) + ' ' + getHour(currentWether.dt) +':00';
    document.querySelector('.current__temp').textContent = Math.round(currentWether.main.temp -273.15 );
    document.querySelector('.current__mainInfo').textContent = currentWether.weather[0].description + ', ' + 'ощущается: '+ Math.round(currentWether.main.feels_like -273.15) + ', '+ 'скорость ветра: '+ currentWether.wind.speed + ' м/с';
    
    const element = document.createElement('div');
    element.innerHTML = `
    <img class="current__icon" src=${`http://openweathermap.org/img/wn/${currentWether.weather[0].icon}@2x.png`}>
    `;
    document.querySelector(".current__icon").replaceWith(element);
  };
  
//рендер на 7 дней вперед
function renderDailyInfo(daily) {
  let element = document.querySelector(".daily");
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
  for (let i=0; i<daily.length; i++) {
    new CreateItem(daily[i].day, daily[i].mounth,  daily[i].temp, daily[i].icon, ".daily", "item").render();
  }
}
//рендер по часам
function renderHourlyInfo(hourly) {
  let element = document.querySelector(".hourly");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  for (let i=0; i<hourly.length; i++)  {
    new CreateItem(hourly[i].day, null, hourly[i].temp, hourly[i].icon, ".hourly", "item").render();
  }
}


function setBckground(data) {
  if (data === 'пасмурно') {
   document.querySelector(".wrap").className = "wrap bckDark"
  } else if (data === 'ясно')  {
    document.querySelector(".wrap").className =  "wrap bckClear";
  } else if (data === 'небольшая облачность' || 'облачно с прояснениями' || 'переменная облачность') {
    document.querySelector(".wrap").className = "wrap bckCloudy";
  } else {
    document.querySelector(".wrap").className =  "wrap"
  }
}


