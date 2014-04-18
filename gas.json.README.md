You need install gas-manager and create file 'gas.json' for running grunt:gas-upload task and wget task.

*gas.json:*
```json
{
    "target": {
        "credential":   "~/.gas-manager/credential.json",
        "fileId":       "1eoISjT_N9bRU3M83O4DO2KR7lzzKTZa0Qjm0AuV4epp31IJxpZuyQAma",
        "filename":     "",
        "dogetUrl":    "https://script.google.com/macros/s/AKfycbw8qrdeWJxjJNIjTLoEmUTCKgOp1F83bfD1DMyvAf4/dev",
        "dogetCookie": "~/.gas-manager/cookies.txt"
    }
    "jasminebench": {
        "credential":   "~/.gas-manager/credential.json",
        "fileId":       "your-google-apps-script-file-id",
        "filename":     "ExceptionFormatterSpec.js",
        "dogetUrl":     "your-google-apps-script-web-service-url",
        "dogetCookie":  "~/.gas-manager/cookies.txt"
    },
}
```

credential


fileId


filename

- for jasmine self spec checking, filename needs to be "ExceptionFormatterSpec.js".


dogetUrl


dogetCookie
