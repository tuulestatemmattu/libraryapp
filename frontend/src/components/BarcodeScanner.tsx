import { useRef, useEffect, useState } from 'react';
import Quagga, { QuaggaJSResultObject } from '@ericblade/quagga2';

interface ScannerProps {
  isbnHandler: (isbn: string) => Promise<boolean> | boolean;
}

const BarcodeScanner = ({ isbnHandler }: ScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const restartScanning = useRef(false);

  let alreadyScanned: boolean;
  let detectedCodes: { [key: string]: number };

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Cannot access camera', error);
    }
  };

  const handleBarcodeDetection = async (data: QuaggaJSResultObject) => {
    const code = data.codeResult.code;
    if (alreadyScanned || !code) {
      return;
    }

    detectedCodes[code] = ++detectedCodes[code] || 1;
    if (Object.keys(detectedCodes).length >= 3) {
      setShowWarning(true);
    }

    if (detectedCodes[code] >= 5) {
      alreadyScanned = true;
      await Quagga.stop();

      // if isbnHandler returns true, restarts scanner after 3000ms
      restartScanning.current = await isbnHandler(code);

      if (restartScanning.current) {
        setTimeout(() => {
          restartScanning.current = false;
          alreadyScanned = false;
          detectedCodes = {};
          initScanner();
        }, 3000);
      }
    }
  };

  const initScanner = async () => {
    if (videoRef.current) {
      await Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoRef.current,
          },
          decoder: {
            readers: ['ean_reader'],
          },
          frequency: 20,
        },
        async function (err) {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Initialization finished. Ready to start');
          Quagga.start();
        },
      );
      Quagga.onDetected(async (data) => await handleBarcodeDetection(data));
    }
  };

  useEffect(() => {
    alreadyScanned = false;
    detectedCodes = {};
    getVideoStream();
    initScanner();
  }, []);

  return (
    <section>
      {showWarning && <p>Warning: Many different codes have been scanned.</p>}
      <h3>Scan barcode with camera</h3>
      <video ref={videoRef} autoPlay></video>
    </section>
  );
};

export default BarcodeScanner;
