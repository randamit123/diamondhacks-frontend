import { useEffect, useState } from "react";
import { io,Socket } from "socket.io-client";

// Define the type for the 'socket' prop
interface WebSocketCallProps {
    socket: Socket;
  }

  const WebSocketCall: React.FC<WebSocketCallProps> = ({ socket }) => {
    const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for 'frame' events emitted by the Flask server
    socket.on("frame", ({ image }) => {
      // Create a Blob from the received image bytes
      const blob = new Blob([image], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      // Update the images state to display the new image
      setImages(prevImages => [...prevImages, imageUrl]);
    });

    // Cleanup event listener when component unmounts
    return () => {
      socket.off("frame");
    };
  }, [socket]);

  return (
    <div>
      <h2>Streaming Frames from Flask Server</h2>
      <div>
        {images.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Frame ${index}`} style={{ width: "100%", marginBottom: "10px" }} />
        ))}
      </div>
    </div>
  );
}
