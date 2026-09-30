let activeCategory = "All";
let currentSearch = "";
let selectedEvent = null;

function getEvents() {
  let data = localStorage.getItem("events") || localStorage.getItem("clubEvents");
  if (!data) {
    let sampleEvents = [
      {
        id: "1",
        name: "Web Development Workshop",
        category: "Workshop",
        date: "12 October 2026",
        time: "10:00 AM",
        venue: "ABES Engineering College",
        description: "Learn the fundamentals of modern web development using HTML, CSS, and JavaScript with hands-on practice.",
        featured: true
      },
      {
        id: "2",
        name: "AI/ML Bootcamp",
        category: "Workshop",
        date: "18 October 2026",
        time: "2:00 PM",
        venue: "Seminar Hall",
        description: "An interactive hands-on bootcamp introducing core Machine Learning principles, Python, and neural networks.",
        featured: false
      },
      {
        id: "3",
        name: "College Hackathon",
        category: "Hackathon",
        date: "26 October 2026",
        time: "9:00 AM",
        venue: "Innovation Lab",
        description: "A 24-hour sprint bringing student teams together to build real-world software and hardware prototypes.",
        featured: false
      },
      {
        id: "4",
        name: "Tech Talk: Future of AI",
        category: "Seminar",
        date: "05 November 2026",
        time: "11:30 AM",
        venue: "Auditorium 1",
        description: "An inspiring keynote session featuring industry tech leaders discussing the evolution of AI and careers.",
        featured: false
      },
      {
        id: "5",
        name: "UI/UX Design Session",
        category: "Workshop",
        date: "15 November 2026",
        time: "3:00 PM",
        venue: "Computer Lab 3",
        description: "Master practical wireframing, color psychology, and clean design thinking for digital products.",
        featured: false
      }
    ];
    localStorage.setItem("events", JSON.stringify(sampleEvents));
    return sampleEvents;
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

function switchSection(sectionId) {
  let navLinks = document.querySelectorAll(".nav-link[data-section]");
  navLinks.forEach(function(link) {
    if (link.getAttribute("data-section") === sectionId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  let sections = document.querySelectorAll(".content-section");
  sections.forEach(function(sec) {
    if (sec.id === sectionId + "-section") {
      sec.style.display = "block";
    } else {
      sec.style.display = "none";
    }
  });

  let navMenu = document.getElementById("navMenu");
  if (navMenu) {
    navMenu.classList.remove("open");
  }

  window.scrollTo(0, 0);

  if (sectionId === "home") {
    renderHome();
  } else if (sectionId === "events") {
    renderEvents();
  } else if (sectionId === "registrations") {
    renderRegistrations();
  }
}

function renderHome() {
  let events = getEvents();
  let featuredContainer = document.getElementById("featuredEventContainer");
  let upcomingGrid = document.getElementById("upcomingEventsGrid");

  if (events.length === 0) {
    if (featuredContainer) {
      featuredContainer.innerHTML = "<div class='empty-state'><h3 class='empty-title'>No Events Available</h3></div>";
    }
    if (upcomingGrid) {
      upcomingGrid.innerHTML = "";
    }
    return;
  }

  let featured = events.find(function(e) {
    return e.featured === true;
  });

  if (!featured) {
    featured = events[0];
  }

  if (featuredContainer && featured) {
    featuredContainer.innerHTML = `
      <div class="featured-card">
        <span class="featured-badge-ribbon">⭐ Featured Spotlight</span>
        <div class="featured-content-grid">
          <div class="featured-info">
            <span class="badge ${getBadgeClass(featured.category)}">${featured.category}</span>
            <h3 class="featured-title">${featured.name}</h3>
            <div class="featured-meta">
              <span>📅 ${featured.date}</span>
              <span>🕐 ${featured.time}</span>
              <span>📍 ${featured.venue}</span>
            </div>
            <p class="featured-desc">${featured.description}</p>
          </div>
          <div>
            <button class="btn btn-primary" onclick="openModal('${featured.id}')">
              Register Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (upcomingGrid) {
    let list = events.slice(0, 3);
    let html = "";
    list.forEach(function(event) {
      html += createEventCard(event);
    });
    upcomingGrid.innerHTML = html;
  }
}

function createEventCard(event) {
  return `
    <div class="event-card">
      <div>
        <div class="event-card-header">
          <h4 class="event-name">${event.name}</h4>
          <span class="badge ${getBadgeClass(event.category)}">${event.category}</span>
        </div>
        <div class="event-meta-list">
          <div>📅 <strong>Date:</strong> ${event.date}</div>
          <div>🕐 <strong>Time:</strong> ${event.time}</div>
          <div>📍 <strong>Venue:</strong> ${event.venue}</div>
        </div>
        <p class="event-card-desc">${event.description}</p>
      </div>
      <div class="event-card-footer">
        <span style="font-size: 12px; color: #64748b;">Open Registration</span>
        <button class="btn btn-primary btn-sm" onclick="openModal('${event.id}')">
          Register Now
        </button>
      </div>
    </div>
  `;
}

function renderEvents() {
  let events = getEvents();
  let grid = document.getElementById("exploreEventsGrid");
  let emptyState = document.getElementById("noEventsState");

  let filtered = events.filter(function(event) {
    let matchCat = activeCategory === "All" || event.category.toLowerCase() === activeCategory.toLowerCase();
    let matchSearch = currentSearch === "" ||
      event.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      event.venue.toLowerCase().includes(currentSearch.toLowerCase()) ||
      event.description.toLowerCase().includes(currentSearch.toLowerCase());

    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    if (grid) grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
  } else {
    if (emptyState) emptyState.style.display = "none";
    let html = "";
    filtered.forEach(function(event) {
      html += createEventCard(event);
    });
    if (grid) grid.innerHTML = html;
  }
}

function openModal(eventId) {
  let events = getEvents();
  let event = events.find(function(e) {
    return e.id === eventId;
  });

  if (!event) {
    alert("Event not found");
    return;
  }

  selectedEvent = event;

  let modalName = document.getElementById("modalEventName");
  let modalMeta = document.getElementById("modalEventMeta");
  let alertBox = document.getElementById("regAlert");
  let modal = document.getElementById("registrationModal");
  let emailInput = document.getElementById("regEmail");

  if (modalName) modalName.textContent = event.name;
  if (modalMeta) modalMeta.textContent = "📅 " + event.date + " | 🕐 " + event.time + " | 📍 " + event.venue;

  let savedEmail = localStorage.getItem("userEmail") || localStorage.getItem("clubUserEmail");
  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }

  if (alertBox) alertBox.style.display = "none";
  if (modal) modal.classList.add("open");
}

function closeModal() {
  let modal = document.getElementById("registrationModal");
  let form = document.getElementById("registrationForm");
  let alertBox = document.getElementById("regAlert");

  if (modal) modal.classList.remove("open");
  if (form) form.reset();
  if (alertBox) alertBox.style.display = "none";
  selectedEvent = null;
}

function renderRegistrations() {
  let registrations = getRegistrations();
  let emailInput = document.getElementById("userEmailInput");
  let list = document.getElementById("myRegistrationsList");
  let emptyState = document.getElementById("emptyRegistrationsState");
  let label = document.getElementById("activeEmailLabel");

  let savedEmail = localStorage.getItem("userEmail") || localStorage.getItem("clubUserEmail") || "";
  if (emailInput && !emailInput.value && savedEmail) {
    emailInput.value = savedEmail;
  }

  let email = emailInput ? emailInput.value.trim().toLowerCase() : savedEmail.toLowerCase();

  if (label) {
    label.textContent = email ? "Showing registrations for: " + email : "Enter your student email to look up your registered events:";
  }

  if (!email) {
    if (list) list.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  let userRegs = registrations.filter(function(r) {
    return r.email.toLowerCase() === email;
  });

  if (userRegs.length === 0) {
    if (list) list.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
  } else {
    if (emptyState) emptyState.style.display = "none";
    let html = "";
    userRegs.forEach(function(reg) {
      html += `
        <div class="registration-card">
          <div class="reg-info">
            <h4 class="reg-event-title">${reg.eventName}</h4>
            <div class="reg-details">
              <span>📅 <strong>Date:</strong> ${reg.eventDate || "N/A"}</span>
              <span>🕐 <strong>Time:</strong> ${reg.eventTime || "N/A"}</span>
              <span>📍 <strong>Venue:</strong> ${reg.eventVenue || "N/A"}</span>
              <span>📝 <strong>Registered on:</strong> ${reg.registeredAt}</span>
            </div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
              Student: <strong>${reg.name}</strong> (${reg.collegeYear})
            </div>
          </div>
          <div>
            <span class="reg-status-badge">✓ Registered</span>
          </div>
        </div>
      `;
    });
    if (list) list.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  getEvents();
  renderHome();

  let navLinks = document.querySelectorAll(".nav-link[data-section]");
  navLinks.forEach(function(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      let sec = link.getAttribute("data-section");
      if (sec) switchSection(sec);
    });
  });

  let mobileToggle = document.getElementById("mobileNavToggle");
  let navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function() {
      navMenu.classList.toggle("open");
    });
  }

  let btnHero = document.getElementById("btnExploreHero");
  if (btnHero) {
    btnHero.addEventListener("click", function() {
      switchSection("events");
    });
  }

  let btnUpcoming = document.getElementById("btnViewAllUpcoming");
  if (btnUpcoming) {
    btnUpcoming.addEventListener("click", function() {
      switchSection("events");
    });
  }

  let categoryPills = document.getElementById("categoryPills");
  if (categoryPills) {
    categoryPills.addEventListener("click", function(e) {
      if (e.target.classList.contains("category-pill")) {
        document.querySelectorAll(".category-pill").forEach(function(pill) {
          pill.classList.remove("active");
        });
        e.target.classList.add("active");
        activeCategory = e.target.getAttribute("data-category");
        renderEvents();
      }
    });
  }

  let searchInput = document.getElementById("searchEventsInput");
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      currentSearch = e.target.value.trim();
      renderEvents();
    });
  }

  let closeBtn = document.getElementById("modalCloseBtn");
  let cancelBtn = document.getElementById("modalCancelBtn");
  let modal = document.getElementById("registrationModal");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  let form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      if (!selectedEvent) {
        alert("No event selected");
        return;
      }

      let name = document.getElementById("regFullName").value.trim();
      let email = document.getElementById("regEmail").value.trim().toLowerCase();
      let collegeYear = document.getElementById("regCollegeYear").value.trim();
      let phone = document.getElementById("regPhone").value.trim();
      let alertBox = document.getElementById("regAlert");

      if (!name || !email || !collegeYear || !phone) {
        alertBox.textContent = "Please fill in all fields.";
        alertBox.className = "alert alert-danger";
        alertBox.style.display = "block";
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        alertBox.textContent = "Please enter a valid email address.";
        alertBox.className = "alert alert-danger";
        alertBox.style.display = "block";
        return;
      }

      let cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        alertBox.textContent = "Please enter a valid 10-digit phone number.";
        alertBox.className = "alert alert-danger";
        alertBox.style.display = "block";
        return;
      }

      let registrations = getRegistrations();
      let alreadyRegistered = registrations.find(function(r) {
        return r.eventId === selectedEvent.id && r.email.toLowerCase() === email;
      });

      if (alreadyRegistered) {
        alertBox.textContent = "You have already registered for this event.";
        alertBox.className = "alert alert-danger";
        alertBox.style.display = "block";
        return;
      }

      let newReg = {
        id: "reg_" + Date.now(),
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        eventDate: selectedEvent.date,
        eventTime: selectedEvent.time,
        eventVenue: selectedEvent.venue,
        name: name,
        email: email,
        collegeYear: collegeYear,
        phone: phone,
        registeredAt: new Date().toLocaleDateString()
      };

      registrations.push(newReg);
      saveRegistrations(registrations);
      localStorage.setItem("userEmail", email);

      alertBox.textContent = "Registration Successful!";
      alertBox.className = "alert alert-success";
      alertBox.style.display = "block";

      setTimeout(function() {
        closeModal();
        renderRegistrations();
      }, 1500);
    });
  }

  let lookupForm = document.getElementById("lookupForm");
  if (lookupForm) {
    lookupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      let emailInput = document.getElementById("userEmailInput");
      if (emailInput && emailInput.value.trim()) {
        localStorage.setItem("userEmail", emailInput.value.trim());
      }
      renderRegistrations();
    });
  }
});
