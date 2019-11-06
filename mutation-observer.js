const blacklisted = [
    /google/,
    /matomo/,
    /youtube/,
    /vimeo/,
    /facebook/,
    /twitter/,
    /yandex/,
    /hotjar/,
    /jquery/,
    ];

const whitelisted = [
    /cookie-consent/,
];

const TYPE_ATTRIBUTE = 'javascript/blocked'

const patterns = {
    blacklist: blacklisted,
    whitelist: whitelisted
}

// Backup list containing the original blacklisted script elements
const backupScripts = {
    blacklisted: []
}


const isOnBlacklist = (src, type) => (
    src && (!type || type !== TYPE_ATTRIBUTE) && (
        (!patterns.blacklist || patterns.blacklist.some(pattern => pattern.test(src))) && (!patterns.whitelist || patterns.whitelist.every(pattern => !pattern.test(src)))
    )
)

const willBeUnblocked = function(script) {
    const src = script.getAttribute('src')
    return (
        patterns.blacklist && patterns.blacklist.every(entry => !entry.test(src)) ||
        patterns.whitelist && patterns.whitelist.some(entry => entry.test(src))
    )
}

const observer = new MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i++) {
        const { addedNodes } = mutations[i];
        for(let i = 0; i < addedNodes.length; i++) {
            const node = addedNodes[i]
            // For each added script tag
            if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
                const src = node.src
                const type = node.type
                console.log(node);
                // If the src is inside the blacklist and is not inside the whitelist
                if(isOnBlacklist(src, type)) {
                    // We backup a copy of the script node
                    backupScripts.blacklisted.push(node.cloneNode())

                    // Blocks inline script execution in Safari & Chrome
                    node.type = TYPE_ATTRIBUTE

                    // Firefox has this additional event which prevents scripts from beeing executed
                    const beforeScriptExecuteListener = function (event) {
                        // Prevent only marked scripts from executing
                        if(node.getAttribute('type') === TYPE_ATTRIBUTE)
                            event.preventDefault()
                        node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener)
                    }
                    node.addEventListener('beforescriptexecute', beforeScriptExecuteListener)

                    // Remove the node from the DOM
                    node.parentElement && node.parentElement.removeChild(node)
                }
            }
        }
    }
})

// Starts the monitoring
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})

const createElementBackup = document.createElement

// Monkey patch the createElement method to prevent dynamic scripts from executing
document.createElement = function(...args) {
    // If this is not a script tag, bypass
    if(args[0].toLowerCase() !== 'script')
        return createElementBackup.bind(document)(...args)

    const scriptElt = createElementBackup.bind(document)(...args)
    const originalSetAttribute = scriptElt.setAttribute.bind(scriptElt)

    // Define getters / setters to ensure that the script type is properly set
    Object.defineProperties(scriptElt, {
        'src': {
            get() {
                return scriptElt.getAttribute('src')
            },
            set(value) {
                if(isOnBlacklist(value, scriptElt.type)) {
                    originalSetAttribute('type', TYPE_ATTRIBUTE)
                }
                originalSetAttribute('src', value)
                return true
            }
        },
        'type': {
            set(value) {
                const typeValue =
                    isOnBlacklist(scriptElt.src, scriptElt.type) ?
                        TYPE_ATTRIBUTE :
                        value
                originalSetAttribute('type', typeValue)
                return true
            }
        }
    })

    // Monkey patch the setAttribute function so that the setter is called instead
    scriptElt.setAttribute = function(name, value) {
        if(name === 'type' || name === 'src')
            scriptElt[name] = value
        else
            HTMLScriptElement.prototype.setAttribute.call(scriptElt, name, value)
    }

    return scriptElt
}

const URL_REPLACER_REGEXP = new RegExp('[|\\{}()[\\]^$+*?.]', 'g')

// Unblocks all (or a selection of) blacklisted scripts.
const unblock = function(...scriptUrlsOrRegexes) {
    if(scriptUrlsOrRegexes.length < 1) {
        patterns.blacklist = []
        patterns.whitelist = []
    } else {
        if(patterns.blacklist) {
            patterns.blacklist = patterns.blacklist.filter(pattern => (
                scriptUrlsOrRegexes.every(urlOrRegexp => {
                    if(typeof urlOrRegexp === 'string')
                        return !pattern.test(urlOrRegexp)
                    else if(urlOrRegexp instanceof RegExp)
                        return pattern.toString() !== urlOrRegexp.toString()
                })
            ))
        }
        if(patterns.whitelist) {
            patterns.whitelist = [
                ...patterns.whitelist,
                ...scriptUrlsOrRegexes
                    .map(urlOrRegexp => {
                        if(typeof urlOrRegexp === 'string') {
                            const escapedUrl = urlOrRegexp.replace(URL_REPLACER_REGEXP, '\\$&')
                            const permissiveRegexp = '.*' + escapedUrl + '.*'
                            if(patterns.whitelist.every(p => p.toString() !== permissiveRegexp.toString())) {
                                return new RegExp(permissiveRegexp)
                            }
                        } else if(urlOrRegexp instanceof RegExp) {
                            if(patterns.whitelist.every(p => p.toString() !== urlOrRegexp.toString())) {
                                return urlOrRegexp
                            }
                        }
                        return null
                    })
                    .filter(Boolean)
            ]
        }
    }


    // Parse existing script tags with a marked type
    const tags = document.querySelectorAll(`script[type="${TYPE_ATTRIBUTE}"]`)
    for(let i = 0; i < tags.length; i++) {
        const script = tags[i]
        if(willBeUnblocked(script)) {
            script.type = 'application/javascript'
            backupScripts.blacklisted.push(script)
            script.parentElement.removeChild(script)
        }
    }

    // Exclude 'whitelisted' scripts from the blacklist and append them to <head>
    let indexOffset = 0;
    [...backupScripts.blacklisted].forEach((script, index) => {
        if(willBeUnblocked(script)) {
            const scriptNode = document.createElement('script')
            scriptNode.setAttribute('src', script.src)
            scriptNode.setAttribute('type', 'application/javascript')
            document.head.appendChild(scriptNode)
            backupScripts.blacklisted.splice(index - indexOffset, 1)
            indexOffset++
        }
    })

    // Disconnect the observer if the blacklist is empty for performance reasons
    if(patterns.blacklist && patterns.blacklist.length < 1) {
        observer.disconnect()
    }
}
