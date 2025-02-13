import { useRef, useEffect } from 'react';
import Quagga, { QuaggaJSResultObject } from '@ericblade/quagga2';

interface ScannerProps {
  isbnHandler: (isbn: string) => void;
}

const BarcodeScanner = ({ isbnHandler }: ScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  let alreadyScanned = false;

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
    if (alreadyScanned) {
      return;
    }

    if (data.codeResult.code) {
      alreadyScanned = true;
      await Quagga.stop();
      Quagga.offDetected();
      isbnHandler(data.codeResult.code);
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
    getVideoStream();
    initScanner();
  }, []);

  return (
    <div>
      <p>Scan barcode with camera</p>
      <video ref={videoRef} autoPlay></video>
    </div>
  );
};

export default BarcodeScanner;
