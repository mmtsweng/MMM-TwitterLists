# MMM-TwitterLists

A Magic Mirror Module to display tweets from twitter lists. [Twitter lists](https://help.twitter.com/en/using-twitter/twitter-lists) allow you to organize tweets based on a group of users, topic or interest. This module will display the most recent tweets from a specified twiiter list.

## Installation
```
git clone https://github.com/mmtsweng/MMM-TwitterLists
cd MMM-TwitterLists
npm install node-fetch
npm install --production
```

## Twitter API Bearer Token
This module uses the Twitter OAuth2 Application Only Bearer Token Authentication method. This method limits the use of the Twitter API to requests that do not require an authenticated user, accessing only requests that don't require an authenticated user. However this still enables the capability to retrieve tweets, and is a much simpler method of authentication, as it only requires a Bearer Token in the header of the http GET request. For more information, read the [Twitter Developer Documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0/application-only). 

To generate your own Bearer Token, go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/petition/essential/basic-info). Create a Project, and an associate App during the onboarding process. Twitter will provide a set of credentials that you will use to authenicate requests to the v2 API. Do not lose these credentials.

MMM-TwitterLists only requires the "Bearer Token" as it does not require access to API endpoints that require higher authentication. You can test that your authentication setup is correct by running the following command, replacing the ListID and BearerToken with your values. 

`curl https://api.twitter.com/2/lists/{ListID}/tweets -H "Authorization: Bearer {BearerToken}"`

**_NOTE:_** To retrieve the listID, log on to twitter.com, and click on "Lists" in the navigation menu. Create or select a list, and the ID shows up in the URL: `https://twitter.com/i/lists/{ListID}

## Configuration
A minimal configuration only requires the user Bearer Token and the twitter list ID to render:
```
{
    module: "MMM-TwitterLists",
    header: "Twitter Lists",
    position: "top_center",
    config: {
        twitterListId: "1569757713495920642",
        twitterBearerToken: "{Bearer Token}"
    }
}

## Configuration Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `debug` | `false` | Render extensive debug information to the console to validate functionality |
| `twitterBearerToken` | '' | User's Bearer Token. Treat your bearer token like a password and do not share it |
| `twitterUrl` | `https://api.twitter.com/2/lists/{id}/tweets?&tweet.fields=attachments,author_id,created_at,text& expansions=attachments.media_keys,author_id&media.fields=preview_image_url, type,url&user.fields=profile_image_url&max_results=10` | URL to the twitter GET API. ID is replaced by the twitterListID **Note** the last parameter is max_results, and can be overridden in your configuration file to determine the approximate length of the module |
| 'twitterListId' | `1227596802024771586` | The ID of the twitter list to retrieve and render. Must be public. |
| 'updateInterval' | 5 minutes | *Note* There is a limit of 900 requests per 15 minutes, and 500,000 tweets per month|