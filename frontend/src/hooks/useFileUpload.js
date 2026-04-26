import { useState, useRef } from "react";
import { API } from "../utils/constants";

const useFileUpload = () => {
  const [file, setFile]           = useState(null);
  const [fileLabel, setFileLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setFileLabel(f.name); }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFileLabel(`✓ indexed — ${data.message || file.name}`);
      setFile(null);
    } catch {
      setFileLabel("Upload failed — is the server running?");
    } finally {
      setUploading(false);
    }
  };

  // called by RemovePDF after successful delete
  const clearFile = () => {
    setFile(null);
    setFileLabel("");
    // also reset the hidden file input so the same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  return { file, fileLabel, uploading, fileRef, onFileChange, upload, clearFile };
};

export default useFileUpload;
