# MMM-TwitterLists
A Magic Mirror Module to display tweets from twitter lists. [Twitter lists](https://help.twitter.com/en/using-twitter/twitter-lists) allow you to organize tweets based on a group of users, topic or interest. This module will display the most recent tweets from a specified twiiter list.

## Installation
```
git clone https://github.com/mmtsweng/MMM-TwitterLists
cd MMM-TwitterLists
npm install --production
```

## Twitter API Bearer Token
Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/petition/essential/basic-info). Create a Project, and an associate App during the onboarding process. Twitter will provide a set of credentials that you will use to authenicate requests to the v2 API. Do not lose these credentials.

MMM-TwitterLists only requires the "Bearer Token" as it does not require access to API endpoints that require higher authentication. You can test that your authentication setup is correct by running the following command, replacing the ListID and BearerToken with your values. 

`curl https://api.twitter.com/2/lists/{ListID}/tweets -H "Authorization: Bearer {BearerToken}"`

**_NOTE:_** To retrieve the listID, log on to twitter.com, and click on "Lists" in the navigation menu. Create or select a list, and the ID shows up in the URL: `https://twitter.com/i/lists/{ListID}

