# GistBadges

The goal of this project is to allow GitHub users to easily issue badges hosted
by GitHub Gist. 

And example for a badge hosted in GitHub Gist can be found here: 
https://gist.github.com/finnp/887146a17629d8d15270

I think the reason why GitHub Gist is very good for this is that it is a good 
compromise between easy to issue with also having a meaningful assertion as well
as a somewhat guarantee that it will work for sometime. The assertion would basically
only break when the user changes it name on GitHub or GitHub changes their interface.

It should work something like this:
* Logging in with GitHub
* Uploading image and add Badge data and receiver
* Then the app automatically creates a gist with the appropriate data
* The Issuer gets a link to give it to the receiver
* The link allows the User to add the link to the Back Pack
* Win