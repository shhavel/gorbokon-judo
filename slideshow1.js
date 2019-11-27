/*
 +-------------------------------------------------------------------+
 |                  J S - S L I D E S H O W   (v1.6)                 |
 |                                                                   |
 | Copyright Gerd Tentler                www.gerd-tentler.de/tools   |
 | Created: Apr. 9, 2003                 Last modified: Dec. 8, 2007 |
 +-------------------------------------------------------------------+
 | This program may be used and hosted free of charge by anyone for  |
 | personal purpose as long as this copyright notice remains intact. |
 |                                                                   |
 | Obtain permission before selling the code for this program or     |
 | hosting this software on a commercial website or redistributing   |
 | this software over the Internet or in any other medium. In all    |
 | cases copyright must remain intact.                               |
 +-------------------------------------------------------------------+

 This script was tested with:

 - Windows XP: Internet Explorer 6, Netscape Navigator 7, Opera 7 + 9, Firefox 2
 - Mac OS X:   Internet Explorer 5, Safari 1

 If you use another browser or operating system, this script may not work for you.
*/
//---------------------------------------------------------------------------------------------------------
// Configuration
//---------------------------------------------------------------------------------------------------------

var slsAutoStart = true;                    // start auto slide ( = yes, false = no)
var slsAutoSlideTime = 2;                   // change pages every .. seconds

var slsWidth = 480;                         // content width (pixels)
var slsHeight = 360;                        // content height (pixels)
var slsColor = "#990000";                   // content background color
var slsOverflow = "hidden";                 // content scrollbars: "auto" or "hidden"
                                            // ("auto" may cause flickering with Gecko browsers)

var slsBorderWidth = 1;                     // border width (pixels)
var slsBorderStyle = "solid";               // border style (CSS-spec, e.g. "solid", "outset", "inset", etc.)
var slsBorderColor = "#990000";             // border color

var slsBarHeight = 23;                      // iconbar height (pixels)
var slsBarSpace = 4;                        // space between iconbar and page contents (pixels)

var slsImgPrev = "previous.gif";            // previous button: path to image
var slsImgPrevWidth = 70;                   // previous button: image width (pixels)
var slsImgNext = "next.gif";                // next button: path to image
var slsImgNextWidth = 70;                   // next button: image width (pixels)
var slsImgPlay = "play.gif";                // play button: path to image
var slsImgPlayWidth = 70;                   // play button: image width (pixels)
var slsImgStop = "stop.gif";                // stop button: path to image
var slsImgStopWidth = 70;                   // stop button: image width (pixels)
var slsImgBlank = "blank.gif";              // path to blank image

var slsIndView = true;                      // view index (true = yes, false = no)
var slsIndCount = 20;                       // max. number of visible index entries
var slsIndHeight = 20;                      // index height (pixels);
var slsIndSpace = 4;                        // space between index and iconbar
var slsIndColor = "";                       // index background color
var slsIndFont = "Arial, Helvetica";        // index font family
var slsIndFontSize = 11;                    // index font size (pixels)

var slsSlidingMax =40 ;                     // if there are more than slsSlidingMax pages, sliding will be
                                            // turned off for performance reasons

//---------------------------------------------------------------------------------------------------------
// Functions
//---------------------------------------------------------------------------------------------------------

var DOM = document.getElementById;
var OP = (navigator.userAgent.indexOf('Opera') != -1);
var IE4 = (document.all && !OP);

var slsBord, slsCont, slsArea, slsBarArea, slsIndArea, slsIV, slsTimer;
var slsIndStart = 0;
var slsPages = (typeof(slsContents) != 'undefined') ? slsContents.length : 0;
var slsAutoSliding = false;

var slsW = slsWidth + slsBorderWidth*2;
var slsH = slsHeight + slsBorderWidth*2 + slsBarSpace + slsBarHeight;
if(slsIndView) slsH += slsIndSpace + slsIndHeight;

function slsObject(obj) {
  this.elem = DOM ? document.getElementById(obj) : document.all[obj];
  this.css = this.elem.style;
  this.width = this.elem.offsetWidth;
  this.left = 0;
  return this;
}

function slsPrevPage() {
  if(!slsSliding && slsArea.left < 0) slsJump(slsCurX + slsWidth);
}

function slsNextPage() {
  if(!slsSliding && slsArea.left > -slsArea.width+slsWidth) slsJump(slsCurX - slsWidth);
}

function slsJump(position) {
  if(!slsSliding) {
    slsNewX = slsArea.left = position;
    if(slsPages > slsSlidingMax) {
      slsArea.css.left = slsCurX = slsNewX;
      slsCheckImg();
      if(slsIndView) {
        var start = Math.ceil(slsCurX / slsWidth / slsIndCount) * slsIndCount * -1 + 1;
        slsSetIndex(start);
      }
    }
    else slsIV = setInterval('slsSlider()', 1);
  }
}

function slsCheckImg() {
  var iconbar = 0;
  var img = document.images['slsLeft'];
  if(slsArea.left >= 0) img.src = slsImgBlank;
  else img.src = iconbar = slsImgPrev;
  img = document.images['slsRight'];
  if(slsArea.left <= -slsArea.width+slsWidth) img.src = slsImgBlank;
  else img.src = iconbar = slsImgNext;
  if(!iconbar) slsBarArea.css.visibility = slsIndArea.css.visibility = 'hidden';
}

function slsSetIndex(start) {
  if(!slsSliding) {
    if(start) slsIndStart = start-1;
    var html = link = '';
    for(var i = slsIndStart; i < slsPages && i < slsIndStart+slsIndCount; i++) {
      if(i && html) html += ' &middot; ';
      if(slsCurX == i * -slsWidth) html += '<b>' + (i+1) + '</b>';
      else {
        link = 'javascript:slsStopAutoSlide(); slsJump(' + (i * -slsWidth) + ')';
        html += '<a href="' + link + '" style="text-decoration:none">' + (i+1) + '</a>';
      }
    }
    if(slsIndStart) {
      link = 'javascript:slsSetIndex(' + (slsIndStart-slsIndCount+1) + ')';
      html += ' &middot; <a href="' + link + '" style="text-decoration:none">&lt;&lt;</a> ';
    }
    if(i < slsPages) {
      link = 'javascript:slsSetIndex(' + (i+1) + ')';
      html += ' &middot; <a href="' + link + '" style="text-decoration:none">&gt;&gt;</a>';
    }
    slsIndArea.elem.innerHTML = html;
  }
}

function slsDoAutoSlide() {
  if(slsArea.left <= -slsArea.width+slsWidth) slsJump(0);
  else slsNextPage();
}

function slsStopAutoSlide() {
  if(slsAutoSliding) {
    if(slsTimer) clearInterval(slsTimer);
    var img = document.images['slsPlayStop'];
    img.src = slsImgPlay;
    img.width = slsImgPlayWidth;
    img.onclick = function() { slsStartAutoSlide(); this.blur(); }
    slsAutoSliding = false;
  }
}

function slsStartAutoSlide() {
  slsStopAutoSlide();
  slsTimer = setInterval('slsDoAutoSlide()', slsAutoSlideTime * 1000);
  var img = document.images['slsPlayStop'];
  img.src = slsImgStop;
  img.width = slsImgStopWidth;
  img.onclick = function() { slsStopAutoSlide(); this.blur(); }
  slsAutoSliding = true;
}

function slsInit() {
  if(DOM || IE4) {
    if(slsPages) {
      slsBord = new slsObject('slsBorder');
      slsCont = new slsObject('slsContainer');
      slsArea = new slsObject('slsSlider');
      slsBarArea = new slsObject('slsBar');
      if(slsIndView) slsIndArea = new slsObject('slsInd');

      if(slsColor) slsCont.css.backgroundColor = slsColor;
      if(slsIndColor) slsIndArea.css.backgroundColor = slsIndColor;

      if(slsBorderWidth) slsBord.css.borderWidth = slsBorderWidth + 'px';
      if(slsBorderStyle) slsBord.css.borderStyle = slsBorderStyle;
      if(slsBorderColor) slsBord.css.borderColor = slsBorderColor;

      slsBord.css.width = slsWidth + 'px';
      slsBord.css.height = slsHeight + 'px';

      slsArea.width = slsWidth * slsPages;
      slsArea.css.width = slsArea.width + 'px';
      slsArea.css.position = 'absolute';

      slsCont.css.width = slsWidth + 'px';
      slsCont.css.height = slsHeight + 'px';
      slsCont.css.visibility = 'visible';

      var content = '<img src="' + slsImgPrev + '" border="0" name="slsLeft" height="' + slsBarHeight + '"' +
                    ' width="' + slsImgPrevWidth + '" class="slsIcon" onClick="slsStopAutoSlide(); slsPrevPage(); this.blur()">' +
                    '<img src="' + slsImgPlay + '" border="0" name="slsPlayStop" height="' + slsBarHeight + '"' +
                    ' width="' + slsImgPlayWidth + '" class="slsIcon">' +
                    '<img src="' + slsImgNext + '" border="0" name="slsRight" height="' + slsBarHeight + '"' +
                    ' width="' + slsImgNextWidth + '" class="slsIcon" onClick="slsStopAutoSlide(); slsNextPage(); this.blur()">';

      slsBarArea.elem.innerHTML = content;
      slsBarArea.css.top = (slsHeight + slsBorderWidth*2 + slsBarSpace) + 'px';
      slsBarArea.css.width = slsW + 'px';
      slsBarArea.css.height = slsBarHeight + 'px';
      slsBarArea.css.textAlign = 'center';

      if(slsIndView) {
        slsIndArea.css.top = (slsHeight + slsBorderWidth*2 + slsBarSpace + slsBarHeight + slsIndSpace) + 'px';
        slsIndArea.css.height = slsIndHeight + 'px';
        slsIndArea.css.width = slsW + 'px';
        if(slsIndFont) slsIndArea.css.fontFamily = slsIndFont;
        if(slsIndFontSize) slsIndArea.css.fontSize = slsIndFontSize + 'px';
        slsSetIndex();
      }
      setTimeout('slsCheckImg()', 100);
      if(slsAutoSlideTime && slsAutoStart) slsStartAutoSlide();
    }
    else alert("No contents found.");
  }
  else alert("Sorry, this script doesn't work with your browser.");
}

window.onload = slsInit;

//---------------------------------------------------------------------------------------------------------
// Page slider
//---------------------------------------------------------------------------------------------------------

var slsCurX = slsNewX = 0;
var slsSliding = false;

function slsSlider() {
  if(slsCurX != slsNewX) {
    slsSliding = true;
    var percent = .1 * (slsNewX - slsCurX);
    if(percent > 0) percent = Math.ceil(percent);
    else percent = Math.floor(percent);
    slsCurX += percent;
    slsArea.css.left = slsCurX + 'px';
  }
  else {
    slsSliding = false;
    clearInterval(slsIV);
    slsCheckImg();
    if(slsIndView) {
      var start = Math.ceil(slsCurX / slsWidth / slsIndCount) * slsIndCount * -1 + 1;
      slsSetIndex(start);
    }
  }
}

//---------------------------------------------------------------------------------------------------------
// Set styles
//---------------------------------------------------------------------------------------------------------

document.write('<style> ' +
               '#slideShow { position:relative; width:' + slsW + 'px; height:' + slsH + 'px; } ' +
               '#slsBorder { position:absolute; top:0px; left:0px; } ' +
               '#slsContainer { position:absolute; top:0px; left:0px; ' +
               'clip:rect(0,' + slsWidth + ',' + slsHeight + ',0); ' +
               'z-index:0; overflow:hidden; visibility:hidden; } ' +
               '.slsPage { width:' + slsWidth + 'px; height:' + slsHeight + 'px; ' +
               'float:left; overflow:' + slsOverflow + '; } ' +
               'img.slsIcon { margin: 0px 5px 0px 5px; cursor: pointer; } ' +
               '</style>');

//---------------------------------------------------------------------------------------------------------
// Build border, contents, iconbar and index
//---------------------------------------------------------------------------------------------------------

if(slsPages) {
  document.write('<div id="slideShow">');
  if(slsIndView) document.write('<div id="slsInd" style="position:absolute; z-index:69; text-align:center"></div>');
  document.write('<div id="slsBar" style="position:absolute; z-index:69"></div>');
  document.write('<div id="slsBorder"><div id="slsContainer"><div id="slsSlider">');

  for(var i = 0; i < slsPages; i++) {
    document.write('<div class="slsPage">' + slsContents[i] + '</div>');
  }
  document.write('</div></div></div></div>');
}

//---------------------------------------------------------------------------------------------------------

