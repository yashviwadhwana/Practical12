let events = JSON.parse(localStorage.getItem("events")) || [
  { id: 1, name: "Hackathon 2026", organizer: "Coding Club", category: "Technical", date: "2026-12-05", venue: "Main Auditorium", total: 100, available: 100 },
  { id: 2, name: "Annual Cultural Fest", organizer: "Cultural Committee", category: "Cultural", date: "2026-12-12", venue: "Open Air Theatre", total: 250, available: 250 },
  { id: 3, name: "Inter-College Cricket", organizer: "Sports Department", category: "Sports", date: "2026-12-18", venue: "College Ground", total: 60, available: 60 }
];

let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

const categoryStyle = {
  "Technical": { icon: "💻", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  "Cultural":  { icon: "🎭", bg: "linear-gradient(135deg,#ec4899,#f43f5e)" },
  "Sports":    { icon: "🏆", bg: "linear-gradient(135deg,#10b981,#06b6d4)" },
  "Workshop":  { icon: "🛠️", bg: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  "Seminar":   { icon: "🎤", bg: "linear-gradient(135deg,#78716c,#a16207)" }
};

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(value) {
  const parts = value.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function showToast(message, type) {
  const box = document.getElementById("toastBox");
  const toast = document.createElement("div");
  toast.className = "toast-msg" + (type === "error" ? " error" : "");
  toast.textContent = message;
  box.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}

function saveData() {
  localStorage.setItem("events", JSON.stringify(events));
  localStorage.setItem("registrations", JSON.stringify(registrations));
}

function displayEvents() {
  let list = document.getElementById("eventList");
  let search = document.getElementById("searchEvent").value.toLowerCase();

  list.innerHTML = "";

  let filteredEvents = events.filter(function (item) {
    return item.name.toLowerCase().includes(search) ||
           item.organizer.toLowerCase().includes(search);
  });

  filteredEvents.forEach(function (item) {
    let style = categoryStyle[item.category] || { icon: "🎉", bg: "linear-gradient(135deg,#64748b,#334155)" };
    let hasSeats = item.available > 0;

    list.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="event-card">
          <div class="event-cover" style="background:${style.bg}">${style.icon}</div>
          <div class="event-body">
            <h4>${escapeHTML(item.name)}</h4>
            <div class="event-organizer">by ${escapeHTML(item.organizer)}</div>
            <span class="cat-badge">${escapeHTML(item.category)}</span>
            <div class="event-meta">📅 ${formatDate(item.date)}</div>
            <div class="event-meta">📍 ${escapeHTML(item.venue)}</div>
            <div class="seats ${hasSeats ? "in" : "out"}">
              ${hasSeats ? "● " + item.available + " of " + item.total + " seats available" : "● Fully booked"}
            </div>
            <button class="btn btn-select" ${hasSeats ? "" : "disabled"} onclick="selectEvent(${item.id})">
              ${hasSeats ? "Select Event" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (filteredEvents.length === 0) {
    list.innerHTML = "<p class='text-center text-muted'>No events found.</p>";
  }

  updateInformation();
  updateEventOptions();
}

function addEvent(event) {
  event.preventDefault();

  let name = document.getElementById("eventName").value.trim();
  let organizer = document.getElementById("organizerName").value.trim();
  let category = document.getElementById("category").value;
  let date = document.getElementById("eventDate").value;
  let venue = document.getElementById("venue").value.trim();
  let seats = Number(document.getElementById("seats").value);

  if (seats <= 0 || !Number.isInteger(seats)) {
    showToast("Enter a valid number of seats.", "error");
    return;
  }

  events.push({
    id: Date.now(),
    name: name,
    organizer: organizer,
    category: category,
    date: date,
    venue: venue,
    total: seats,
    available: seats
  });

  saveData();
  showToast("Event added successfully!");
  event.target.reset();
  displayEvents();
}

function updateInformation() {
  let seats = events.reduce(function (sum, item) { return sum + item.available; }, 0);

  document.getElementById("totalEvents").innerText = events.length;
  document.getElementById("availableSeats").innerText = seats;
  document.getElementById("totalRegistrations").innerText = registrations.length;
}

function updateEventOptions() {
  let select = document.getElementById("registerEventName");
  let selectedValue = select.value;

  select.innerHTML = '<option value="">Select Event</option>';

  events.forEach(function (item) {
    if (item.available > 0) {
      let option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    }
  });

  if ([...select.options].some(function (o) { return o.value === selectedValue; })) {
    select.value = selectedValue;
  }
}

function selectEvent(id) {
  document.getElementById("registerEventName").value = id;
  document.getElementById("registerEvent").scrollIntoView({ behavior: "smooth" });
}

function registerEvent(event) {
  event.preventDefault();

  let participant = document.getElementById("participantName").value.trim();
  let eventId = Number(document.getElementById("registerEventName").value);

  let chosen = events.find(function (item) { return item.id === eventId; });

  if (!chosen || chosen.available <= 0) {
    showToast("No seats available for this event!", "error");
    return;
  }

  chosen.available--;

  registrations.push({
    id: Date.now(),
    participant: participant,
    eventId: chosen.id,
    eventName: chosen.name,
    date: new Date().toLocaleDateString("en-IN")
  });

  saveData();
  showToast("Registration successful!");
  event.target.reset();
  displayEvents();
  displayRegistrations();
}

function displayRegistrations() {
  let list = document.getElementById("registrationList");
  list.innerHTML = "";

  if (registrations.length === 0) {
    list.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">No registrations yet.</td>
      </tr>
    `;
    return;
  }

  registrations.forEach(function (item) {
    list.innerHTML += `
      <tr>
        <td>${escapeHTML(item.participant)}</td>
        <td>${escapeHTML(item.eventName)}</td>
        <td>${item.date || "—"}</td>
        <td>
          <button class="btn btn-return" onclick="cancelRegistration(${item.id})">Cancel</button>
        </td>
      </tr>
    `;
  });
}

function cancelRegistration(id) {
  let index = registrations.findIndex(function (item) { return item.id === id; });

  if (index === -1) {
    return;
  }

  let chosen = events.find(function (item) { return item.id === registrations[index].eventId; });

  if (chosen) {
    chosen.available++;
  }

  registrations.splice(index, 1);
  saveData();

  showToast("Registration cancelled.");
  displayEvents();
  displayRegistrations();
}

function contactUs(event) {
  event.preventDefault();
  showToast("Your message has been submitted successfully!");
  event.target.reset();
}

displayEvents();
displayRegistrations();
