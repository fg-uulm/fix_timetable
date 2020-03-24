// Hallo Bernhard!

/*---------------------------------------------------------------------------------------------
 * VARS
 */
var items = app.selection;


var searchPatterns = [
        [1, 2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 15, 16],
        [1, 2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 15, 16],
        [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
        [1, 2, 3, 5, 6, 7, 9, 11, 12, 14, 15, 16],
        [1, 2, 3, 5, 6, 9, 11, 12, 14, 15, 16]
]

var bridgeDays = [
        [],
        [12],
        [],
        [],
        [10,13],
]

var labWeek = 8;

var maxDist = 0;
var considerLabweek = false;
var considerBridgedays = false;
var weeksToAdd = 0;
var canceled = false;

/*---------------------------------------------------------------------------------------------
 * HELPER FUNCTIONS
 */
 
function levenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
                matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
                for (j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) == a.charAt(j - 1)) {
                                matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                        Math.min(matrix[i][j - 1] + 1, // insertion
                                                matrix[i - 1][j] + 1)); // deletion
                        }
                }
        }

        return matrix[b.length][a.length];
}

// Array.map polyfill
if (Array.prototype.map === undefined) {
        Array.prototype.map = function (fn) {
                var rv = [];

                for (var i = 0, l = this.length; i < l; i++)
                        rv.push(fn(this[i]));

                return rv;
        };
}

// Array.filter polyfill
if (Array.prototype.filter === undefined) {
        Array.prototype.filter = function (fn) {
                var rv = [];

                for (var i = 0, l = this.length; i < l; i++)
                        if (fn(this[i])) rv.push(this[i]);

                return rv;
        };
}

//Array.includes polyfill
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}


/*---------------------------------------------------------------------------------------------
 *  USER INYERFACE
 */



/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":15,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Wochen auffuellen","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Checkbox","parentId":7,"style":{"enabled":true,"varName":"labweek","text":"Seminar- / Laborwoche beruecksichtigen","preferredSize":[0,0],"alignment":"left","helpTip":null}},"item-2":{"id":2,"type":"Checkbox","parentId":7,"style":{"enabled":true,"varName":"bridgeday","text":"Brueckentage auffuellen","preferredSize":[0,0],"alignment":"left","helpTip":null}},"item-3":{"id":3,"type":"Slider","parentId":6,"style":{"enabled":true,"varName":"UnschaerfefaktorSlider","preferredSize":[200,0],"alignment":"center","helpTip":null}},"item-4":{"id":4,"type":"StaticText","parentId":6,"style":{"enabled":true,"varName":"UnschaerfefaktorLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Unschaerfefaktor","justify":"left","preferredSize":[0,0],"alignment":"center","helpTip":null}},"item-5":{"id":5,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":null}},"item-6":{"id":6,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":16,"alignChildren":["left","top"],"alignment":"center"}},"item-7":{"id":7,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-8":{"id":8,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":null}},"item-9":{"id":9,"type":"Button","parentId":11,"style":{"enabled":true,"varName":"cancelBtn","text":"Abbrechen","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"Button","parentId":11,"style":{"enabled":true,"varName":"startBtn","text":"Start","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-12":{"id":12,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-13":{"id":13,"type":"StaticText","parentId":12,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Wieviele Wochen anhaengen?","justify":"left","preferredSize":[0,0],"alignment":"center","helpTip":null}},"item-14":{"id":14,"type":"DropDownList","parentId":12,"style":{"enabled":true,"varName":"addWeeks","text":"DropDownList","listItems":"0,1,2,3,4,5","preferredSize":[73,0],"alignment":null,"selection":2,"helpTip":null}},"item-15":{"id":15,"type":"StaticText","parentId":6,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[30,0],"alignment":"center","helpTip":null}},"item-16":{"id":16,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":null}},"item-17":{"id":17,"type":"Checkbox","parentId":0,"style":{"enabled":true,"varName":null,"text":"Anhaengen erzwingen","preferredSize":[0,0],"alignment":"left","helpTip":null}}},"order":[0,12,13,14,6,4,3,15,5,7,1,2,8,17,16,11,9,10],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 

// DIALOG
// ======
var dialog = new Window("dialog"); 
    dialog.text = "Wochen auffuellen"; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["center","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16; 

// GROUP1
// ======
var group1 = dialog.add("group", undefined, {name: "group1"}); 
    group1.orientation = "row"; 
    group1.alignChildren = ["left","center"]; 
    group1.spacing = 10; 
    group1.margins = 0; 

var statictext1 = group1.add("statictext", undefined, undefined, {name: "statictext1"}); 
    statictext1.text = "Wieviele Wochen anhaengen?"; 
    statictext1.alignment = ["left","center"]; 

var addWeeks_array = ["0","1","2","3","4","5"]; 
var addWeeks = group1.add("dropdownlist", undefined, undefined, {name: "addWeeks", items: addWeeks_array}); 
    addWeeks.selection = 2; 
    addWeeks.preferredSize.width = 73; 

// GROUP2
// ======
var group2 = dialog.add("group", undefined, {name: "group2"}); 
    group2.orientation = "row"; 
    group2.alignChildren = ["left","top"]; 
    group2.spacing = 16; 
    group2.margins = 0; 
    group2.alignment = ["center","top"]; 

var UnschaerfefaktorLabel = group2.add("statictext", undefined, undefined, {name: "UnschaerfefaktorLabel"}); 
    UnschaerfefaktorLabel.text = "Unschaerfefaktor"; 
    UnschaerfefaktorLabel.alignment = ["left","center"]; 

var UnschaerfefaktorSlider = group2.add("slider", undefined, undefined, undefined, undefined, {name: "UnschaerfefaktorSlider"}); 
    UnschaerfefaktorSlider.minvalue = 0; 
    UnschaerfefaktorSlider.maxvalue = 20; 
    UnschaerfefaktorSlider.value = 0; 

var statictext2 = group2.add("statictext", undefined, undefined, {name: "statictext2"}); 
    statictext2.text = "0"; 
    statictext2.preferredSize.width = 30; 
    statictext2.alignment = ["left","center"]; 

// DIALOG
// ======
var divider1 = dialog.add("panel", undefined, undefined, {name: "divider1"}); 
    divider1.alignment = "fill"; 

// GROUP3
// ======
var group3 = dialog.add("group", undefined, {name: "group3"}); 
    group3.orientation = "row"; 
    group3.alignChildren = ["left","center"]; 
    group3.spacing = 10; 
    group3.margins = 0; 

var labweek = group3.add("checkbox", undefined, undefined, {name: "labweek"}); 
    labweek.text = "Seminar- / Laborwoche beruecksichtigen"; 
    labweek.alignment = ["left","top"]; 

var bridgeday = group3.add("checkbox", undefined, undefined, {name: "bridgeday"}); 
    bridgeday.text = "Brueckentage auffuellen"; 
    bridgeday.alignment = ["left","top"]; 

// DIALOG
// ======
var divider2 = dialog.add("panel", undefined, undefined, {name: "divider2"}); 
    divider2.alignment = "fill"; 

var forceAppend = dialog.add("checkbox", undefined, undefined, {name: "forceAppend"}); 
    forceAppend.text = "Anhaengen erzwingen"; 
    forceAppend.alignment = ["left","top"]; 

var divider3 = dialog.add("panel", undefined, undefined, {name: "divider3"}); 
    divider3.alignment = "fill"; 

// GROUP4
// ======
var group4 = dialog.add("group", undefined, {name: "group4"}); 
    group4.orientation = "row"; 
    group4.alignChildren = ["left","center"]; 
    group4.spacing = 10; 
    group4.margins = 0; 

var cancelBtn = group4.add("button", undefined, undefined, {name: "cancelBtn"}); 
    cancelBtn.text = "Abbrechen"; 

var startBtn = group4.add("button", undefined, undefined, {name: "startBtn"}); 
    startBtn.text = "Start"; 


startBtn.onClick = function (){
    dialog.close();
}

cancelBtn.onClick = function (){
    dialog.close();
    canceled = true;    
}

UnschaerfefaktorSlider.onChange = function(){
    statictext2.text = Math.round(UnschaerfefaktorSlider.value);    
}

dialog.show();

// Collect values from UI
var maxDist = Math.round(UnschaerfefaktorSlider.value);
var considerLabweek = labweek.value;
var considerBridgedays = bridgeday.value;
var weeksToAdd = addWeeks.selection;

$.writeln("DEBUG: UI values - ", maxDist, " ", considerBridgedays, " ", considerLabweek, " ",weeksToAdd);

//Extend suffixes by weeks
var allSuffix = "";
var evenSuffix = "";
var oddSuffix = "";
var lastWeek = searchPatterns[0].slice(-1)[0];

for (var i=lastWeek+1; i < lastWeek+weeksToAdd+1; i++) {
   allSuffix += ","+i;
   if(i % 2 == 0) {
        evenSuffix += ","+i;   
   } else if(i % 2 == 1) {
        oddSuffix += ","+i   
   }
}

$.writeln("DEBUG: Suffixes - ", allSuffix, " ", evenSuffix, " ", oddSuffix);


/*---------------------------------------------------------------------------------------------
 *  MAIN LOGIC
 */
//Check if canceled
if(canceled) exit();

//Check if something is selected
if (app.selection.length < 1) alert("Es wurde kein Objekt ausgewählt, bitte ein oder mehrere Objekte auswählen!", "Auswahl leer", true)

//Process selected items
for (var n = 0; n < items.length; n++) {
        //Step 1: Get existing label
        var labelPrev = items[n].label;
        var posPrevX = items[n].geometricBounds[1];
        var day = -1;

        //Step 2: Get day (22 - 198 range = 176, width 44)
        day = Math.floor(Math.round(posPrevX - 22) / 44);
        baseSearchPattern = searchPatterns[day];
        bridgeDaysForDay = bridgeDays[day];

        oddSearchPattern = baseSearchPattern.filter(function (number) {
                return number % 2 == 0
        });
        evenSearchPattern = baseSearchPattern.filter(function (number) {
                return number % 2 == 1
        });

        baseSearchString = baseSearchPattern.join(",");
        oddSearchString = oddSearchPattern.join(",");
        evenSearchString = evenSearchPattern.join(",");

        $.writeln("DEBUG: Search patterns - ", baseSearchString, " - ", oddSearchString, " - ", evenSearchString);

        //Step 3: Decide whether label is suitable for addition
        var dAll = levenshtein(labelPrev, baseSearchString);
        var dEven = levenshtein(labelPrev, evenSearchString);
        var dOdd = levenshtein(labelPrev, oddSearchString);

        $.writeln("DEBUG: ------ Processing item ", n);
        $.writeln("DEBUG: Left - ", posPrevX);
        $.writeln("DEBUG: Day - ", day);
        $.writeln("DEBUG: Label - ", labelPrev);
        $.writeln("DEBUG: Distances (all/even/odd) - ", dAll, " ", dEven, " ", dOdd);

        //Main Search and Add Logic
        if (dAll <= maxDist || forceAppend.value == true) {
                $.writeln("DEBUG: All Match for " + items[n]);               
                
                dayArray = labelPrev.split(",");       
                $.writeln("DEBUG: Day array " + dayArray + " (len: "+dayArray.length+")");

                //Add lab week if enabled and not already there
                if(!dayArray.includes(labWeek.toString()) && considerLabweek) {
                        items[n].label += ","+labWeek;
                        $.writeln("DEBUG: Add lab week " + labWeek); 
                }
                
                //Add bridgedays if enabled and not already there                
                $.writeln("DEBUG: Bridgeday array " + bridgeDaysForDay + " (len: "+bridgeDaysForDay.length+")");          
                for (var i=0, len=bridgeDaysForDay.length; i < len ; i++) {
                        if(!dayArray.includes(bridgeDaysForDay[i]) && considerBridgedays && bridgeDaysForDay[i]) {
                                items[n].label += ","+bridgeDaysForDay[i];
                        }
                        $.writeln("DEBUG: Add bridge day " + bridgeDaysForDay[i]);                   
                };

                //Add suffix if applicable
                items[n].label += allSuffix;

        } else if (dOdd <= maxDist) {
                $.writeln("DEBUG: Odd Match for " + items[n]);

                dayArray = labelPrev.split(",");       
                $.writeln("DEBUG: Day array " + dayArray + " (len: "+dayArray.length+")");

                //Add lab week if enabled and not already there
                 if(!dayArray.includes(labWeek.toString()) && considerLabweek && labWeek % 2 == 1) {
                        items[n].label += ","+labWeek;
                        $.writeln("DEBUG: Add lab week " + labWeek); 
                }
                
                //Add bridgedays if enabled and not already there               
                $.writeln("DEBUG: Bridgeday array " + bridgeDaysForDay + " (len: "+bridgeDaysForDay.length+")");          
                for (var i=0, len=bridgeDaysForDay.length; i < len ; i++) {
                        if(!dayArray.includes(bridgeDaysForDay[i]) && considerBridgedays && bridgeDaysForDay[i]  && bridgeDays[i] % 2 == 1) {
                                items[n].label += ","+bridgeDaysForDay[i];
                        }
                        $.writeln("DEBUG: Add bridge day " + bridgeDaysForDay[i]);                   
                };                

                //Step 3: Add if applicable
                items[n].label += oddSuffix;

        } else if (dEven <= maxDist) {
                $.writeln("DEBUG: Even Match for " + items[n]);

                dayArray = labelPrev.split(",");       
                $.writeln("DEBUG: Day array " + dayArray + " (len: "+dayArray.length+")");

                //Add lab week if enabled and not already there
                if(!dayArray.includes(labWeek.toString()) && considerLabweek && labWeek % 2 == 0) {
                        items[n].label += ","+labWeek;
                        $.writeln("DEBUG: Add lab week " + labWeek); 
                }
                
                //Add bridgedays if enabled and not already there
                $.writeln("DEBUG: Bridgeday array " + bridgeDaysForDay + " (len: "+bridgeDaysForDay.length+")");          
                for (var i=0, len=bridgeDaysForDay.length; i < len ; i++) {
                        if(!dayArray.includes(bridgeDaysForDay[i]) && considerBridgedays && bridgeDaysForDay[i]  && bridgeDays[i] % 2 == 0) {
                                items[n].label += ","+bridgeDaysForDay[i];
                        }
                        $.writeln("DEBUG: Add bridge day " + bridgeDaysForDay[i]);                   
                };

                //Step 3: Add if applicable
                items[n].label += evenSuffix;
        } else {
                $.writeln("DEBUG: No Match for " + items[n]);
        }
};