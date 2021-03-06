//var BASE_URL = "sitemaps.org/";
var BASE_URL = "/";

function onLangChange(select) {
  var wl = window.location;
  var parts = wl.href.split(wl.protocol + "//" + wl.host + BASE_URL);

  var path = parts[1];
  var locBase = parts[0] +
    BASE_URL +
    (select.value == "en" ? "" : select.value + "/");
  if (path == null || path.length == 0) {
    window.location = locBase;
  } else {
    var firstSlash = path.indexOf("/");
    path = path.substring(firstSlash + 1);
    window.location = locBase + path;
  }
  return false;
}

function syncLangSelector(id) {
  var el = document.getElementById(id);
  if (el == null) return;
  var locale = "";

  var wl = window.location;
  var parts = wl.href.split(wl.protocol + "//" + wl.host + BASE_URL);

  var path = parts[1];
  if (path == null || path.length == 0) {
    locale = "en";
  } else {
    locale = path.substring(0, path.indexOf("/"));
  }
  var options = el.getElementsByTagName("option");
  for (var i = 0; i < options.length; i++) {
    if (options[i].value == locale) {
      el.selectedIndex = i;
      return;
    }
  }
}

var languages = [
  ['da', 'Dansk'],
  ['de', 'Deutsch'],
  ['en" selected="selected', 'English'],
  ['en_GB', 'English (UK)'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['it', 'Italiano'],
  ['nl', 'Nederlands'],
  ['no', 'Norsk'],
  ['pl', 'Polski'],
  ['pt_BR', 'Português'],
  ['fi', 'Suomi'],
  ['ro', 'Română'],
  ['sv', 'Svenska'],
  ['tr', 'Türkçe'],
  ['ru', 'Русский'],
  ['zh_CN', '中文（简体）'],
  ['zh_TW', '中文（繁體）'],
  ['ja', '日本語 '],
  ['ko', '한국어']
];

function initializeLanguage() {
  var html = ['<select id="lang" name="lang" onchange="return onLangChange(this)" style="font-size: 10px;">'];
  for (var i in languages) {
    var language = languages[i];
    html.push('<option value="');
    html.push(language[0]);
    html.push('"');
    if (language[0] == 'en') {
      html.push(' selected="selected"');
    }
    html.push('>');
    html.push(language[1]);
    html.push('</option>');
  }
  html.push('</select>');

  var el = document.getElementById('langContainer');
  if (el != null) {
    el.innerHTML = html.join('');
    syncLangSelector("lang");
  }
}

window.onload = initializeLanguage;
