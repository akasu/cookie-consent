/*
    *
    * Old Code
    *
    *
    * */

/*
Set CookieFiles and JS-Code
*/

class OldConsent {
    socialCookie = getCookie('socialCookie');
    marketingCookie = getCookie('marketingCookie');
    analyticsCookie = getCookie('analyticsCookie');
    var cookieStatus = getCookie('consentCookie');

    loadMarketing = {
        'test.js': 'alert("LoadMarketing")'
    }

    loadAnalytics = {
        '': "(function (i, s, o, g, r, a, m) {\n" +
            "      i['GoogleAnalyticsObject'] = r;\n" +
            "      i[r] = i[r] || function () {\n" +
            "         (i[r].q = i[r].q || []).push(arguments)\n" +
            "      }, i[r].l = 1 * new Date();\n" +
            "      a = s.createElement(o),\n" +
            "         m = s.getElementsByTagName(o)[0];\n" +
            "      a.async = 1;\n" +
            "      a.src = g;\n" +
            "      m.parentNode.insertBefore(a, m)\n" +
            "   })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');\n" +
            "   ga('create', 'UA-259356-2', 'auto');\n" +
            "   ga('set', 'anonymizeIp', true);\n" +
            "   ga('send', 'pageview');"
    }

    loadSocial = {
        'test.js': 'alert("LoadSocial")'
    }

    /*
if CookieStatus == false, then show CookieBar
*/
    if(cookieStatus == 0) {
        document.getElementById('cookieConsent').style.display = 'block';
    } else {
        revokeCookies = 1;
        if(socialCookie == 1) {
            document.getElementById('loadSocial').checked = true;
            loadFiles(loadSocial);
        }
        if(analyticsCookie == 1) {
            document.getElementById("loadAnalytics").checked = true;
            loadFiles(loadAnalytics);
        }
        if(marketingCookie ==1) {
            document.getElementById("loadMarketing").checked = true;
            loadFiles(loadMarketing);
        }
        document.getElementById('revokeCookieSettings').style.display = 'block';
    }

    function loadFiles(loadArray) {
        for (var p in loadArray) {
            if( loadArray.hasOwnProperty(p) ) {
                loadFunction(p, loadArray[p], document.body)
            }
        }
    }

    function loadFunction(url, implementationCode, location) {
        /* load File */
        var loadJSFile = function(url, location){
            var scriptTag = document.createElement('script');
            scriptTag.src = url;
            location.appendChild(scriptTag);
        };
        /* load Code */

        if(url != '') {
            loadJSFile(url, location);
        }

        var script = document.createElement("script");
        script.onload = script.onerror = function(){ this.remove(); };
        script.src = "data:text/plain;base64," + btoa(implementationCode);
        location.appendChild(script);
    }

}




