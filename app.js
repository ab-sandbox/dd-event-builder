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

const elements = {
  title: document.querySelector("#event-title"),
  date: document.querySelector("#event-date"),
  place: document.querySelector("#event-place"),
  description: document.querySelector("#event-description"),
  programButton: document.querySelector("#show-program"),
  program: document.querySelector("#program"),
  form: document.querySelector("#service-form"),
  guide: document.querySelector("#guide"),
  audio: document.querySelector("#audio"),
  catalog: document.querySelector("#catalog"),
  dataError: document.querySelector("#data-error"),
  choiceError: document.querySelector("#choice-error"),
  result: document.querySelector("#result"),
  reportJson: document.querySelector("#report-json"),
};

function parseData(json) {
  return JSON.parse(json);
}

function renderEvent(event) {
  elements.title.textContent = event.title;
  elements.date.textContent = event.date;
  elements.place.textContent = event.place;
  elements.description.textContent = event.description;
}

function toggleProgram(meeting) {
  elements.program.hidden = !elements.program.hidden;

  if (!elements.program.hidden) {
    elements.program.textContent = meeting;
  }

  elements.programButton.textContent = elements.program.hidden
    ? "Показать программу"
    : "Скрыть программу";
}

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

function renderReport(report) {
  const serviceTitles = report.items.map((item) => item.title);

  elements.result.innerHTML = [
    `Выбрано услуг: ${report.count}`,
    `Итого: ${report.total} руб.`,
    ...serviceTitles,
  ].join("<br>");

  const json = JSON.stringify(report);
  JSON.parse(json);

  elements.reportJson.textContent = json;

  elements.result.hidden = false;
  elements.reportJson.hidden = false;
}

function showChoiceError() {
  elements.choiceError.textContent = "Выберите хотя бы одну услугу.";
  elements.choiceError.hidden = false;

  elements.result.hidden = true;
  elements.reportJson.hidden = true;
}

function handleSubmit(event, services) {
  event.preventDefault();

  const report = buildReport(
    services,
    elements.guide.checked,
    elements.audio.checked,
    elements.catalog.checked,
  );

  if (report.count === 0) {
    showChoiceError();
    return;
  }

  elements.choiceError.hidden = true;
  renderReport(report);
}

function init() {
  try {
    const data = parseData(sourceJson);

    renderEvent(data.event);

    elements.programButton.addEventListener("click", () => {
      toggleProgram(data.event.meeting);
    });

    elements.form.addEventListener("submit", (event) => {
      handleSubmit(event, data.services);
    });

    elements.form.hidden = false;
  } catch (error) {
    console.error("Ошибка инициализации:", error);

    elements.dataError.textContent = "Ошибка данных.";
    elements.dataError.hidden = false;
    elements.form.hidden = true;
  }
}

init();
