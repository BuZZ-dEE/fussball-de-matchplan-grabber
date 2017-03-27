#!/usr/bin/env node

var jsdom = require('jsdom');
const URL = require('url').URL;

/**
 * Parse the match plan.
 *
 * @param {String} team - The next matches team URL.
 * @param {function} callback - The function to call back with the match plan.
 */
function parseMatchplan(team, callback) {
	/** @type {String[]} */
	var matchPlanArr = [],
	/** @type {String[]} */
		teamVsTeam = [],
	/** @type {Matchplan} */
		matchPlan,
    /** @type {URL[]} */
        matchDetails = [];


	jsdom.env({
	  url: team,
	  scripts: ["http://code.jquery.com/jquery.js"],
	  done: function (err, window) {
	    var $ = window.$;

	    $("tr.row-headline").each(function() {
	        matchPlanArr.push(parseMatchTime($(this).text()));
	    });

	    $(".club-name").each(function() {
	        teamVsTeam.push($(this).text());
	    });

        $("td.column-detail a").each(function(index, element) {
            matchDetails.push(new URL(element.href));
        });

	    matchPlan = createMatchplan(matchPlanArr, teamVsTeam, matchDetails);
		matchPlan.output();
		callback(matchPlan);
	  }
	});
}

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
 *
 * @param {String[]} matchPlanArr
 * @param {String[]} teamVsTeam
 * @param {URL[]} matchDetails
 * @returns {Matchplan}
 */
function createMatchplan(matchPlanArr, teamVsTeam, matchDetails) {
    var offset = 0;
    var matchPlan = new Matchplan();
    matchPlanArr.forEach(function(currentValue, index, array) {
        matchplanEntry = new MatchplanEntry(currentValue, null, teamVsTeam[offset], teamVsTeam[++offset], null, matchDetails[index]);
        matchPlan.addEntry(matchplanEntry);
        offset++;
    });
		return matchPlan;
}

/**
 * A match plan is an array of match plan entries.
 *
 * @see {@link MatchplanEntry}
 * @typedef {Object} Matchplan
 *
 * @returns {Matchplan}
 */
var Matchplan = (function() {
    /**
     * @constructor
     */
    function Matchplan() { }

    Matchplan.prototype = new Array;
		/**
		 * Add match plan entry.
		 *
		 * @param {MatchplanEntry} matchplanEntry
		 */
    Matchplan.prototype.addEntry = Matchplan.prototype.push;
		/**
		 * Console output of the match plan.
		 */
		Matchplan.prototype.output = function () {
			this.forEach(function(currentValue, index, array) {
					console.log(currentValue.toString());
			});
		};

    return Matchplan;
})();

/**
 * Holds relevant information of a match plan entry.
 *
 * @typedef {Object} MatchplanEntry
 * @returns {MatchplanEntry}
 */
var MatchplanEntry = (function() {
    /**
     * @constructor
     * @param {String} date - The date time of the match.
     * @param {String} location - The location where the game takes place.
     * @param {String} hometeam - The name of the home team.
     * @param {String} visitingteam - The name of the visiting team.
     * @param {String} description - A match description.
     * @param {URL} url - An URL to match information.
     */
    function MatchplanEntry(date, location, hometeam, visitingteam, description, url) {
        this.date = date;
        this.location = location;
        this.hometeam = hometeam;
        this.visitingteam = visitingteam;
        this.description = description;
        this.url = url;
    }

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
        return this.date.toLocaleString() + ': ' + this.hometeam + ' vs ' + this.visitingteam + '\n' + this.url;
    };

    return MatchplanEntry;
})();

exports.parseMatchplan = parseMatchplan;
