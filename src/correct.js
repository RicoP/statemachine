function Choose(message, a, b, callback) {
    console.log("Choose", message, a, b);
    var answer = ((confirm((("Willste " + a))) ? a : b));
    callback(null, answer);
}
function Say(message, callback) {
    console.log("Say", message);
    window.setTimeout(callback, 2000);
}
function GiveItem(item, callback) {
    console.log("GiveItem", item);
    window.setTimeout(callback, 2000);
}
function OnAction(func) {
    window.onAction = func;
}
var hasItems = true;
OnAction(function(_) {
    if (hasItems) {
        Say("Hi. Was willst du haben?", _);
        var item = Choose("Ne Waffe oder ein Trank?", "Waffe", "Trank", _);
        GiveItem(item, _);
        Say("So, bitteschön.", _);
        hasItems = false;
    }
     else {     
        Say("Schönen Tag noch.", _);
    }
},_);