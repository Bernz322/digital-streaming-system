<h1 align="center">ratebox</h1>

<p align="justify">A digital streaming platform that allows users view actors, movies, and review them with up to 5 star rating. It is also a software solution for Digital Streaming System that allows admistrators to manage movies, actors, users, and user movie reviews. It is also a place for many handpicked movies around the world. </p>

![ratebox](./og.png)

## ⚒️ Built with the following technologies:

<ul>
    <li>React - Typescript</li>
    <li>HTML - SCSS</li>
    <li>Mantine UI</li>
    <li>Redux Toolkit</li>
    <li>Loopback 4 + Authentication and Authorization</li>
    <li>MongoDB</li>
</ul>

## ✨ Features

<ul>
    <li>View Movies (Users)</li>
        <ul>
            <li>View movie details such as rating, description and more.</li>
            <li>Search for movies.</li>
            <li>View actors that are part of the movie.</li>
            <li>View admin approved user reviews.</li>
        </ul>
    <li>Give Movie Reviews (Users)</li>
        <ul>
            <li>Submit a review of a movie.</li>
            <li>Requires account login and activation from the admin.</li>
            <li>Created review will be subjected for admin approval.</li>
        </ul>    
    <li>View Actors (Users)</li>
        <ul>
            <li>With actor details such as name, link, etc.</li>
            <li>Search for actors.</li>
            <li>View the movies that the actor is part of.</li>
        </ul>
    <li>A Dashboard for managing movies, actors, reviews, and users. (Admin)</li>
        <ul>
            <li>Perform CRUD operations on all table management.</li>
            <li>Activate/ Deactivate user.</li>
            <li>Approve/ Disapprove movie reviews done by users.</li>
        </ul>   
    <li>The list goes on....</li>    
</ul>

## Requirements

Node.js >= 8.9.0 and a running instance of a MongoDB server is
required for the app to start. The MongoDB is used for storing all data.

## Installation

Do the following to clone and start the project. Install all dependencies, both frontend and backend.

```sh
$ git clone https://github.com/Bernz322/digital-streaming-system.git
$ cd digital-streaming-system
$ cd frontend
$ npm i
$ cd ..
$ cd backend
$ npm i
```

Open two terminals and cd to frontend and backend folders respectively and start them

```sh
$ cd frontend
$ npm start
```

```sh
$ cd backend
$ npm start
```

## Usage

The frontend app will be running at http://localhost:3005 and the backend together with API Explorer will be at http://localhost:3000/explorer/.
