# Usage

The app will have no data initially. Please populate it with the given JSON files by importing them in MongoDB.

To populate the DB:

<li>I recommend you to download <a href='https://www.mongodb.com/try/download/compass'>MongoDB compass</a> for easy importing of JSON files.</li>
<li>Create database in MongoDB with the name 'digital-streaming-system'.</li>
<li>Create six (6) total collections with the name similar to the provided JSON files (Actors, Movies, User, etc.).</li>
<li>For every collection, a dropdown button named 'Add Data' is present inside MongoDB Compass. Click it and click 'Import File' and select the JSON file corresponding to the correct collection name (Actors.json is for Actors collection and so on).</li>
<li>If you decide to not import anything, the first user to be registered will be automatically set as the root admin (cannot be edited nor deleted). </li>
<li>If you decide to import all JSON files, the root admin password is 'root1234'. For the other users, the password will be the combination of 'firstName + 1234' (user1234 or faye1234)</li>
<li>You can also import the Actors, Movies and Moviecast JSON only.</li>
