import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocuments } from '../api/client';

export default function Sidebar({ onUploadSuccess, sessionId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setStatus(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setStatus(null);

    try {
      const data = await uploadDocuments(selectedFiles, sessionId);
      setStatus({
        type: 'success',
        message: `${data.message} (${data.chunks_created} chunks generated)`,
      });
      setSelectedFiles([]);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">DocuQuery AI</h1>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Upload Knowledge Base (.pdf, .txt)
          </label>
          
          <input
            type="file"
            multiple
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition duration-150 shadow-sm"
          >
            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Processing Documents...' : 'Upload & Process'}
          </button>

          {status && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center border-t pt-4">
        Powered by FastAPI & Gemini 1.5
      </div>
    </aside>
  );
}