"use client";

import { useEffect, useRef, useState } from "react";
import { VideoOff } from "lucide-react";

export default function CameraView({ width = "100%", height = "auto", className = "" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mountedRef.current = true;

    async function startCamera() {
      if (!mountedRef.current || document.hidden) return;
      setLoading(true);
      setError("");

      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error("Your browser does not support webcam access. Try Chrome, Edge, or Safari.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });

        if (!mountedRef.current || document.hidden) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (!mountedRef.current || document.hidden) return;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Camera access denied. Allow camera permissions in your browser to continue.");
        } else {
          setError(err.message || "Could not open webcam. Make sure your camera is connected.");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    function stopCamera() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      } else {
        startCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startCamera();

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCamera();
    };
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl border border-canvas-border bg-canvas-card p-6 text-center ${className}`}>
        <VideoOff className="h-10 w-10 text-rose-400 mb-3" />
        <p className="text-sm font-medium text-text-primary">{error}</p>
        <p className="mt-1 text-xs text-text-secondary max-w-xs">
          An active webcam is required for the mock interview simulation.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-canvas-border bg-canvas-mid ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-canvas-mid text-text-secondary">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-canvas-border border-t-gold-500" />
          <span className="font-mono text-xs">Accessing camera…</span>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover scale-x-[-1]"
        style={{ aspectRatio: "16/9" }}
      />

      {!loading && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-canvas/80 px-2.5 py-1 text-[10px] font-mono text-emerald-400 backdrop-blur-sm border border-canvas-border">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          LIVE FEED
        </div>
      )}
    </div>
  );
}
