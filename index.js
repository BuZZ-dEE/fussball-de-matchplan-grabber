#!/usr/bin/env node

var jsdom = require('jsdom');


var matchPlan = [];
var teamVsTeam = [];

jsdom.env({
  url: "http://www.fussball.de/ajax.team.next.games/-/team-id/01S7GV1URS000000VS548985VUL18RL3",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (err, window) {
    var $ = window.$;

    // var matchPlan = $("#team-matchplan-table").get(0);

    // $("#team-matchplan-table").each(function() {
    //     console.log($(this).text());
    // });
    
    $("tr.row-headline").each(function() {
        // console.log($(this).text());
        matchPlan.push(parseMatchTime($(this).text()))
    });

    $(".club-name").each(function() {
        // console.log($(this).text());
        teamVsTeam.push($(this).text());
    });

    outputMatchplan();

    // console.log(matchPlan);
    // console.log(teamVsTeam);

    // console.log($(this).text());
    // console.log(this.html);
  }
});

/**
 * Parse the match time.
 * 
 * @param {String} matchTime 
 * @returns {Date} The match date time.
 */
function parseMatchTime(matchTime) {

    /** @type String[] */
    var matchTimeArr = matchTime.split(' ');
    matchTimeArr = [matchTimeArr[1], matchTimeArr[3]];
    var dayMonthYear = matchTimeArr[0].split('.');
    var hourMinutes = matchTimeArr[1].split(':');
    var date = new Date(dayMonthYear[2], parseInt(dayMonthYear[1]) - 1, dayMonthYear[0], hourMinutes[0], hourMinutes[1]);

    // console.log(date.toLocaleString());

    return date;
}

/**
 * Console output of the match plan.
 */
function outputMatchplan() {
    var offset = 0;
    matchPlan.forEach(function(currentValue, index, array) {
        console.log(currentValue.toLocaleString() + ': ' + teamVsTeam[offset] + ' vs ' + teamVsTeam[++offset]);
        offset++;
    });
}