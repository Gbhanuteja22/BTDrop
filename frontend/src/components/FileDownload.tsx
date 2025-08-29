import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { downloadFiles, getDownloadUrl } from '../lib/api';

function FileDownload() {
  const [code, setCode] = useState(['', '', '', '']);
  const [submitCode, setSubmitCode] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['download', submitCode],
    queryFn: () => downloadFiles(submitCode!),
    enabled: !!submitCode,
  });

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newCode = ['', '', '', ''];
    
    for (let i = 0; i < pastedText.length; i++) {
      newCode[i] = pastedText[i];
    }
    
    setCode(newCode);
    
    // Focus the last filled input or the first empty one
    const focusIndex = Math.min(pastedText.length, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 4) {
      setSubmitCode(fullCode);
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      const fullCode = code.join('');
      setSubmitCode(fullCode);
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="text-2xl font-light text-white">Searching for files...</p>
            <p className="text-white/50 font-light">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (data && data.data && data.data.files.length > 0) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-light text-white">Files Ready!</h3>
            <p className="text-white/70 font-light text-sm">{data.data.files.length} file(s) available</p>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-3">
            {data.data.files.map((file: any, index: number) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-light text-sm truncate">{file.originalName}</p>
                    <p className="text-white/40 text-xs font-light">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
                <a
                  href={getDownloadUrl(submitCode!, file.id)}
                  download={file.originalName}
                  className="px-3 py-1.5 bg-white text-black rounded-lg font-light text-xs hover:bg-gray-100 transition-all duration-300 flex-shrink-0 ml-2 glow-interactive"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setCode(['', '', '', '']);
            setSubmitCode(null);
          }}
          className="w-full py-3 bg-white text-black rounded-xl font-light hover:bg-gray-100 transition-all duration-300 magic-button glow-interactive mt-auto"
        >
          Download More Files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col" onPaste={handlePaste}>
      <div className="space-y-4">
        <h3 className="text-2xl font-light text-white">Enter Code</h3>
        <p className="text-white/50 font-light">Enter your 4-digit code</p>
      </div>
      
      {/* Individual Digit Input Boxes */}
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <div className="flex justify-center space-x-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative group">
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={code[index]}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-3xl font-light bg-transparent glass-morph rounded-2xl focus:border-white/50 focus:outline-none text-white transition-all duration-500 focus:scale-105 focus:shadow-lg focus:shadow-white/10 glow-interactive focus-morph"
                maxLength={1}
                autoComplete="off"
              />
              <div className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                code[index] 
                  ? 'bg-white/5 border border-white/30' 
                  : 'group-hover:bg-white/[0.02]'
              }`}></div>
            </div>
          ))}
        </div>
        
        {/* Paste hint */}
        <div className="text-center">
          <p className="text-white/30 text-xs font-light">
            Type digits or paste code with Ctrl+V
          </p>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!code.every(digit => digit !== '') || isLoading}
          className={`w-full py-3 rounded-xl font-light text-lg transition-all duration-500 button-morph ${
            code.every(digit => digit !== '') && !isLoading
              ? 'bg-white text-black hover:bg-gray-100 magic-button glow-interactive'
              : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </span>
          ) : (
            'Find Files'
          )}
        </button>
      </div>
    </div>
  );
}

export default FileDownload;
