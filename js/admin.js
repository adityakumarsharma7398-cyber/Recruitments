const adminEmail = "admin@club.com";
const adminPass = "admin123";

function getEvents() {
  let data = localStorage.getItem("events") || localStorage.getItem("clubEvents");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

function getRegistrations() {
  let data = localStorage.getItem("registrations") || localStorage.getItem("clubRegistrations");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveRegistrations(registrations) {
  localStorage.setItem("registrations", JSON.stringify(registrations));
}

function getBadgeClass(category) {
  let cat = category.toLowerCase();
  if (cat.includes("workshop")) return "badge-workshop";
  if (cat.includes("hackathon")) return "badge-hackathon";
  if (cat.includes("competition")) return "badge-competition";
  if (cat.includes("seminar")) return "badge-seminar";
  return "badge-other";
}

function checkLogin() {
  let isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
  let loginScreen = document.getElementById("loginScreen");
  let dashboard = document.getElementById("adminDashboard");

  if (isLoggedIn) {
    if (loginScreen) loginScreen.style.display = "none";
    if (dashboard) dashboard.style.display = "flex";
    initDashboard();
  } else {
    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
  }
}

function switchAdminTab(tabName) {
  let navItems = document.querySelectorAll(".admin-nav-item[data-tab]");
  navItems.forEach(function(item) {
    if (item.getAttribute("data-tab") === tabName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  let sections = document.querySelectorAll(".admin-tab-section");
  sections.forEach(function(sec) {
    if (sec.id === "tab-" + tabName) {
      sec.style.display = "block";
    } else {
      sec.style.display = "none";
    }
  });

  let title = document.getElementById("adminPageTitle");
  if (title) {
    if (tabName === "dashboard") title.textContent = "Dashboard Overview";
    if (tabName === "events") title.textContent = "Manage Events";
    if (tabName === "registrations") title.textContent = "Student Registrations";
  }

  let sidebar = document.getElementById("adminSidebar");
  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (tabName === "dashboard") {
    renderStats();
    renderRecentEvents();
  } else if (tabName === "events") {
    renderEventsTable();
  } else if (tabName === "registrations") {
    renderRegistrationsDropdown();
    renderRegistrationsTable();
  }
}

function renderStats() {
  let events = getEvents();
  let registrations = getRegistrations();

  let totalEvents = document.getElementById("statTotalEvents");
  let upcomingEvents = document.getElementById("statUpcomingEvents");
  let totalRegs = document.getElementById("statTotalRegistrations");

  if (totalEvents) totalEvents.textContent = events.length;
  if (upcomingEvents) upcomingEvents.textContent = events.length;
  if (totalRegs) totalRegs.textContent = registrations.length;
}

function renderRecentEvents() {
  let events = getEvents();
  let tableBody = document.getElementById("recentEventsTableBody");
  if (!tableBody) return;

  if (events.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding: 20px;'>No events yet.</td></tr>";
    return;
  }

  let list = events.slice(0, 5);
  let html = "";
  list.forEach(function(event) {
    let featuredTag = event.featured ? " <span class='badge badge-hackathon'>⭐ Featured</span>" : "";
    html += `
      <tr>
        <td><strong>${event.name}</strong>${featuredTag}</td>
        <td><span class="badge ${getBadgeClass(event.category)}">${event.category}</span></td>
        <td>${event.date}</td>
        <td>${event.venue}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openEditModal('${event.id}')">Edit</button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

function renderEventsTable() {
  let events = getEvents();
  let tableBody = document.getElementById("eventsTableBody");
  if (!tableBody) return;

  if (events.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding: 20px;'>No events found. Click Add Event to create one.</td></tr>";
    return;
  }

  let html = "";
  events.forEach(function(event) {
    let featuredTag = event.featured ? " <span class='badge badge-hackathon'>⭐ Featured</span>" : "";
    html += `
      <tr>
        <td><strong>${event.name}</strong>${featuredTag}</td>
        <td><span class="badge ${getBadgeClass(event.category)}">${event.category}</span></td>
        <td>${event.date}</td>
        <td>${event.time}</td>
        <td>${event.venue}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" onclick="openEditModal('${event.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

function openAddModal() {
  let form = document.getElementById("eventForm");
  let modal = document.getElementById("eventModal");
  let title = document.getElementById("eventModalTitle");
  let idInput = document.getElementById("eventId");
  let alertBox = document.getElementById("eventFormAlert");

  if (form) form.reset();
  if (idInput) idInput.value = "";
  if (title) title.textContent = "Add New Event";
  if (alertBox) alertBox.style.display = "none";
  if (modal) modal.classList.add("open");
}

function openEditModal(id) {
  let events = getEvents();
  let event = events.find(function(e) {
    return e.id === id;
  });
  if (!event) return;

  document.getElementById("eventId").value = event.id;
  document.getElementById("eventName").value = event.name;
  document.getElementById("eventCategory").value = event.category;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time;
  document.getElementById("eventVenue").value = event.venue;
  document.getElementById("eventDescription").value = event.description;
  document.getElementById("eventImage").value = event.image || "";
  document.getElementById("eventFeatured").checked = !!event.featured;

  let title = document.getElementById("eventModalTitle");
  let alertBox = document.getElementById("eventFormAlert");
  let modal = document.getElementById("eventModal");

  if (title) title.textContent = "Edit Event";
  if (alertBox) alertBox.style.display = "none";
  if (modal) modal.classList.add("open");
}

function closeEventModal() {
  let modal = document.getElementById("eventModal");
  let form = document.getElementById("eventForm");
  if (modal) modal.classList.remove("open");
  if (form) form.reset();
}

function deleteEvent(id) {
  let events = getEvents();
  let event = events.find(function(e) {
    return e.id === id;
  });
  if (!event) return;

  let confirmDelete = confirm("Are you sure you want to delete this event: " + event.name + "?");
  if (confirmDelete) {
    let updated = events.filter(function(e) {
      return e.id !== id;
    });
    saveEvents(updated);
    renderEventsTable();
    renderStats();
  }
}

function renderRegistrationsDropdown() {
  let select = document.getElementById("filterRegEventSelect");
  if (!select) return;

  let events = getEvents();
  let currentVal = select.value;
  let html = '<option value="All">All Events</option>';

  events.forEach(function(event) {
    html += `<option value="${event.id}">${event.name}</option>`;
  });

  select.innerHTML = html;
  if (currentVal) {
    select.value = currentVal;
  }
}

function renderRegistrationsTable() {
  let registrations = getRegistrations();
  let tableBody = document.getElementById("registrationsTableBody");
  if (!tableBody) return;

  let searchInput = document.getElementById("searchRegInput");
  let filterSelect = document.getElementById("filterRegEventSelect");

  let query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  let eventFilter = filterSelect ? filterSelect.value : "All";

  let filtered = registrations.filter(function(reg) {
    let matchEvent = eventFilter === "All" || reg.eventId === eventFilter;
    let matchQuery = query === "" ||
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.collegeYear.toLowerCase().includes(query) ||
      (reg.phone && reg.phone.includes(query)) ||
      (reg.eventName && reg.eventName.toLowerCase().includes(query));

    return matchEvent && matchQuery;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding: 20px;'>No registrations found.</td></tr>";
    return;
  }

  let html = "";
  filtered.forEach(function(reg) {
    html += `
      <tr>
        <td><strong>${reg.name}</strong></td>
        <td><a href="mailto:${reg.email}">${reg.email}</a></td>
        <td>${reg.collegeYear}</td>
        <td>${reg.phone || "N/A"}</td>
        <td><span class="badge badge-workshop">${reg.eventName}</span></td>
        <td style="color: #64748b; font-size: 13px;">${reg.registeredAt}</td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

function initDashboard() {
  renderStats();
  renderRecentEvents();
  renderEventsTable();
  renderRegistrationsDropdown();
  renderRegistrationsTable();
}

document.addEventListener("DOMContentLoaded", function() {
  checkLogin();

  let loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      let email = document.getElementById("loginEmail").value.trim();
      let pass = document.getElementById("loginPassword").value.trim();
      let alertBox = document.getElementById("loginAlert");

      if (email === adminEmail && pass === adminPass) {
        sessionStorage.setItem("adminLoggedIn", "true");
        if (alertBox) alertBox.style.display = "none";
        checkLogin();
      } else {
        if (alertBox) {
          alertBox.textContent = "Invalid email or password. Use admin@club.com / admin123";
          alertBox.style.display = "block";
        }
      }
    });
  }

  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault();
      sessionStorage.removeItem("adminLoggedIn");
      checkLogin();
    });
  }

  let navItems = document.querySelectorAll(".admin-nav-item[data-tab]");
  navItems.forEach(function(item) {
    item.addEventListener("click", function(e) {
      e.preventDefault();
      let tab = item.getAttribute("data-tab");
      if (tab) switchAdminTab(tab);
    });
  });

  let mobileToggle = document.getElementById("adminMobileToggle");
  let sidebar = document.getElementById("adminSidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", function() {
      sidebar.classList.toggle("open");
    });
  }

  let btnAdd = document.getElementById("btnOpenAddEvent");
  if (btnAdd) btnAdd.addEventListener("click", openAddModal);

  let closeBtn = document.getElementById("eventModalClose");
  let cancelBtn = document.getElementById("eventModalCancel");
  let modal = document.getElementById("eventModal");

  if (closeBtn) closeBtn.addEventListener("click", closeEventModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeEventModal);

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeEventModal();
    });
  }

  let eventForm = document.getElementById("eventForm");
  if (eventForm) {
    eventForm.addEventListener("submit", function(e) {
      e.preventDefault();

      let name = document.getElementById("eventName").value.trim();
      let category = document.getElementById("eventCategory").value.trim();
      let date = document.getElementById("eventDate").value.trim();
      let time = document.getElementById("eventTime").value.trim();
      let venue = document.getElementById("eventVenue").value.trim();
      let description = document.getElementById("eventDescription").value.trim();
      let image = document.getElementById("eventImage").value.trim();
      let featured = document.getElementById("eventFeatured").checked;
      let alertBox = document.getElementById("eventFormAlert");

      if (!name || !category || !date || !time || !venue || !description) {
        if (alertBox) {
          alertBox.textContent = "Please fill in all required fields.";
          alertBox.className = "alert alert-danger";
          alertBox.style.display = "block";
        }
        return;
      }

      let events = getEvents();
      let editId = document.getElementById("eventId").value.trim();

      if (featured) {
        events.forEach(function(ev) {
          ev.featured = false;
        });
      }

      if (editId) {
        let index = events.findIndex(function(e) {
          return e.id === editId;
        });
        if (index !== -1) {
          events[index].name = name;
          events[index].category = category;
          events[index].date = date;
          events[index].time = time;
          events[index].venue = venue;
          events[index].description = description;
          events[index].image = image;
          events[index].featured = featured;
        }
      } else {
        let newEvent = {
          id: "event_" + Date.now(),
          name: name,
          category: category,
          date: date,
          time: time,
          venue: venue,
          description: description,
          image: image,
          featured: featured
        };
        events.unshift(newEvent);
      }

      saveEvents(events);
      closeEventModal();
      renderEventsTable();
      renderStats();
    });
  }

  let searchReg = document.getElementById("searchRegInput");
  if (searchReg) {
    searchReg.addEventListener("input", renderRegistrationsTable);
  }

  let filterReg = document.getElementById("filterRegEventSelect");
  if (filterReg) {
    filterReg.addEventListener("change", renderRegistrationsTable);
  }
});
