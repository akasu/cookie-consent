cookieConsentConfig = {
    'cookieName': 'consentCookie',
    'cookieExpiresAfterDays': 365,
    'default': true,
    'mustConsent': true,
    'consentLang': 'de',
    'blockActions': false,
    'text': {
        'consentBarText': 'We collect and process your personal information for the following purposes: Analytics, Security, Livechat, Advertising, Styling.',
        'consentBarButtonAllowAllText': 'Alle erlauben',
        'consentBarButtonSaveText': 'Alle speichern',
        'consentBarButtonMoreInformationText': 'mehr Informationen',
        'consentHeadline': 'Cookie-Einstellungen',
        'consentDescription': 'Cookie Beschreibung',
        'saveCookieConsentSettingsButtonText': 'Speichern',
        'abortCookieConsentSettingsButtonText': 'Abbrechen',
        'markAllCookieConsentSettingsButtonText': 'Alle auswählen',
        'revokeConsentButtonText': 'Revoke Cookies',
        'activateAll': 'Alle aktivieren',
        'deactivateAll': 'Alle deaktiveren'
    },
    'purposes': {
        'required': {
            'type': 'required',
            'name': 'Benötigte Cookies',
            'description': '',
            'status': 'required',
            'scripts': {}
        },
        'marketing': {
            'type': 'marketing',
            'name': 'Cookies für Marketing-Auswertungen',
            'groupDescription': 'Wir verwenden diese Art der Cookies für die Erfolgsanalyse unserer Marketingaktionen',
            'status': '',
            'scripts': {
                'google-analytics2': {
                    'type': 'google-analytics2',
                    'name': 'Google Analytics',
                    'cookiename': 'ga_'
                },
            }
        },
        'analytics': {
            'type': 'analytics',
            'name': 'Website-Analyse',
            'groupDescription': 'Wir verwendiese diese Cookies für die Analyse des Nutzerverhaltens auf unserer Seite. Weiterhin ermöglichen uns diese Analysetools die frühzeitige Erkennung von Fehlern auf unserer Webseite.',
            'status': '',
            'scripts': {
                'google-analytics': {
                    'type': 'google-analytics',
                    'name': 'Google Analytics',
                    'cookiename': 'ga_'
                },
                'wp-stats': {
                    'type': 'wp-stats',
                    'name': 'Wordpress Statistik',
                    'cookiename': 'wpstats_'
                },
            }
        },
        'socialmedia': {
            'type': 'socialmedia',
            'name': 'Cookies für Marketing-Auswertungen',
            'groupDescription': 'Wir verwenden diese Art der Cookies für die Erfolgsanalyse unserer Marketingaktionen',
            'status': '',
            'scripts': {
                'google-analytics3': {
                    'type': 'google-analytics3',
                    'name': 'Google Analytics3',
                    'cookiename': 'ga_'
                },
                'youtube': {
                    'type': 'youtube',
                    'name': 'Youtube',
                    'cookiename': 'yt_'
                },
            }
        }
    }
}
