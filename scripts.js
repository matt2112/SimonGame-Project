var sequence = ["red", "green", "blue", "yellow"];

var colors = {
    "red": {
        "normal": "red",
        "change": "black"
    }
}

$("#start").on("click", function() {
    
    for (var i = 0; i < sequence.length; i++) {
        var newColor = colors[sequence[i]]["change"];
        var oldColor = colors[sequence[i]]["normal"];
        $("#" + sequence[i]).css("background-color", newColor);
        setTimeout(function() {
            $("#" + sequence[i]).css("background-color", oldColor);
        }, 2000);
    } 
});