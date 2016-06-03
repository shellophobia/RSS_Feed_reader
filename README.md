#RSS FEED READER

The Feed Reader fetches data from reddit.com and renders the posts on the index page. Its built on node server to fetch data from backend and passes on the xml data to the view. The JS on the front end parses the xml and outputs the result on the view.

You need to have nodeJS and npm installed on your system.

After installing these two follow the following steps.

1. Run "npm install"
2. Run the command "node server" to start the node server.
3. Hit the url "http://localhost:8080" on the browser and we are done.

##Sort Strings
Now there's another route available in this server with url "http://localhost:8080/sortString". I have implemented the sort string logic there. You can just enter the strings in the input field and sort them according to length.
