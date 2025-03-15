/** @type {ScanHistoryItem} */
const scanItem = {
    id: "123",
    result: "https://example.com",
    timestamp: Date.now(),
    isUrl: true,
    isSafe: true,
    category: "url",
  };
  
  /** @type {BatchScanItem} */
  const batchItem = {
    ...scanItem,
    status: "pending",
  };
  