import Quagga, { QuaggaJSResultObject } from '@ericblade/quagga2';
import { useEffect, useRef } from 'react';

import { eanToIsbn, validateIsbn } from '../util/isbnUtils';

interface BarcodeScannerProps {
  isbnHandler: (isbn: string) => Promise<boolean> | boolean;
}

const BarcodeScanner = ({ isbnHandler }: BarcodeScannerProps) => {
  const stopStreamRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const restartScanning = useRef(false);

  let alreadyScanned: boolean;

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      const stopFunc = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };
      stopStreamRef.current = stopFunc;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Cannot access camera', error);
    }
  };

  const stopVideoStream = () => {
    if (stopStreamRef.current) {
      stopStreamRef.current();
    }
  };

  const validateCodeResult = (data: QuaggaJSResultObject, errorThreshold: number) => {
    // extracts the error value for each decoded number in the barcode
    const decodedCodeErrors = data.codeResult.decodedCodes
      .filter((code) => code.code !== undefined)
      .map((code) => code.error)
      .filter((error) => error !== undefined);
    if (Math.max(...decodedCodeErrors) > errorThreshold) {
      // if error value for some number in the barcode is higher than threshold, reject the result
      return false;
    }
    return true;
  };

  const handleBarcodeDetection = async (data: QuaggaJSResultObject) => {
    const code = data.codeResult.code;
    if (alreadyScanned || !code) {
      return;
    }

    const isbn = eanToIsbn(code);
    if (!validateIsbn(isbn)) {
      return;
    }

    if (!validateCodeResult(data, 0.16)) {
      return;
    }

    alreadyScanned = true;
    await Quagga.stop();

    // if isbnHandler returns true, restarts scanner after 3000ms
    restartScanning.current = await isbnHandler(code);
    if (restartScanning.current) {
      setTimeout(() => {
        restartScanning.current = false;
        alreadyScanned = false;
        void initScanner();
      }, 3000);
    }
  };

  const initScanner = async () => {
    if (!videoRef.current) {
      return;
    }

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
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      },
    );
    Quagga.onDetected(async (data) => await handleBarcodeDetection(data));
  };

  useEffect(() => {
    alreadyScanned = false;
    void getVideoStream();
    void initScanner();
    return () => {
      stopVideoStream();
      void Quagga.stop();
    };
  }, []);

  return (
    <section>
      <video autoPlay={true} playsInline={true} muted={true} ref={videoRef}></video>
    </section>
  );
};

export default BarcodeScanner;
