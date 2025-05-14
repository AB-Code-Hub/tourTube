import { useState } from "react";
import axios from "../api/client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { FiUpload, FiImage, FiVideo, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function UploadPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnailFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState({
    video: null,
    thumbnail: null,
  });
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      // Create preview for files
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews(prev => ({
        ...prev,
        [name === "videoFile" ? "video" : "thumbnail"]: previewUrl
      }));
    }

    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const removeFile = (type) => {
    if (type === "video") {
      setForm(prev => ({ ...prev, videoFile: null }));
      setPreviews(prev => ({ ...prev, video: null }));
    } else {
      setForm(prev => ({ ...prev, thumbnailFile: null }));
      setPreviews(prev => ({ ...prev, thumbnail: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.videoFile || !form.thumbnailFile) {
      toast.error("Please select both video and thumbnail files");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("video", form.videoFile);
    formData.append("thumbnail", form.thumbnailFile);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axios.post("/videos/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Video uploaded successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen py-8 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiUpload className="text-blue-500" />
          Upload Video
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell viewers about your video"
              rows="4"
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block mb-2 font-medium">Thumbnail</label>
            {previews.thumbnail ? (
              <div className="relative group">
                <img 
                  src={previews.thumbnail} 
                  alt="Thumbnail preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile("thumbnail")}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="text-3xl mb-2 opacity-70" />
                  <p className="text-sm">Upload thumbnail image</p>
                  <p className="text-xs opacity-60">JPEG, PNG (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  name="thumbnailFile" 
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block mb-2 font-medium">Video</label>
            {previews.video ? (
              <div className="relative group">
                <video
                  src={previews.video}
                  className="w-full h-48 object-cover rounded-lg bg-black"
                  controls
                />
                <button
                  type="button"
                  onClick={() => removeFile("video")}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiVideo className="text-3xl mb-2 opacity-70" />
                  <p className="text-sm">Upload your video</p>
                  <p className="text-xs opacity-60">MP4, WebM (Max 100MB)</p>
                </div>
                <input 
                  type="file" 
                  name="videoFile" 
                  accept="video/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="pt-2">
              <div className={`h-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className={`h-full rounded-full ${
                    uploadProgress < 100 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                />
              </div>
              <p className="text-right text-sm mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isUploading}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload />
                Upload Video
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}