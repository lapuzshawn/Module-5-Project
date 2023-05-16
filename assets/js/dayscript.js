// Loads HTML before JS executes
$(document).ready(function(){

// Use the $ prefix for jQuery objects 
const $currentDay = $('#currentDay');
const saveButton = $('button');
const alertList = $('.alert');
const alerts = alertList.map((i, element) => new bootstrap.Alert(element)).get();

// Use object destructuring to get localStorageMap or an empty array if not set
const localStorageMap = JSON.parse(localStorage.getItem('map')) || {};

// Use object spread to merge localStorageMap and bodyOb, which is now an empty object
const mergedStorage = { ...localStorageMap, ...{} };

function saveLocalStorage(bodyText, id) {
  mergedStorage[id] = bodyText;
  localStorage.setItem('map', JSON.stringify(mergedStorage));
}

function saveEvent(event) {
  event.preventDefault();

  if (event.target.className === 'btn-close') {
    alertList.addClass('d-none');
    return;
  }

  const $description = $(event.target).parent().children('.description');
  const bodyText = $description.val().trim();
  const bodyId = $description.attr('id');
  saveLocalStorage(bodyText, bodyId);

  alertList.removeClass('d-none');
}

function checkTime() {
  // Use a template literal to set text for $currentDay
  $currentDay.text(`${dayjs().format('dddd, MMMM D, hh:mm:ss a')}`);

  for (let i = 9; i <= 17; i++) {
    const $timeDiv = $(`#hour-${i}`);
    let timeEl = $timeDiv.children('div').text().slice(0, -2);
    let currentHour = parseInt(dayjs().format('HH'), 10);

    if (i >= 13) {
      timeEl = (parseInt(timeEl, 10) + 12).toString();
    }

    $timeDiv.removeClass('past present future');

    if (timeEl < currentHour) {
      $timeDiv.addClass('past');
    } else if (timeEl === currentHour.toString()) {
      $timeDiv.addClass('present');
    } else {
      $timeDiv.addClass('future');
    }
  }
}

function init() {
  for (const key in localStorageMap) {
    $(`#${key}`).text(localStorageMap[key]);
  }

  checkTime();
}

saveButton.on('click', saveEvent);

setInterval(checkTime, 1000);

init();
});