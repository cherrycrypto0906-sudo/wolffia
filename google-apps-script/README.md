# Google Apps Script for Wolffia QR payments

File [Code.gs](/Users/tt/Desktop/Website%20AI/Wolffia%20landing%20page/google-apps-script/Code.gs) receives the survey payload from the landing page, saves uploaded images when present, and appends a row into the Google Sheet:

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

- `submittedAt`, `submissionStatus`, `surveyName`, `leadSource`
- Customer info: `name`, `phone`
- Survey answers: `persona`, `challenges`, `desiredBenefit`, `giftInterest`, `note`
- Destination metadata for debugging
- Screenshot metadata and Drive link when the form includes an image
- A ready-to-render `=IMAGE("...")` formula in the `screenshotFormula` column
- Full raw payload for debugging

## Notes

- The script uses the first sheet tab by default unless you pass `sheetName`.
- Uploaded images are stored in a Drive folder named `Wolffia Uploads`.
- The current landing page sends survey fields directly, including multiple selected `challenges`.
