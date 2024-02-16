Excalibur Task Cutter
Welcome to Excalibur Task Cutter! This project is a task management application designed to help organize and manage tasks efficiently. This README will guide you through the process of setting up the project locally and exploring its features.

Setup

1. Clone Repository
   Clone the repository from GitHub:

bash
Copy code
git clone https://github.com/vfiliplima/excalibur-task-cutter.git 2. Navigate to Project Folder
Change directory into the project folder:

bash
Copy code
cd excalibur-task-cutter 3. Build Docker Containers
Build the Docker containers using Docker Compose:

bash
Copy code
docker-compose build 4. Run Containers
Run the Docker containers:

bash
Copy code
docker-compose up 5. Run Migrations and Seed Data
Execute Sequelize migrations to set up the database schema:

bash
Copy code
docker exec node-app npx sequelize-cli db:migrate
Seed the database with initial data:

bash
Copy code
docker exec node-app npx sequelize-cli db:seed:all
The seed data will populate the database with entries, including explicit passwords for testing purposes.

Usage with Postman
Login Endpoint: Use Postman to send a POST request to http://localhost:3001/login with the username and password of a technician in the request body. This will authenticate the user and generate a token for subsequent requests.

Create Tasks: Create tasks by sending a POST request to http://localhost:3001/tasks with a request body containing the summary of the task to be created.

Additional Information
Explore the remaining endpoints available for Tasks by visiting http://localhost:3001/api-docs.

Note:
In the scope of this exercise, only documentation, authentication, and tests for tasks were included. Tasks were chosen to showcase what could be implemented throughout the project with authentications and authorization checks, documentation, and thorough testing of routes, controllers, and models.

Feel free to reach out for any questions or assistance! Happy task managing! 🚀📝
