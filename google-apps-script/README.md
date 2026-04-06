# Google Apps Script for Wolffia QR payments

File [Code.gs](/Users/tt/Desktop/Website%20AI/Wolffia%20landing%20page/google-apps-script/Code.gs) receives the form payload from the landing page, saves uploaded payment screenshots into Google Drive, and appends a row into the Google Sheet:

- [Target sheet](https://docs.google.com/spreadsheets/d/12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg/edit?gid=0#gid=0)

## Deploy

1. Open the existing Apps Script project that backs `formDestination`.
2. Replace its current code with the content of `Code.gs`.
3. Click `Deploy` -> `Manage deployments`.
4. Edit the current Web App deployment or create a new one.
5. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
6. Authorize the script when prompted so it can use Sheets and Drive.
7. If Google gives you a new `/exec` URL, update `formDestination` in [landingConfig.js](/Users/tt/Desktop/Website%20AI/Wolffia%20landing%20page/src/config/landingConfig.js#L11).

## What gets saved

- Customer info and package details
- `submissionStatus` such as `free_reservation` or `deposit_paid`
- Screenshot metadata
- Public Drive link of the uploaded screenshot
- A ready-to-render `=IMAGE("...")` formula in the `screenshotFormula` column
- Full raw payload for debugging

## Notes

- The script uses the first sheet tab by default.
- Uploaded screenshots are stored in a Drive folder named `Wolffia Payment Uploads`.
- The landing page already sends `screenshotBase64`, `screenshotMimeType`, `screenshotFileName`, and the destination sheet URL, so no frontend change is needed beyond what is already in repo.
