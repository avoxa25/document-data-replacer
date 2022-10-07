Installed LibreOffice is required:
https://www.libreoffice.org/download/download-libreoffice/

Example of POST request:
```json
{
    "patterns": [{
        "variable": "first",
        "value": "Some text for the first placeholder"
    }]
}
```

Send request without body and placeholdes will be replaced with default patterns.
