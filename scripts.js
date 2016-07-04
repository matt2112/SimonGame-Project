"use strict";

var sequence = [];
var counter = 0;
var level = 0;
var timer;
var running = false;
var waiting = false;
var clicks = [];
var strictMode = false;
var on = false;
var numLevels = 20;
var speed = 900;

/**
 * Toggles power on/off
 **/
$("#power").on("click", function () {
    if (on) {
        window.clearInterval(timer);
        $("#green").css("background-color", colors["green"]["normal"]);
        $("#red").css("background-color", colors["red"]["normal"]);
        $("#blue").css("background-color", colors["blue"]["normal"]);
        $("#yellow").css("background-color", colors["yellow"]["normal"]);
        on = false;
        $("#offPos").show();
        $("#onPos").hide();
        strictMode = false;
        $("#level").html("");
        $("#led").css("backgroundColor", "#262626");
        running = false;
        waiting = false;
    } else {
        $("#level").html("--");
        on = true;
        $("#offPos").hide();
        $("#onPos").show();
    }
});

/**
 * Sets number of levels as desired by user.
 **/
$("#numLevels").on("submit", function (e) {
    e.preventDefault();
    numLevels = parseInt(this.elements[0].value);
});

/**
 * Generates random sequence of colours.
 */
var newSequence = function () {
    sequence = [];
    var choices = ["green", "red", "yellow", "blue"];
    for (var i = 0; i < numLevels; i++) {
        sequence.push(choices[Math.floor(Math.random() * 4)]);
    }

    var ticks = 0;
    var thinking = window.setInterval(function () {
        if (ticks % 2 === 0) {
            $("#level").html("--");
        } else {
            $("#level").html("");
        }
        ticks += 1;
        if (ticks === 5) {
            window.clearInterval(thinking);
            startTimer();
        }
    }, 400);
}

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

    if (on) {
        $("#green").css("background-color", colors["green"]["normal"]);
        $("#red").css("background-color", colors["red"]["normal"]);
        $("#blue").css("background-color", colors["blue"]["normal"]);
        $("#yellow").css("background-color", colors["yellow"]["normal"]);
        counter = 0;
        level = 0;
        running = true;
        newSequence();
    }

});

/**
 * Starts traversing sequence assuming level does not exceed
 * length of sequence. Increases game tempo at 5th, 9th and 13th steps.
 **/
var startTimer = function () {

    if (level < sequence.length) {
        level += 1;
        var levelDisplay = (level < 10 ? '0' : '') + level;
        $("#level").html(levelDisplay);
    } else {
        running = false;
        handleWin();
    }

    if (running) {

        if (level < 5) {
            speed = 900;
        } else if (level < 9) {
            speed = 700;
        } else if (level < 13) {
            speed = 500;
        } else {
            speed = 300;
        }

        timer = window.setInterval(traverseSequence, speed);
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

    var slightDelay = window.setInterval(function () {
        window.clearInterval(timer);
        window.clearInterval(slightDelay);
        if ((counter < level) && on) {
            var newColor = colors[sequence[counter]]["change"];
            $("#" + sequence[counter]).css("background-color", newColor);
            $("#" + sequence[counter] + "sound")[0].load();
            $("#" + sequence[counter] + "sound")[0].play();
            counter += 1;
            timer = window.setInterval(traverseSequence, speed);
        } else {
            waiting = true;
        }
        window.clearInterval(slightDelay);
    }, 100);

}

/**
 * Once computer has finished playing level, awaits user input
 * and verifies answer is correct.
 **/
$(".box")
    .mousedown(function () {
        if (waiting && on) {
            $("#" + this.id + "sound")[0].load();
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
                handleMistake();
            }

            if (clicks.length === level) {
                clicks = [];
                waiting = false;
                counter = 0;
                startTimer();
            }
        }
    });

/**
 * Deals with any mistakes made by the user.
 **/
var handleMistake = function () {
    clicks = [];
    waiting = false;
    counter = 0;
    var ticks = 0;
    var exclamation = window.setInterval(function () {
        if (ticks === 0) {
            $("#mistake")[0].play();
        }
        if (ticks % 2 === 0) {
            $("#level").html("!!");
        } else {
            $("#level").html("");
        }
        ticks += 1;
        if (ticks === 5) {
            window.clearInterval(exclamation);
            if (strictMode) {
                level = 0;
                newSequence();
            } else {
                level -= 1;
                startTimer();
            }
        }
    }, 400);
}

/**
 * Congratulates user if he/she wins and plays victory sound and animation.
 **/
var handleWin = function () {
    var ticks = 0;
    var exclamation = window.setInterval(function () {
        if (ticks === 0) {
            $("#win")[0].play();
        }
        if (ticks % 2 === 0) {
            $("#level").html("**");
        } else {
            $("#level").html("");
        }
        ticks += 1;
        if (ticks === 5) {
            window.clearInterval(exclamation);
        }
    }, 400);

    var flash = 0;
    var flashes = window.setInterval(function () {
        switch (flash) {
        case 0:
        case 4:
        case 8:
            $("#yellow").css("background-color", colors["yellow"]["normal"]);
            $("#green").css("background-color", colors["green"]["change"]);
            break;
        case 1:
        case 5:
        case 9:
            $("#green").css("background-color", colors["green"]["normal"]);
            $("#red").css("background-color", colors["red"]["change"]);
            break;
        case 2:
        case 6:
        case 10:
            $("#red").css("background-color", colors["red"]["normal"]);
            $("#blue").css("background-color", colors["blue"]["change"]);
            break;
        case 3:
        case 7:
        case 11:
            $("#blue").css("background-color", colors["blue"]["normal"]);
            $("#yellow").css("background-color", colors["yellow"]["change"]);
            break;
        case 12:
            $("#yellow").css("background-color", colors["yellow"]["normal"]);
            window.clearInterval(flashes);
            break;
        default:
            alert("error!");
        }
        flash += 1;
    }, 200);
}