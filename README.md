# Web Scraper Project

This project is a multi-level web scraping tool built using Node.js, Express, MongoDB, and React (with TypeScript). It allows users to input a URL, scrape the title of the webpage, store the data, and display it in a user-friendly interface. The project progresses through various levels, introducing additional functionality such as error handling, database storage, and deployment automation.

## Levels of the Project

### Level 1: Basic Web Scraper

In the first level, a simple web scraper is built using Node.js. The scraper collects the title from a single webpage and prints it to the console. The goal of this level is to set up basic web scraping functionality, focusing on retrieving information from a webpage.

- **Technologies Used:**
  - Node.js
  - Axios (for making HTTP requests)
  - Cheerio (for parsing and extracting data from the HTML)

---

### Level 2: Enhancing the Scraper with MongoDB

At this level, the basic web scraper is enhanced to store the collected data in a MongoDB database. Along with scraping and printing the data, the application now handles common errors like 404 (page not found) gracefully. This introduces a basic form of data persistence, allowing scraped results to be saved for future reference.

- **Additional Features:**
  - Error handling (e.g., 404, invalid URLs)
  - MongoDB integration for storing scraped data

- **Technologies Used:**
  - MongoDB (for database storage)
  - Mongoose (for managing MongoDB operations)

---

### Level 3: Full-Stack Web Scraping Application

In this level, the project evolves into a full-stack application. Users can now input a URL through a frontend interface, and the application scrapes the data and displays the result on a web page. The data is stored in MongoDB, and the frontend interacts with the backend API to retrieve and display the scraped information.

- **Frontend:**
  - Users can input URLs through a form
  - Scraped results are displayed in a styled table
  - Responsive design using Tailwind CSS

- **Backend:**
  - The Express.js server accepts URL inputs from the frontend
  - The scraper fetches and stores data in MongoDB
  - API endpoints handle the interaction between frontend and backend

- **Technologies Used:**
  - React (with TypeScript) for the frontend
  - Tailwind CSS for styling
  - Express.js for backend API
  - MongoDB for data storage

---

### Level 4: CI/CD and Deployment

The final level focuses on automating the deployment process. A Continuous Integration/Continuous Deployment (CI/CD) pipeline is set up to automatically deploy the application to a server whenever changes are pushed to the repository. Additionally, basic logging and monitoring are added to track the health and performance of the application.

- **Additional Features:**
  - CI/CD pipeline for automatic deployment
  - Logging and monitoring for application performance
  - Optional: Notifications for deployment status

- **Technologies Used:**
  - GitHub Actions for CI/CD
  - Deployment tools (e.g., Heroku, Vercel, or DigitalOcean)
  - Monitoring services (e.g., LogRocket, Sentry)

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/TracyK10/web-scraper.git
   cd web-scraper
   ```

2. Install dependencies for the backend:
   ```bash
   cd server
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd client
   npm install
   ```

4. Set up MongoDB and add the connection URI to your `.env` file in the `server` directory:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/web-scraper
   ```

5. Run the backend:
   ```bash
   cd server
   npm start
   ```

6. Run the frontend:
   ```bash
   cd client
   npm start
   ```

---

## Usage

1. Open the application in your browser.
2. Enter a URL into the input field and submit.
3. The application will scrape the title of the webpage and display it in a table format.
4. The scraped data will be stored in MongoDB for future use.

---

## Future Enhancements

- Add more detailed logging and error handling.
- Extend scraping to extract other metadata (e.g., meta description, keywords).
- Add user authentication to manage personal scraping data.
