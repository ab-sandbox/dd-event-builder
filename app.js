const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedIds = [];

  if (guideChecked) {
    selectedIds.push("guide");
  }

  if (audioChecked) {
    selectedIds.push("audio");
  }

  if (catalogChecked) {
    selectedIds.push("catalog");
  }

  const items = services
    .filter((service) => selectedIds.includes(service.id))
    .map((service) => {
      const { title, price } = service;

      return {
        title: title.trim(),
        price,
      };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total,
    items,
  };
}

const title = document.querySelector("#event-title");
const date = document.querySelector("#event-date");
const place = document.querySelector("#event-place");
const description = document.querySelector("#event-description");

const programButton = document.querySelector("#show-program");
const program = document.querySelector("#program");
const form = document.querySelector("#service-form");
const dataError = document.querySelector("#data-error");

let data;

try {
  data = JSON.parse(sourceJson);

  title.textContent = data.event.title;
  date.textContent = data.event.date;
  place.textContent = data.event.place;
  description.textContent = data.event.description;

  programButton.addEventListener("click", () => {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  form.hidden = false;
} catch (error) {
  dataError.textContent = "Ошибка данных.";
  dataError.hidden = false;

  form.hidden = true;
}

console.log(buildReport(data.services, true, false, true));
console.log(buildReport(data.services, false, false, false));
