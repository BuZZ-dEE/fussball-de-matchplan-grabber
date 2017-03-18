#!/usr/bin/env node

var commander = require('commander');
var jsdom = require('jsdom');
var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );
var yamlConfig = require('node-yaml-config');


/** @type String[] */
var matchPlanArr = [];
/** @type Matchplan */
var matchPlan;
/** @type String[] */
var teamVsTeam = [];

commander.version(pkg.version)
	.option('-t, --team <team>', 'The team url.')
	.parse(process.argv);

var config = yamlConfig.load(__dirname + '/config.yml');
var team = commander.team || config.url.next_games + config.team.id;

jsdom.env({
  url: team,
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (err, window) {
    var $ = window.$;

    $("tr.row-headline").each(function() {
        matchPlanArr.push(parseMatchTime($(this).text()))
    });

    $(".club-name").each(function() {
        teamVsTeam.push($(this).text());
    });

    createMatchplan();
    outputMatchplan();
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

    return date;
}

/**
 * Create the match plan.
 */
function createMatchplan() {
    var offset = 0;
    matchPlan = new Matchplan();
    matchPlanArr.forEach(function(currentValue, index, array) {
        matchplanEntry = new MatchplanEntry(currentValue, null, teamVsTeam[offset], teamVsTeam[++offset]);
        matchPlan.addEntry(matchplanEntry);
        offset++;
    });
}

/**
 * Console output of the match plan.
 */
function outputMatchplan() {
    matchPlan.forEach(function(currentValue, index, array) {
        console.log(currentValue.toString());
    });
}

var Matchplan = (function() {
    /**
     * @constructor
     */
    function Matchplan() { };

    Matchplan.prototype = new Array;
    Matchplan.prototype.addEntry = Matchplan.prototype.push;

    return Matchplan;
})();

/**
 * @typedef {MatchplanEntry}
 */
var MatchplanEntry = (function() {
    /**
     * @constructor
     * @param {String} date - The date time of the match.
     * @param {String} location - The location where the game takes place.
     * @param {String} hometeam - The name of the home team.
     * @param {String} visitingteam - The name of the visiting team.
     * @param {String} description - A match description.
     * @param {String} url - An URL to match information.
     */
    function MatchplanEntry(date, location, hometeam, visitingteam, description, url) {
        this.date = date;
        this.location = location;
        this.hometeam = hometeam;
        this.visitingteam = visitingteam;
        this.description = description;
        this.url = url;
    };

    MatchplanEntry.prototype.getDate = function() {
        return this.date;
    };

    MatchplanEntry.prototype.setDate = function(date) {
        this.date = date;
    };

    MatchplanEntry.prototype.getLocation = function() {
        return this.location;
    };

    MatchplanEntry.prototype.setLocation = function(location) {
        this.location = location;
    };

    MatchplanEntry.prototype.getHomeTeam = function() {
        return this.hometeam;
    };

    MatchplanEntry.prototype.setHomeTeam = function(hometeam) {
        this.hometeam = hometeam;
    };

    MatchplanEntry.prototype.getVisitingTeam = function() {
        return this.visitingteam;
    };

    MatchplanEntry.prototype.setVisitingTeam = function(visitingteam) {
        this.visitingteam = visitingteam;
    };

    MatchplanEntry.prototype.getURL = function() {
        return this.url;
    };

    MatchplanEntry.prototype.setURL = function(url) {
        this.url = url;
    };

    MatchplanEntry.prototype.getDescription = function() {
        return this.description;
    };

    MatchplanEntry.prototype.setDescription = function(description) {
        this.description = description;
    };

    /**
     * Get the match plan entry in string respresentation.
     *
     * e.g. "19.3.2017, 11:00:00: Victoria Osternburg vs GVO Oldenburg IV"
     */
    MatchplanEntry.prototype.toString = function() {
        return this.date.toLocaleString() + ': ' + this.hometeam + ' vs ' + this.visitingteam;
    };

    return MatchplanEntry;
})();
