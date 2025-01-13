/**
 * Create BarcodeReader configuration
 *
 * @param hostElem The host element hosting the BarcodeReader
 */
export function createBarcodeReaderConfig(hostElem) {
  // see: https://docs.strich.io/reference/interfaces/Configuration.html
  return {
    selector: hostElem,
    engine: {
      symbologies: ['code128', 'qr'], // this is just an example: enable only what you need!
      duplicateInterval: 2500
    }
  }
}

/**
 * The STRICH SDK license key, see: https://docs.strich.io/getting-started.html#creating-a-license-key
 */
export function sdkLicenseKey() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMDRmMTI1My1lNWRlLTQzYTEtYTQ0ZC04YTk3YjUxZGQ5NDMiLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cHM6Ly9naXRodWIuY29tL2Zlcm5hbmRvc2cvYmFyY29kZXNpaS1sZWN0b3IiLCJodHRwczovL2ludmVybWFyLWNoZWNrcG9pbnRzLWM5MjY2YzViMzY3OC5oZXJva3VhcHAuY29tLyJdLCJpYXQiOjE3MzY1NDQzMzksIm5iZiI6MTczNjU0NDMzOSwiY2FwYWJpbGl0aWVzIjp7fSwidmVyc2lvbiI6MX0.JEV1ohwjqpS8GdY8QjICoCHSh68FIXwktIyzOY9maXg'
}
