"use strict";

var sequence = ["red", "green", "blue", "yellow", "blue", "green"];
var counter = 0;
var level = 0;
var timer;
var running = false;
var waiting = false;
var clicks = [];
var strictMode = false;
var on = false;

/**
 * Toggles power on/off
 **/
$("#power").on("click", function () {
    if (on) {
        on = false;
        $("#offPos").show();
        $("#onPos").hide();
        strictMode = false;
        $("#led").css("backgroundColor", "#262626");
        running = false;
        waiting = false;
    } else {
        on = true;
        $("#offPos").hide();
        $("#onPos").show();
    }
});

/**
 * Toggles between strict mode and 'easy' mode
 **/
$("#strict").on("click", function () {
    if (on) {
        if (strictMode) {
            strictMode = false;
            $("#led").css("backgroundColor", "#262626");
        } else {
            strictMode = true;
            $("#led").css("backgroundColor", "red");
        }
    }
});

var colors = {
    "green": {
        "normal": "#008000",
        "change": "#00e600"
    },
    "red": {
        "normal": "#991f00",
        "change": "#ff471a"
    },
    "yellow": {
        "normal": "#cccc00",
        "change": "#ffff00"
    },
    "blue": {
        "normal": "#003d99",
        "change": "#3385ff"
    }
};

/**
 * Begins game when Go button clicked.
 **/
$("#start").on("click", function () {

    if (!running && on) {
        counter = 0;
        level = 0;
        running = true;
        startTimer();
    }

});

/**
 * Starts traversing sequence assuming level does not exceed
 * length of sequence.
 **/
var startTimer = function () {

    if (level < sequence.length) {
        level += 1;
    } else {
        running = false;
        alert("You win!");
    }

    if (running) {
        timer = window.setInterval(traverseSequence, 1000);
    }
}

/**
 * Counts through one more element sequence,
 * changing colours and playing sounds as it goes.
 **/
var traverseSequence = function () {
    if (counter > 0) {
        var oldColor = colors[sequence[counter - 1]]["normal"];
        $("#" + sequence[counter - 1]).css("background-color", oldColor);
    }

    if ((counter < level) && on) {
        var newColor = colors[sequence[counter]]["change"];
        $("#" + sequence[counter]).css("background-color", newColor);
        $("#" + sequence[counter] + "sound")[0].play();
        counter += 1;
    } else {
        window.clearInterval(timer);
        waiting = true;
    }
}

/**
 * Once computer has finished playing level, awaits user input
 * and verifies answer is correct.
 **/
$(".box")
    .mousedown(function () {
        if (waiting && on) {
            $("#" + this.id + "sound")[0].play();
            clicks.push(this.id);
            var newColor = colors[this.id]["change"];
            $("#" + this.id).css("background-color", newColor);
        }
    })
    .mouseup(function () {

        var oldColor = colors[this.id]["normal"];
        $("#" + this.id).css("background-color", oldColor);

        if (waiting) {
            if (clicks.slice(-1)[0] !== sequence[clicks.length - 1]) {
                if (strictMode) {
                    waiting = false;
                    running = false;
                    alert("you lose!");
                } else {
                    alert("try again!");
                    clicks = [];
                }
            }

            if (clicks.length === level) {
                clicks = [];
                waiting = false;
                counter = 0;
                startTimer();
            }
        }
    });