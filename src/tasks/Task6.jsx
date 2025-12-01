import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OpenAI from "openai";
import { Image, Download, Sparkles, Loader2, Key, X, Save } from "lucide-react";

const Task6 = () => {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [openai, setOpenai] = useState(null);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [numImages, setNumImages] = useState(1);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      try {
        const client = new OpenAI({
          apiKey: savedApiKey,
          dangerouslyAllowBrowser: true,
        });
        setOpenai(client);
      } catch (error) {
        console.error("Error initializing OpenAI client:", error);
        toast.error("Failed to initialize OpenAI client");
      }
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // Save API key to localStorage
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    try {
      // Validate API key format
      if (!apiKey.startsWith("sk-")) {
        toast.warn("API key should start with 'sk-'");
      }
      localStorage.setItem("openai_api_key", apiKey);
      // Initialize OpenAI client with browser-safe configuration
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for browser usage
      });
      setOpenai(client);
      setShowApiKeyInput(false);
      toast.success("API key saved successfully!");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    }
  };

  // Remove API key
  const handleRemoveApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setOpenai(null);
    setShowApiKeyInput(true);
    toast.info("API key removed");
  };

  // Generate images using OpenAI DALL-E
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!openai) {
      toast.error("Please set your OpenAI API key first");
      setShowApiKeyInput(true);
      return;
    }

    setIsGenerating(true);
    try {
      // DALL-E 3 only supports n=1, so we generate sequentially
      const imagesToGenerate = Math.min(numImages, 4);
      const newImages = [];

      for (let i = 0; i < imagesToGenerate; i++) {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1, // DALL-E 3 only supports 1 image per request
          size: imageSize,
          quality: "standard", // or "hd" for higher quality
        });

        if (response.data && response.data.length > 0) {
          response.data.forEach((img, imgIndex) => {
            newImages.push({
              url: img.url,
              prompt: prompt,
              size: imageSize,
              timestamp: new Date().toISOString(),
              id: `${Date.now()}-${i}-${imgIndex}`,
            });
          });
        }
      }

      if (newImages.length > 0) {
        setGeneratedImages((prev) => [...newImages, ...prev]);
        toast.success(`Successfully generated ${newImages.length} image(s)!`);
        setPrompt(""); // Clear prompt after successful generation
      } else {
        toast.warn("No images were generated");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      let errorMessage = "Failed to generate image";
      
      // Handle different error types
      if (error.response) {
        errorMessage = error.response.data?.error?.message || errorMessage;
      } else if (error.error) {
        errorMessage = error.error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Provide user-friendly error messages
      if (errorMessage.includes("insufficient_quota")) {
        errorMessage = "Insufficient API credits. Please add credits to your OpenAI account.";
      } else if (errorMessage.includes("invalid_api_key")) {
        errorMessage = "Invalid API key. Please check your API key.";
      } else if (errorMessage.includes("rate_limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download image
  const handleDownloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-image-${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  // Clear all images
  const handleClearImages = () => {
    setGeneratedImages([]);
    toast.info("Gallery cleared");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              AI Image Generation & Display Widget
            </h1>
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg">
            Generate stunning images using OpenAI's DALL-E 3
          </p>
        </div>

        {/* API Key Management */}
        {showApiKeyInput && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-700">OpenAI API Key Required</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Enter your OpenAI API key to generate images. Your key is stored locally in your browser.
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Key
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>
        )}

        {!showApiKeyInput && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">API Key configured</span>
              </div>
              <button
                onClick={handleRemoveApiKey}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Remove Key
              </button>
            </div>
          </div>
        )}

        {/* Generation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Generate Image</h2>
          
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... (e.g., 'A futuristic cityscape at sunset with flying cars')"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Size
                </label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isGenerating}
                >
                  <option value="1024x1024">1024x1024 (Square)</option>
                  <option value="1792x1024">1792x1024 (Landscape)</option>
                  <option value="1024x1792">1024x1792 (Portrait)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Images (1-4)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={numImages}
                  onChange={(e) => setNumImages(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || !openai}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <Image className="w-6 h-6" />
                Generated Images ({generatedImages.length})
              </h2>
              <button
                onClick={handleClearImages}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-200">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleDownloadImage(image.url, image.prompt)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Download image"
                      >
                        <Download className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{image.size}</span>
                      <span>{new Date(image.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedImages.length === 0 && !isGenerating && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No images generated yet. Enter a prompt above to create your first AI-generated image!
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">How It Works</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Enter a prompt:</strong> Describe the image you want to generate in detail
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Choose settings:</strong> Select image size and number of images (1-4)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Generate:</strong> Click the generate button and wait for your AI masterpiece
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Download:</strong> Save your favorite images to your device
              </span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This uses OpenAI's DALL-E 3 API. You'll need a valid API key with credits.
              Images are generated using your API key and may incur costs.
            </p>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Task6;
