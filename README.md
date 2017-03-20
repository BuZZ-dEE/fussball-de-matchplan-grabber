# fussball-de-matchplan-grabber
A NodeJS module for match plan grabbing from [fussball.de][0]

# Installation
    npm install fussball-de-matchplan-grabber --save

# Usage
    var fussballDeMatchplanGrabber = require('fussball-de-matchplan-grabber');
    fussballDeMatchplanGrabber.parseMatchplan(URL_TO_TEAM_NEXT_GAMES, callback);

    URL_TO_TEAM_NEXT_GAMES = 'http://www.fussball.de/ajax.team.next.games/-/team-id/01S687UBF8000000VS548985VUL18RL3'
    callback - Is called with the resulting match plan.

[0]: http://www.fussball.de/
