var sequence = ["red", "green", "blue", "yellow", "blue", "green"];
var counter = 0;
var timer;
var running = false;

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
        "normal": "#000066",
        "change": "#1a1aff"
    }
};

$("#start").on("click", function() {
    
    if (!running) {
        counter = 0;
        running = true;
        timer = window.setInterval($traverseSequence, 1000);
    }
    
});

$traverseSequence = function() {
    if (counter > 0) {
        var oldColor = colors[sequence[counter - 1]]["normal"];
        $("#" + sequence[counter - 1]).css("background-color", oldColor);
    }
    
    if (counter < sequence.length) {
        var newColor = colors[sequence[counter]]["change"];
        $("#" + sequence[counter]).css("background-color", newColor);
        $("#" + sequence[counter] + "sound")[0].play();
        counter += 1;
    } else {
        window.clearInterval(timer);
        running = false;
    }   
}

/**
Sounds to use later:
https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.
*/