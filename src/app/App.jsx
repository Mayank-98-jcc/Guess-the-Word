import { useEffect, useRef, useState, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";

const featureCards = [
  {
    title: "Private by design",
    text: "Your PDF stays on your device. The conversion runs in the browser and never needs an upload to a server.",
  },
  {
    title: "Built for speed",
    text: "Smart page-by-page extraction keeps the flow responsive and gives users clear progress during conversion.",
  },
  {
    title: "Ready to download",
    text: "When the Word file is prepared, users get a direct download button with a clean generated filename.",
  },
];

const steps = [
  "Drop in a PDF",
  "Read pages locally",
  "Build Word document",
  "Download the file",
];

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getWordFilename(fileName) {
  const baseName = fileName.replace(/\.pdf$/i, "") || "converted-document";
  return `${baseName}.docx`;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Drop in a PDF to begin");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  function clearDownload() {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setDownloadUrl("");
    setDownloadName("");
  }

  function handleFileSelection(file) {
    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    if (!isPdf) {
      setError("Please choose a PDF file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Please use a PDF smaller than 50 MB for a smooth browser conversion.");
      return;
    }

    startTransition(() => {
      setError("");
      setStatus("PDF ready for conversion");
      setProgress(0);
      clearDownload();
      setSelectedFile(file);
    });
  }

  async function handleConvert() {
    if (!selectedFile || isConverting) {
      return;
    }

    clearDownload();
    setError("");
    setIsConverting(true);
    setProgress(4);
    setStatus("Opening PDF securely in your browser");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const { convertPdfToWord } = await import("../lib/pdfToWord");
      const blob = await convertPdfToWord(arrayBuffer, {
        onProgress: ({ progress: nextProgress, message }) => {
          setProgress(nextProgress);
          setStatus(message);
        },
      });

      const nextDownloadUrl = URL.createObjectURL(blob);
      setDownloadUrl(nextDownloadUrl);
      setDownloadName(getWordFilename(selectedFile.name));
      setProgress(100);
      setStatus("Conversion complete. Your Word file is ready.");
    } catch (conversionError) {
      setError(conversionError.message || "Something went wrong while converting the PDF.");
      setStatus("Conversion failed");
      setProgress(0);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh mesh-one" />
        <div className="mesh mesh-two" />
        <div className="mesh mesh-three" />
        <div className="grid-fade" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <motion.header
          className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100/80 backdrop-blur-md">
              PDF to Word Converter
            </span>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Convert PDF to Word with a safer, faster, animated experience.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Drop in a PDF, convert it locally in the browser, and download a Word document when it is ready. No forced sign-up, no server upload, and clear progress the whole way through.
            </p>
          </div>

          <div className="glass-panel max-w-sm rounded-[2rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
              Safety Promise
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Files are handled on-device for privacy. This setup is best for text-based PDFs and keeps the original file untouched.
            </p>
          </div>
        </motion.header>

        <div className="grid flex-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-7 lg:p-8"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
                  Converter
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  Upload, convert, download
                </h2>
              </div>
              <div className="text-sm text-slate-300">
                Max file size: 50 MB
              </div>
            </div>

            <motion.label
              className={`upload-zone mt-8 flex min-h-[320px] cursor-pointer flex-col justify-between rounded-[1.75rem] border px-5 py-5 sm:px-6 sm:py-6 ${
                isDragging ? "upload-zone-active" : ""
              }`}
              htmlFor="pdf-upload"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFileSelection(event.dataTransfer.files?.[0]);
              }}
            >
              <input
                ref={fileInputRef}
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) => handleFileSelection(event.target.files?.[0])}
              />

              <div>
                <div className="upload-icon">
                  <span />
                </div>
                <h3 className="mt-6 font-display text-3xl text-white">
                  {selectedFile ? selectedFile.name : "Drop your PDF here"}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} ready. We will extract text page by page and package it into a Word document.`
                    : "Choose a PDF from your device or drag it into this area. The conversion happens inside the browser to keep the process private."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose PDF
                </button>
                <span className="text-sm text-slate-400">
                  PDF to editable Word download
                </span>
              </div>
            </motion.label>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-bar"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(78,227,255,0.28)] disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-200 disabled:shadow-none"
                whileTap={{ scale: 0.98 }}
                onClick={handleConvert}
                disabled={!selectedFile || isConverting}
              >
                {isConverting ? "Converting..." : "Convert to Word"}
              </motion.button>

              <a
                href={downloadUrl || undefined}
                download={downloadName || undefined}
                className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                  downloadUrl
                    ? "border-white/30 bg-white/10 text-white hover:bg-white/16"
                    : "pointer-events-none border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                Download Word File
              </a>
            </div>
          </motion.section>

          <div className="grid gap-8">
            <motion.section
              className="glass-panel rounded-[2rem] p-6 sm:p-7"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
                Flow
              </p>
              <div className="mt-5 space-y-4">
                {steps.map((step, index) => {
                  const stepProgress = progress >= index * 25 + 5;

                  return (
                    <motion.div
                      key={step}
                      className={`step-row ${stepProgress ? "step-row-active" : ""}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.12 * index }}
                    >
                      <div className="step-index">{index + 1}</div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                          Step {index + 1}
                        </p>
                        <p className="mt-1 text-lg font-medium text-white">{step}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              className="grid gap-4"
              initial={{ opacity: 0, y: 38 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.24 }}
            >
              {featureCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="glass-panel rounded-[1.75rem] p-6"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.16 * index }}
                >
                  <p className="font-display text-2xl text-white">{card.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
                </motion.article>
              ))}
            </motion.section>
          </div>
        </div>
      </section>
    </main>
  );
}
