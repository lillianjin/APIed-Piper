# MP #3: APIed Piper

Implement an API with the following end-points (they would be preceded by something like http://localhost:4000/api/). Your implementation should use Node, Express and Mongoose.

#### Requirements

1. Your database should be on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). It should contain at least 20 users and 100 tasks (about half of which should be completed) (**We provided scripts for you in the database_scripts folder. Read below how to use these scripts**). ***NOTE: Please add "Allow access from anywhere" to your cluster in the IP Whitelist"*** (This is usually not a good practice in real use. Here is just easier for us to grade your mp) 

2. Responses from your API should be a JSON object with two fields. The first field should be named `message` and should contain a human readable String. The second field should be named `data` and should contain the actual JSON response object. For example, here is a valid response:

```javascript
{
    "message": "OK",
    "data": {
        "_id": "55099652e5993a350458b7b7",
        "email": "khandek2@illinois.edu",
        "name": "Sujay Khandekar"
    }
}
```

3. Error responses from your API should also also be a JSON object with a `message` and `data` fields. Messages have to sensible and human readable so that on the client side it can be displayed to the user. Also, it should be independent of the server side technology that you are using. For example, your API should not return an error message directly from Mongoose to the client. For examples of error messages, take a look at the API reference implementation that we have provided.

4. Your API should respond with appropriate [HTTP status codes](http://www.restapitutorial.com/httpstatuscodes.html) for both successful and error responses. You should at least have the following codes: 200 (success), 201 (created), 404 (not found), 500 (server error).

5. You should implement the query string functionality by using the methods provided by Mongoose (as opposed to querying Mongoose for all the results and then doing the filtering/sorting/skipping etc. in your Node/Express application code).

6. Have server side validation for:
    - Users cannot be created (or updated) without a name or email. All other fields that the user did not specify should be set to reasonable values.
    - Multiple users with the same email cannot exist.
    - Tasks cannot be created (or updated) without a name or a deadline. All other fields that the user did not specify should be set to reasonable values.

