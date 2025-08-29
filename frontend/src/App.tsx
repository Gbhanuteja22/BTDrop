import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FileUpload from './components/FileUpload'
import FileDownload from './components/FileDownload'
import './index.css'

const queryClient = new QueryClient()

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload')
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </QueryClientProvider>
  )
}

function AppContent({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: 'upload' | 'download'
  setActiveTab: (tab: 'upload' | 'download') => void 
}) {
  const [hoveredTab, setHoveredTab] = useState<'upload' | 'download' | null>(null);
  return (
    <div className="min-h-screen bg-black text-white font-display overflow-hidden relative glow-cursor">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-apple-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl animate-apple-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/[0.015] rounded-full blur-3xl animate-apple-float" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="text-center py-8 px-8 relative z-20">
          <h1 className="text-7xl font-graffiti white-brightness-title tracking-wide mb-4 transform hover:scale-105 transition-transform duration-300">
            BTDrop
          </h1>
          <p className="text-white/50 text-xl font-ultralight max-w-2xl mx-auto leading-relaxed">
            Share files seamlessly
          </p>
        </header>
        <div className="flex-1 max-w-7xl mx-auto px-4 py-2">
          <div className="hidden lg:grid gap-8 h-full max-h-[calc(100vh-120px)]">
            {activeTab === 'upload' ? (
              <div className="lg:grid-cols-3 grid gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex flex-col glass-morph p-2 rounded-2xl wand-hover">
                    <button
                      onClick={() => setActiveTab('upload')}
                      onMouseEnter={() => setHoveredTab('upload')}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-6 py-4 rounded-xl font-light text-lg transition-all duration-300 ${
                        hoveredTab === 'upload'
                          ? 'bg-white text-black shadow-lg'
                          : hoveredTab === 'download'
                          ? 'text-white/30'
                          : activeTab === 'upload'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60'
                      }`}
                    >
                      Send Files
                    </button>
                    <button
                      onClick={() => setActiveTab('download')}
                      onMouseEnter={() => setHoveredTab('download')}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-6 py-4 rounded-xl font-light text-lg transition-all duration-300 ${
                        hoveredTab === 'download'
                          ? 'bg-white text-black shadow-lg'
                          : hoveredTab === 'upload'
                          ? 'text-white/30'
                          : activeTab === 'download'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60'
                      }`}
                    >
                      Receive Files
                    </button>
                  </div>
                  <div className="glass-morph wand-hover rounded-2xl p-4">
                    <h3 className="text-lg font-light text-white mb-3">How to Send</h3>
                    <div className="space-y-2 text-white/60 text-sm font-light">
                      <p>• Drag & drop any number of files</p>
                      <p>• Total size limit: 2GB combined</p>
                      <p>• Choose sharing type (1-to-1 or 1-to-many)</p>
                      <p>• Get a 4-digit code to share</p>
                      <p>• Files expire in 24 hours</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="glass-morph wand-hover rounded-2xl p-6 shadow-2xl h-full overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <FileUpload />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:grid-cols-3 grid gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex flex-col glass-morph p-2 rounded-2xl wand-hover">
                    <button
                      onClick={() => setActiveTab('upload')}
                      onMouseEnter={() => setHoveredTab('upload')}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-6 py-4 rounded-xl font-light text-lg transition-all duration-300 ${
                        hoveredTab === 'upload'
                          ? 'bg-white text-black shadow-lg'
                          : hoveredTab === 'download'
                          ? 'text-white/30'
                          : activeTab === 'upload'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60'
                      }`}
                    >
                      Send Files
                    </button>
                    <button
                      onClick={() => setActiveTab('download')}
                      onMouseEnter={() => setHoveredTab('download')}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-6 py-4 rounded-xl font-light text-lg transition-all duration-300 ${
                        hoveredTab === 'download'
                          ? 'bg-white text-black shadow-lg'
                          : hoveredTab === 'upload'
                          ? 'text-white/30'
                          : activeTab === 'download'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60'
                      }`}
                    >
                      Receive Files
                    </button>
                  </div>
                  <div className="glass-morph wand-hover rounded-2xl p-4">
                    <h3 className="text-lg font-light text-white mb-3">How to Receive</h3>
                    <div className="space-y-2 text-white/60 text-sm font-light">
                      <p>• Enter the 4-digit code you received</p>
                      <p>• Or paste the code with Ctrl+V</p>
                      <p>• Download files individually</p>
                      <p>• Files are deleted after download</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="glass-morph wand-hover rounded-2xl p-6 shadow-2xl h-full overflow-hidden">
                    <FileDownload />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="glass-morph wand-hover rounded-2xl p-6 shadow-2xl h-full overflow-hidden">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-light text-white mb-2">Files will appear here</h3>
                      <p className="text-white/50 text-sm font-light">Enter a valid code to view shared files</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <div className="flex justify-center mb-8">
              <div className="flex glass-morph magic-button glow-interactive p-2 rounded-3xl">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-8 py-4 rounded-2xl font-light text-lg transition-all duration-500 hover:scale-[1.02] glow-interactive ${
                    activeTab === 'upload'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Send
                </button>
                <button
                  onClick={() => setActiveTab('download')}
                  className={`px-8 py-4 rounded-2xl font-light text-lg transition-all duration-500 hover:scale-[1.02] glow-interactive ${
                    activeTab === 'download'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Receive
                </button>
              </div>
            </div>
            <div className="glass-morph wand-hover rounded-3xl p-8 shadow-2xl">
              <div className="transition-all duration-1000 ease-out">
                {activeTab === 'upload' ? <FileUpload /> : <FileDownload />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
