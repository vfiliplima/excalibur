# Excalibur Task Cutter

## Overview

Excalibur Task Cutter is a project aimed at showcasing task management functionality, including authentication, authorization, documentation, and testing.

## Setup

To set up the project locally, follow these steps:

1. **Clone the repository**: 
    ```
    git clone https://github.com/vfiliplima/excalibur-task-cutter.git
    ```

2. **Navigate to the project folder**:
    ```
    cd excalibur-task-cutter
    ```

3. **Build the Docker containers**:
    ```
    docker-compose build
    ```

4. **Run the containers**:
    ```
    docker-compose up
    ```

5. **Apply database migrations**:
    ```
    docker exec node-app npx sequelize-cli db:migrate
    ```

6. **Seed the database with initial data**:
    ```
    docker exec node-app npx sequelize-cli db:seed:all
    ```

## Usage

Once the project is set up, you can interact with it using Postman or any other HTTP client. Here are some steps to get started:

1. **Login**: Send a POST request to `localhost:3001/login` with the username and password of a technician in the request body.

2. **Create Tasks**: Send a POST request to `localhost:3001/tasks` with a request body containing the summary of the task to create.

3. **Explore Endpoints**: Explore the remaining endpoints available for tasks by visiting `localhost:3001/api-docs`.

## Notes

- The seeds will populate the database with some entries, including explicit passwords for testing purposes.
- Only documentation, authentication, and tests for tasks were included in this project's scope.
-   (Tasks were chosen to showcase what could be implemented throughout the project with authentications and authorization checks, documentation, and thorough testing of routes, controllers, and models.)

