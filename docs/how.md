# How the App Works

The app helps students generate a stationery list based on their selected subjects. It works in several layers:

1. **Data Loading**  
   - Stationery requirements for each subject are stored in JSON files (`year9.json`, `year10.json`, etc.).  
   - When a user selects a year, the app fetches the corresponding JSON file to know which items belong to each subject.

2. **Subject Selection**  
   - The app dynamically generates checkboxes for all subjects available for the selected year.  
   - Certain subjects are marked as **mandatory** based on the year (e.g., core subjects like English and Maths).  
   - Year 10 students have special rules limiting elective subjects and foreign languages.

3. **Validation Rules**  
   - Real-time validation ensures users cannot select invalid combinations of subjects or languages.  
   - Error messages appear immediately if rules are broken, preventing invalid lists from being generated.

4. **Stationery Categorisation**  
   - Once subjects are selected, the app combines all required items and sorts them into categories like:
     - Paper Products  
     - Electronics  
     - Writing Tools  
     - Art Supplies  
     - Miscellaneous  

5. **Output & Copying**  
   - The final list is displayed as an HTML list on the page.  
   - A **copy button** allows students to copy the plain text version of the list to their clipboard for printing or sharing.

6. **Teacher Side**  
   - Teachers can log in to **edit the stationery items associated with each subject**.  
   - This interface allows updating existing subjects or adding new items, which automatically updates the JSON files used by the student side.

7. **Extensibility & Maintenance**  
   - New subjects, years, or stationery items can be added by updating JSON files.  
   - Core logic is modularized into separate JavaScript files (`dom.js`, `rules.js`, `year.js`, `categorisation.js`) for maintainability.  
   - Docker is used locally to serve JSON files since browsers block direct `file://` fetch requests.

In short, the app dynamically builds a validated, categorized stationery list based on the student's selections, while enforcing school rules and making it easy to copy or export the final list. Teachers can also manage the underlying data through the admin interface.
