# Understanding the App's Stack

Technically speaking, the app can be divided into several parts:

- **Data Layer (JSON)**  
  Each subject's stationery requirements are stored in JSON format (`year9.json`, `year10.json`, etc.).  
  - This allows for easy updates or additions of subjects without touching the core logic.  
  - The JSON files map each subject to a list of items students need.  
  - Both the student side and the **teacher/admin interface** read and write to these JSON files, allowing teachers to manage the items associated with each subject.

- **Logic Layer (Vanilla JavaScript)**  
  The core logic and list generation is handled entirely with vanilla JavaScript.  
  - Handles subject selection rules, including special constraints on electives and languages.  
  - Dynamically generates checkboxes and validates selections in real-time.  
  - Categorizes stationery items into groups like "Paper Products", "Electronics", etc.  
  - Renders the final stationery list as an HTML list with a copy-to-clipboard feature.  
  - The same logic modules are used on the **teacher side** for consistency when editing or adding subjects.

- **DOM & UI Layer (JavaScript + HTML + CSS)**  
  - Dynamically updates the DOM based on user input.  
  - Shows live error messages when selections violate rules.  
  - Uses simple, semantic HTML and CSS for layout and styling.  
  - Includes accessibility considerations, like live status updates for screen readers when copying the list.  
  - The teacher side UI allows editing the stationery items for each subject, which updates the underlying JSON automatically.

- **Configuration & Constants**  
  - Error messages are centralized in a dedicated `errors.js` file.  
  - Must-have subjects per year are defined in `mustHave.js`.  
  - Stationery item categories are defined in `categorisation.js` for consistent grouping and output.

- **Event Handling & Orchestration**  
  - The app listens for change events on year and subject selection elements.  
  - Click events on the “Generate Stationery List” button trigger the final list creation.  
  - Teacher-side events include adding, removing, or editing stationery items for a subject.

- **Extensibility**  
  - Adding new subjects or years only requires updating JSON files and (optionally) the must-have subjects map.  
  - Frontend logic is modularized into `dom.js`, `rules.js`, and `year.js` to keep the code maintainable.  
  - Categorisation and output formatting are separated, making it easy to change the output style or add new stationery categories.  
  - Teacher-side edits automatically propagate to student lists without code changes.

- **No External Dependencies**  
  - The app runs entirely in the browser with vanilla JS, HTML, and CSS.  
  - While there are no backend services required, the app uses **Docker Compose** to provide a local development server.  
    - Browsers block `fetch` requests to local files due to security restrictions; Docker Compose provides a local HTTP server via Nginx.  
    - The `docker-compose.yml` mounts your local `src` folder into the container, so any changes you make appear immediately when you refresh the browser.  
  - While Docker Compose is the officially recommended way to run the app locally, other local HTTP server methods are also acceptable.
