import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  QrCode,
  Link as LinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./QRScanner.css";

const isValidUrl = (text) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

const checkUrlSafety = async (url) => {
  try {
    const unsafePatterns = [
      /^(ftp|telnet|file):\/\//i,
      /\.(exe|dll|bat|sh|cmd)$/i,
      /^data:/i,
      /^javascript:/i,
    ];
    return !unsafePatterns.some((pattern) => pattern.test(url));
  } catch {
    return false;
  }
};

const detectCategory = (text) => {
  if (isValidUrl(text)) return "url";
  if (text.startsWith("WIFI:")) return "wifi";
  if (text.startsWith("BEGIN:VCARD")) return "contact";
  if (text.length > 100) return "text";
  return "other";
};

export function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchScans, setBatchScans] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("qr-scan-history");
    return saved ? JSON.parse(saved) : [];
  });
  const scannerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("qr-scan-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isScanning && scannerRef.current === null) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
        },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          const isUrl = isValidUrl(decodedText);
          const category = detectCategory(decodedText);
          const isSafe = isUrl ? await checkUrlSafety(decodedText) : true;

          const newScan = {
            id: Date.now().toString(),
            result: decodedText,
            timestamp: Date.now(),
            isUrl,
            isSafe,
            category,
          };

          if (isBatchMode) {
            setBatchScans((prev) => [
              ...prev,
              { ...newScan, status: "success" },
            ]);
            toast.success("QR Code scanned successfully!", {
              icon: "📸",
              duration: 2000,
            });
          } else {
            setScanResult(decodedText);
            setHistory((prev) => [newScan, ...prev]);
            scannerRef.current?.clear();
          }

          if (navigator.vibrate) {
            navigator.vibrate(200);
          }

          if (isUrl && !isSafe) {
            toast.error("Warning: This URL might be unsafe!", {
              icon: "⚠️",
              duration: 4000,
            });
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning, isBatchMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="qr-container"
    >
      <div className="qr-header">
        <div className="qr-title">
          <QrCode className="qr-icon" />
          <h2 className="qr-heading">QR Code Scanner</h2>
        </div>
      </div>
      <div id="qr-reader" className="qr-reader" />
      {scanResult && (
        <div className="qr-result">
          <h3 className="qr-result-title">Scan Result:</h3>
          {isValidUrl(scanResult) ? (
            <a href={scanResult} target="_blank" rel="noopener noreferrer" className="qr-link">
              <LinkIcon className="qr-link-icon" />
              {scanResult}
            </a>
          ) : (
            <p className="qr-result-text">{scanResult}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
