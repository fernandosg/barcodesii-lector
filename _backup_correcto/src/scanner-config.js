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
      symbologies: ['pdf417'], // this is just an example: enable only what you need!
      duplicateInterval: 2500
    }
  }
}

/**
 * The STRICH SDK license key, see: https://docs.strich.io/getting-started.html#creating-a-license-key
 */
export function sdkLicenseKey() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMmI3ZGE1ZC0zY2I2LTQ1NDgtYTIwZi1kNzkyNmNlNDNiZjciLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cHM6Ly9yYWlscy1wcm9kdWN0aW9uLTBmZjQudXAucmFpbHdheS5hcHAiLCJodHRwczovL2Zlcm5hbmRvc2cuZ2l0aHViLmlvL2JhcmNvZGVzaWktbGVjdG9yIl0sImlhdCI6MTczNjc5MTg1OCwibmJmIjoxNzM2NzkxODU4LCJjYXBhYmlsaXRpZXMiOnt9LCJ2ZXJzaW9uIjoxfQ.zW_RQOVsv02Tg6ijmFvltneV5mhs7DeofoifHK5swFg'
}
