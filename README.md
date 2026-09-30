# College Club Event Management Website

A simple and responsive website designed for managing and displaying college club events. It provides an interactive platform where students can discover upcoming events and register for them, while club administrators can easily manage events and view registrations.

## Features

### Student/User Side

- Club introduction and highlights
- Featured spotlight event
- Upcoming events preview
- View all events
- Search events by name, venue, or keywords
- Filter events by category (Workshop, Hackathon, Competition, Seminar, Other)
- Event details including date, time, and venue
- Event registration popup modal
- Registration form validation
- My Registrations section with student email lookup
- Responsive design

### Admin Side

- Admin login
- Dashboard with event and registration statistics
- Add new events
- Edit existing events
- Delete events
- View student registrations
- Search registrations by name, email, college, or event
- Filter registrations by event
- Admin logout

## Tech Stack

- HTML5
- CSS3
- JavaScript
- LocalStorage

No frontend framework or backend server is used. The entire application runs client-side in the browser.

## Project Structure

```text
College-Club-Event-Management/
│
├── index.html
├── admin.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── admin.js
│
└── assets/
    └── images/
```

## How to Run

1. Download or clone the project folder.
2. Open the project folder.
3. Open `index.html` in any web browser.

Using the VS Code Live Server extension is recommended for development, but not required.

## How It Works

- Events are stored in browser LocalStorage.
- Registrations are stored in browser LocalStorage.
- Admins can manage club events from the Admin Portal.
- Students can browse and register for events from the User Portal.
- Both the user side and admin side use the same LocalStorage data to stay in sync.

## Admin Login

Demo credentials to log in to the admin panel (`admin.html`):

- **Email:** `admin@club.com`
- **Password:** `admin123`

## Responsive Design

The website is designed and tested for:

- Desktop
- Tablet
- Mobile

## Purpose

This project was created as a college club development task to demonstrate core frontend development concepts including DOM manipulation, form handling and validation, search/filter functionality, CRUD operations, and browser LocalStorage.

## Future Improvements

- Backend database integration
- Real authentication system
- Email confirmation notifications
- Direct image file uploads for event banners

## Author

Aditya Kumar Sharma
