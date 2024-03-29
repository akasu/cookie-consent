function loadCookieConsentInitial() {

    socialCookie = getConsentCookie('socialCookie');
    marketingCookie = getConsentCookie('marketingCookie');
    analyticsCookie = getConsentCookie('analyticsCookie');
    modalIsOpen = 0;
    allCookiesInBarAreSelected = 0;
    allCookiesInModalAreSelected = 0;
    barElem = document.getElementById('cookieConsentBarSettings');
    cookieContent = {};
    loadCookieBar = 1;
    consentBar = 0;
    reload = 0;
    domain = location.hostname;

    /*
    * Get Consent-Cookie-Status
    * if CookieStatus == false, then show CookieBar
    */
    var cookieStatus = getConsentCookie('consentCookie');

    /* Check Cookie-Settings on every Site */
    var cookieSettings = checkCookieSettings();

    if (cookieSettings) {

    } else {

    }

    if (loadCookieBar == 1) {
        setConsentBar();
        consentBar = 1;
    } else {
        loadScripts();
        revokeCookies = 1;
        document.getElementById('revokeCookieConsentSettings').style.display = 'block';
    }
}

function loadConsentBar() {
    loadCookieBar = 1;
    document.querySelector('#cookieConsentBarText').textContent = '';
    document.querySelector('#cookieConsentBarSettings').textContent = '';
    document.querySelector('#cookieConsentBarButtons').textContent = '';
    document.querySelector('#cookieConsentSettings').textContent = '';
    document.getElementById('cookieConsentBar').style.display = 'block';
    setConsentBar();
    document.getElementById('revokeCookieConsentSettings').style.display = 'none';
}

function setConsentBar() {
    /* Set Text in Cookie-Consent-Bar */
    var elem = document.getElementById('cookieConsentBarText');
    var textElem = document.createElement('div');
    textElem.id = 'cookieConsentBarText';
    textElem.innerHTML = cookieConsentConfig.text.consentBarText;
    elem.appendChild(textElem);

    /* Set Settings-Buttons in Bar */
    setSettingsButtonsInBar();

    /* Set Button in Cookie-Consent-Bar */
    var elem = document.getElementById('cookieConsentBarButtons');

    /* Set Select-All-Button */
    var allowButton = document.createElement('button');
    allowButton.id = 'consentBarButtonSelectAll';
    allowButton.innerHTML = cookieConsentConfig.text.consentBarButtonAllowAllText;
    elem.appendChild(allowButton);
    allowButton.onclick = selectAllCookiesInBar;

    /* Set Save-All-Button */
    var saveButton = document.createElement('button');
    saveButton.id = 'consentBarButtonSave';
    saveButton.innerHTML = cookieConsentConfig.text.consentBarButtonSaveText;
    elem.appendChild(saveButton);
    saveButton.onclick = saveCookieConsentBarSettings;

    /* Set More-Information-Button */
    var moreButton = document.createElement('button');
    moreButton.id = 'consentBarButtonMoreInformation';
    moreButton.innerHTML = cookieConsentConfig.text.consentBarButtonMoreInformationText;
    elem.appendChild(moreButton);
    moreButton.onclick = loadModalConsentContainer;
    document.getElementById('cookieConsentBar').style.display = 'block';
    initializeConsentContainer();
}

/**
 * Set Buttons in Cookie-Bar
 */

function setSettingsButtonsInBar() {
    for (var p in cookieConsentConfig.purposes) {
        loadCookieBarSettings(barElem, cookieConsentConfig.purposes[p]);
    }
}

/**
 * Set Content when Open Modal
 */

function setConsentHeadline() {
    document.getElementById('cookieConsentHeadline').innerHTML = cookieConsentConfig.text.consentHeadline;
}

function setConsentDescription() {
    document.getElementById('cookieConsentDescription').innerHTML = cookieConsentConfig.text.consentDescription;
}

function setConsentSaveButton() {
    document.getElementById('saveCookieConsentSettings').innerHTML = cookieConsentConfig.text.saveCookieConsentSettingsButtonText;
}

function setConsentAbortButton() {
    document.getElementById('abortCookieConsentSettings').innerHTML = cookieConsentConfig.text.abortCookieConsentSettingsButtonText;
}

function setConsentMarkAllButton() {
    if (allCookiesInModalAreSelected === 0) {
        document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.activateAll;
    } else {
        document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.deactivateAll;
    }

}

/**
 * Load Consent Modal
 */

function loadModalConsentContainer() {
    if (modalIsOpen === 0) {
        document.getElementById('cookieConsentContainer').style.display = 'block';
        modalIsOpen = 1;
    }
}

function initializeConsentContainer() {
    setConsentHeadline();
    setConsentDescription();
    setConsentSaveButton();
    setConsentAbortButton();
    setConsentMarkAllButton();
    elem = document.getElementById('cookieConsentSettings');
    for (var p in cookieConsentConfig.purposes) {
        loadCookieSettings(elem, cookieConsentConfig.purposes[p]);
    }
}

/**
 * Load Cookie-Information in CosentCookie Bar
 */

function loadCookieBarSettings(elem, p) {
    if (Object.keys(p.scripts).length) {
        var nElem = document.createElement('div');
        if (p.status != 'required') {
            var div = document.createElement('span');
            div.className = p.type + 'Container scriptBarContainer';
            div.innerHTML = '<div class="barScriptName activateAllInBar">' + p.name + '</div>';

            var label = document.createElement('label');
            label.className = 'switch';

            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = p.type;
            input.className = 'activate';
            if (cookieContent[p.type] == 1) {
                input.checked = 'checked';
            }
            input.onchange = function () {
                if (this.checked) {
                    document.querySelector('.' + this.id + 'Container .scriptName').textContent = cookieConsentConfig.text.deactivateAll;
                    var elemList = document.querySelectorAll('.' + this.id + 'Cookies .scriptContainer input');
                    for (var i = 0, n = elemList.length; i < n; i++) {
                        elemList[i].checked = 'checked';
                    }
                    document.querySelector('#cookieConsentBarSettings #' + this.id).checked = 'checked';
                } else {
                    document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.activateAll;
                    allCookiesInModalAreSelected = 0;
                    document.querySelector('.' + this.id + 'Container .scriptName').textContent = cookieConsentConfig.text.activateAll;
                    var elemList = document.querySelectorAll('.' + this.id + 'Cookies .scriptContainer input');
                    for (var i = 0, n = elemList.length; i < n; i++) {
                        elemList[i].checked = '';
                    }
                    document.querySelector('#cookieConsentBarSettings #' + this.id).checked = '';
                }
            };

            label.appendChild(input);

            var span = document.createElement('span');
            span.className = 'slider';
            label.appendChild(span);

            div.appendChild(label);

            nElem.appendChild(div);
        }
        elem.appendChild(nElem);
    }
}

/**
 * load Cookie Settings Information in Cookie-Modal
 */

function loadCookieSettings(elem, p) {
    if (Object.keys(p.scripts).length) {
        var nElem = document.createElement('div');
        nElem.className = p.type + 'Cookies';
        nElem.innerHTML = '<h3>' + p.name + '</h3><span class="groupDescription">' + p.groupDescription + '</span>';

        if (p.status != 'required') {

            var div = document.createElement('div');
            div.className = p.type + 'Container scriptContainer';
            div.innerHTML = '<div class="scriptName activateAll">Alle Aktivieren</div>';

            var label = document.createElement('label');
            label.className = 'switch';

            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = p.type;
            input.className = 'activate';
            if (cookieContent[p.type] == 1) {
                input.checked = 'checked';
            }

            input.onchange = function () {
                if (this.checked) {
                    document.querySelector('.' + this.id + 'Container .scriptName').textContent = cookieConsentConfig.text.deactivateAll;
                    var elemList = document.querySelectorAll('.' + this.id + 'Cookies .scriptContainer input');
                    for (var i = 0, n = elemList.length; i < n; i++) {
                        elemList[i].checked = 'checked';
                    }

                    document.querySelector('#cookieConsentBarSettings #' + this.id).checked = 'checked';

                } else {
                    document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.activateAll;
                    allCookiesInModalAreSelected = 0;
                    document.querySelector('.' + this.id + 'Container .scriptName').textContent = cookieConsentConfig.text.activateAll;
                    var elemList = document.querySelectorAll('.' + this.id + 'Cookies .scriptContainer input');
                    for (var i = 0, n = elemList.length; i < n; i++) {
                        elemList[i].checked = '';
                    }
                    document.querySelector('#cookieConsentBarSettings #' + this.id).checked = '';
                }
            };
            label.appendChild(input);

            var span = document.createElement('span');
            span.className = 'slider';

            label.appendChild(span);
            div.appendChild(label);
            nElem.appendChild(div);
        }
        elem.appendChild(nElem);

        var cookieElem = document.querySelector('.' + p.type + 'Cookies');
        for (var c in p.scripts) {

            var div = document.createElement('div');
            div.className = 'scriptContainer';
            div.innerHTML = '<div class="scriptName">' + p.scripts[c].name + '</div>';

            var label = document.createElement('label');
            label.className = 'switch';
            var checked = '';
            if (cookieContent[p.scripts[c].type] == 1) {
                checked = 'checked="checked"';
            }

            label.innerHTML = '<input type="checkbox" ' + checked + ' id="' + p.scripts[c].type + '" onchange="deactivateParentInput(\'' + p.type + '\')"><span class="slider"></span>';
            div.appendChild(label);
            cookieElem.appendChild(div);
        }
    }
}

function deactivateParentInput(type) {
    document.querySelector('.' + type + 'Cookies .activate').checked = '';
}

/*
* Select on Click on Button in Bar all Cookie-Select-Inputs
 */

function selectAllCookiesInBar() {
    if (allCookiesInBarAreSelected === 0) {

        allCookiesInModalAreSelected = 0;
        selectAllCookiesInModal();
        allCookiesInBarAreSelected = 1;
        selectAllCookiesInConsentBar()

    } else {
        allCookiesInModalAreSelected = 1;
        deselectAllCookiesInModal();
        allCookiesInBarAreSelected = 0;
        deselectAllCookiesInConsentBar()

    }
}

function changeStatusOfAllGroups() {
    if (allCookiesInModalAreSelected === 0) {
        selectAllCookiesInModal();
        allCookiesInModalAreSelected = 1;
        selectAllCookiesInConsentBar();
        allCookiesInBarAreSelected = 1;
    } else {
        deselectAllCookiesInModal();
        allCookiesInModalAreSelected = 0;
        deselectAllCookiesInConsentBar();
        allCookiesInBarAreSelected = 0;
    }

}

function changeSettingsFromBarInModal() {
    if (allCookiesInBarAreSelected === 0) {

    }
}

function changeSettingsFromModalInBar() {
    if (allCookiesInModalAreSelected === 0) {
        allCookiesInBarAreSelected = 0;
        selectAllCookiesInConsentBar();
    } else {
        allCookiesInBarAreSelected = 1;
        deselectAllCookiesInConsentBar();
    }
}

function selectAllCookiesInModal() {
    var elemList = document.querySelectorAll('#cookieConsentSettings input');
    for (var i = 0, n = elemList.length; i < n; i++) {
        elemList[i].checked = 'checked';
    }
    document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.deactivateAll;
    var activeList = document.querySelectorAll('.activateAll');
    for (i = 0; i < activeList.length; ++i) {
        activeList[i].textContent = cookieConsentConfig.text.deactivateAll;
    }
}

function deselectAllCookiesInModal() {
    var elemList = document.querySelectorAll('#cookieConsentSettings input');
    for (var i = 0, n = elemList.length; i < n; i++) {
        elemList[i].checked = '';
    }
    document.getElementById('markAllCookieConsentSettings').innerHTML = cookieConsentConfig.text.activateAll;
    var activeList = document.querySelectorAll('.activateAll');
    for (i = 0; i < activeList.length; ++i) {
        activeList[i].textContent = cookieConsentConfig.text.activateAll;
    }
}

function selectAllCookiesInConsentBar() {
    var elemList = document.querySelectorAll('#cookieConsentBarSettings input');
    for (var i = 0, n = elemList.length; i < n; i++) {
        elemList[i].checked = 'checked';
    }
    document.getElementById('consentBarButtonSelectAll').innerHTML = cookieConsentConfig.text.deactivateAll;

}

function deselectAllCookiesInConsentBar() {
    var elemList = document.querySelectorAll('#cookieConsentBarSettings input');
    for (var i = 0, n = elemList.length; i < n; i++) {
        elemList[i].checked = false;
    }
    document.getElementById('consentBarButtonSelectAll').innerHTML = cookieConsentConfig.text.activateAll;
}

function saveCookieConsentModalSettings() {
    var elemList = document.querySelectorAll('#cookieConsentSettings input');
    var cookieSettings = "";
    for (var i = 0, n = elemList.length; i < n; i++) {
        if (elemList[i].checked) {
            document.cookie = elemList[i].id + "=1; ";
        } else {
            document.cookie = elemList[i].id + "=0; ";
        }
    }
    var a = new Date();
    a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * cookieConsentConfig.cookieExpiresAfterDays);
    document.cookie = "name=consentCookie; consentCookie=1; expires=" + a.toGMTString() + "; path=/;";
    document.getElementById('cookieConsentBar').style.display = 'none';
    document.getElementById('cookieConsentContainer').style.display = 'none';
    document.getElementById('revokeCookieConsentSettings').style.display = 'block';
    modalIsOpen = 0;

    if (reload === 1) {
        //window.location.reload();
        reload = 0;
    }
}

function saveCookieConsentBarSettings() {
    var elemList = document.querySelectorAll('#cookieConsentBarSettings input');
    var cookieSettings = "";
    for (var i = 0, n = elemList.length; i < n; i++) {
        var element = elemList[i].id;
        var cookieList = cookieConsentConfig.purposes[element].scripts;

        if (elemList[i].checked) {
            for (var prop in cookieList) {
                document.cookie = prop + "=1;";
            }
            document.cookie = elemList[i].id + "=1;";
        } else {
            for (var prop in cookieList) {
                document.cookie = prop + "=0;";
            }
            document.cookie = elemList[i].id + "=0;";
        }
    }

    var a = new Date();
    a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * cookieConsentConfig.cookieExpiresAfterDays);
    document.cookie = "name=consentCookie; consentCookie=1; expires=" + a.toGMTString() + "; path=/;";

    document.getElementById('cookieConsentBar').style.display = 'none';
    document.getElementById('cookieConsentContainer').style.display = 'none';
    document.getElementById('revokeCookieConsentSettings').style.display = 'block';
    modalIsOpen = 0;
    if (reload === 1) {
        window.location.reload();
        reload = 0;
    }
}

function closeCookieConsent() {
    document.getElementById('cookieConsentContainer').style.display = 'none';
    modalIsOpen = 0;
}

function loadAllCookies() {

}

function loadConsent(loadArray) {
    for (var p in loadArray) {
        if (loadArray.hasOwnProperty(p)) {
            loadConsentFunction(p, loadArray[p], document.body)
        }
    }
}

function loadConsentFunction(url, implementationCode, location) {
    /* load File */
    var loadConsentJSFile = function (url, location) {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        location.appendChild(scriptTag);
    };

    /* load Code from File */
    if (url != '') {
        loadConsentJSFile(url, location);
    }

    var script = document.createElement("script");
    script.onload = script.onerror = function () {
        this.remove();
    };
    script.src = "data:text/plain;base64," + btoa(implementationCode);
    location.appendChild(script);
}

function checkCookieSettings() {
    loadCookieBar = 0;
    for (var p in cookieConsentConfig.purposes) {
        var pContent = cookieConsentConfig.purposes[p];
        if (Object.keys(pContent.scripts).length) {
            var consentCookieContent = getConsentCookie(p);
            if (consentCookieContent == '') {
                loadCookieBar = 1;
            }

            for (var z in pContent.scripts) {
                var consentSubCookieContent = getConsentCookie(z);
                if (consentSubCookieContent == '') {
                    loadCookieBar = 1;
                    consentCookieContent = 0;
                }
                cookieContent[z] = consentSubCookieContent;
            }
            cookieContent[p] = consentCookieContent;
        }
    }
}

function blockAllActionsOnSite() {
    if (cookieConsentConfig.blockActions) {
        document.body.style.overflow = 'hidden';

        var div = document.createElement('div');
        div.className = p.type + 'dontTouch';
        document.body.appendChild(div);

    }
}

function unblockAllActionsOnSite() {
    document.querySelector('.dontTouch').style.display = 'none';
}

function getCookieStatusFromModal() {

}

function getCookieStatusFromBar() {

}

function blockThirdPartyIframe() {

}

function blockThirdPartyScripts() {

}

/**
 * Is Do-Not-Track in Browser-Settings set
 * https://medium.com/farewill/how-to-detect-and-use-do-not-track-on-your-website-77f21f62be48
 * @returns {boolean}
 */

function isDoNotTrackEnabled() {
    const doNotTrackOption = (
        window.doNotTrack || // Main Way at modern Browsers
        window.navigator.doNotTrack || //Internet Explorer 11 and older versions of Edge
        window.navigator.msDoNotTrack // Internet Explorer 9 and 10
    )

    if (!doNotTrackOption) {
        return false
    }

    if (
        doNotTrackOption.charAt(0) === '1' ||
        doNotTrackOption === 'yes' // Prior to Gecko 32, Firefox used the values yes, no or unspecified instead.
    ) {
        return true
    }

    return false
}

/**
 * https://medium.com/snips-ai/how-to-block-third-party-scripts-with-a-few-lines-of-javascript-f0b08b9c4c0
 * @returns {string|boolean}
 */

/*
Get CookieContent
*/
function getConsentCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadScripts() {
    loadCookieBar = 0;
    for (var p in cookieConsentConfig.purposes) {
        var pContent = cookieConsentConfig.purposes[p];
        if (Object.keys(pContent.scripts).length) {
            var consentCookieContent = getConsentCookie(p);
            if (consentCookieContent == 1) {
                var type = cookieConsentConfig.purposes[p].type;
                setSrc(type);
            }

            for (var z in pContent.scripts) {
                var consentSubCookieContent = getConsentCookie(z);
                if (consentSubCookieContent == 1) {
                    var type = pContent.scripts[z].type;
                    setSrc(type);
                }
            }
        }
    }
}

function setSrc(type) {
    var elemList = document.querySelectorAll('[data-name=' + type + ']');
    for (var i = 0, n = elemList.length; i < n; i++) {
        var domType = elemList[i].localName;
        var dataSrc = elemList[i].getAttribute('data-src');
        elemList[i].setAttribute('src', '');
        if (domType === 'iframe') {
            var html = "";
            elemList[i].innerHTML = html;
            reload = 1;
        }
        if (dataSrc != null) {
            if (domType === 'script') {
                loadFuntion(dataSrc, '');
            } else {
                elemList[i].src = dataSrc;
            }
        } else {
            if (domType === 'script') {
                var implementationCode = elemList[i].innerHTML;
                loadFunction('', implementationCode);
            }
        }
    }
}

function loadFiles(loadArray) {
    for (var p in loadArray) {
        if (loadArray.hasOwnProperty(p)) {
            loadFunction(p, loadArray[p], document.body)
        }
    }
}

function loadFunction(url, implementationCode) {
    /* load File */
    var loadJSFile = function (url, location) {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        dosument.body.appendChild(scriptTag);
    };
    /* load Code */

    if (url != '') {
        loadJSFile(url, location);
    }

    var script = document.createElement("script");
    script.onload = script.onerror = function () {
        this.remove();
    };
    script.src = "data:text/plain;base64," + btoa(implementationCode);
    document.body.appendChild(script);

}

function unloadScripts() {

}

/*
        *
        * Cookie Consent Configuration
        *
        */

//onReady(loadCookieConsentInitial);
document.addEventListener("DOMContentLoaded", function () {
    loadCookieConsentInitial();
});
