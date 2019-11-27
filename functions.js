/*****************************   anDeRan   ************************************/

var is_ie  = !!document.uniqueID;
var is_ie6 = is_ie && navigator.appVersion.match(/MSIE (5.5|6)/);

var max_offset;
var h_timeout, s_interval;

var checkSlide = function () {
	var by_top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	var nav = document.getElementById('nav-sub');

	var nav_from = parseInt(nav.style.top, 10);
	var nav_to   = by_top + nav.offsetHeight;

	var next = 100;

	if (nav_from != nav_to) {
		var offset = Math.ceil(Math.abs(nav_to - nav_from) / 20);

		if (nav_to < nav_from) {
			offset = -offset;
		}

		if ((document.body.scrollHeight - (nav.offsetHeight + 220)) > (nav_from + offset)) {
			nav.style.top = nav_from + offset + 'px';
		}

		next = 10;
	}

	setTimeout(checkSlide, next);
};

var slideNav = function () {
	var by_top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	var nav = document.getElementById('nav-sub');
	nav.style.top = by_top + nav.offsetHeight + 'px';
	nav.style.visibility = 'visible';

	checkSlide();
};

// fix firefox bug
var fixRuler = function () {
	var hr = document.getElementsByTagName('HR');
	var i = hr.length;
	while (i-- > 0) {
		hr[i].setAttribute('align', 'left');
		hr[i].style.visibility = 'visible';
	}
};

var setOpacity = function (obj, num) {
	if (is_ie) {
		obj.style.filter = 'alpha(opacity=' + (num * 100) + ')';
	} else {
		obj.style.opacity = num;
	}
};

var makeDefaults = function () {
	window.inputs = document.getElementsByTagName('INPUT');
	var i = inputs.length;
	while (i-- > 0) {
		if (inputs[i].type == 'text' && inputs[i].className) {
			if (inputs[i].name == 'password') {
				inputs[i].setAttribute('autocomplete', 'off');
			}
			inputs[i].onfocus = function () {
				if (this.value == this.defaultValue) {
					this.value = '';
					if (this.name == 'password' && this.type == 'text') {
						var input = document.createElement('INPUT');
						input.type = 'password';
						input.className = this.className;
						input.name = this.name;
						input.size = this.size;
						input.maxLength = this.maxLength;
						input.onfocus = this.onfocus;
						input.onblur = this.onblur;
						input.defaultValue = this.defaultValue;
						input.value = '';
						input.tabIndex = this.tabIndex;
						this.parentNode.insertBefore(input, this.parentNode.firstChild);
						this.style.display = 'none';
						input.focus();
						this.parentNode.removeChild(this);
					}
				}
			};
			inputs[i].onblur = function () {
				if (!this.value) {
					this.value = this.defaultValue;
					if (this.name == 'password' && this.type == 'password') {
						var input = document.createElement('INPUT');
						input.type = 'text';
						input.className = this.className;
						input.name = this.name;
						input.size = this.size;
						input.maxLength = this.maxLength;
						input.onfocus = this.onfocus;
						input.onblur = this.onblur;
						input.defaultValue = this.defaultValue;
						input.value = this.defaultValue;
						input.tabIndex = this.tabIndex;
						input.setAttribute('autocomplete', 'off');
						this.parentNode.insertBefore(input, this.parentNode.firstChild);
						this.parentNode.removeChild(this);
					}
				}
			};
		}
	}
};

var showLogin = function () {
	var login = document.getElementById('login-form');
	if (!login.style.visibility) {
		login.onmouseover = showLogin;
		login.onmouseout = hideLogin;
		login.style.visibility = 'hidden';
		makeDefaults();
	}
	clearTimeout(h_timeout);
	if (login.style.visibility == 'hidden') {
		login.style.visibility = 'visible';
		var opacity = 0.3, step = 0.05;
		setOpacity(login, opacity);
		s_interval = setInterval(function () {
			opacity += step;
			if (opacity > 1) {
				clearInterval(s_interval);
			} else {
				setOpacity(login, opacity);
			}
		}, 30);
	}
};

var hideLogin = function () {
	clearTimeout(h_timeout);
	h_timeout = setTimeout(function () {
		var login = document.getElementById('login-form');
		login.style.visibility = 'hidden';
		var i = login.elements.length;
		while (i-- > 0) {
			if (login.elements[i].nodeName == 'INPUT') {
				login.elements[i].blur();
			}
		}
	}, 250);
};

var changePer = function (select) {
	var curr = window.location.href;
	curr = curr.replace(/[\?&](per|page)=\d+/, '');
	window.location.href = curr + '?per=' + select.options[select.options.selectedIndex].value;
};

var changePrice = function () {
	var table = document.getElementById('prices');
	var sum = document.getElementById('sum');
	var inputs = table.getElementsByTagName('INPUT');
	var i = inputs.length;
	var total = 0;
	while (i-- > 0) {
		if (inputs[i].type == 'text') {
			if (isNaN(inputs[i].value)) {
				inputs[i].value = '1';
			}
			var price = parseFloat(inputs[i].parentNode.lastChild.value);
			var sub_sum = inputs[i].parentNode.parentNode.cells[inputs[i].parentNode.cellIndex+1];
			var sub_total = price * inputs[i].value;
			sub_sum.innerHTML = sub_total.toFixed(2);
			total += sub_total;
		}
	}
	
	sum.innerHTML = total.toFixed(2);
};

var checkHeights = function () {
	var content = document.getElementById('content');
	var divs = content.getElementsByTagName('DIV');
	var col_left, col_right, i = divs.length;
	while (i-- > 0) {
		if (divs[i].className && divs[i].className.indexOf('col-right') != -1) {
			col_right = divs[i];
			break;
		}
	}
	if (col_right) {
		var nav_sub = document.getElementById('nav-sub');
		if (col_right.offsetHeight < nav_sub.offsetHeight) {
			col_right.style.height = (is_ie6 ? nav_sub.offsetHeight + 50 : nav_sub.offsetHeight) + 'px';
			max_offset =  nav_sub.offsetHeight;
		}
	}
};

var checkCodes = function (button) {
	var inputs = button.form.getElementsByTagName('INPUT');
	var i = inputs.length;
	while (i-- > 0) {
		if (inputs[i].type == 'checkbox' && inputs[i].checked) {
			return true;
		}
	}
	alert('Укажите код заказываемого товара.');
	return false;
};

var checkOrder = function (button) {
	var form = button.form;
	var payment = form.elements['payment'].options[form.elements['payment'].selectedIndex].value;
	if (payment == '0') {
		alert('Выберите, пожалуйста, способ оплаты.');
		return false;
	}
	return;
};

window.onload = function () {
	checkHeights();
	slideNav();
	fixRuler();

	var login = document.getElementById('login');
	if (login) {
		login.onmouseover = showLogin;
		login.onmouseout = hideLogin;
	}

	Scroller.setAll();
	initLightbox();
};
