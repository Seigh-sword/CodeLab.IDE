import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { SiPython } from 'react-icons/si';
import { VscPlay, VscLoading, VscTerminal, VscLayout, VscCircleFilled } from 'react-icons/vsc';
import { runPythonCode } from './engine';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('codelab_code') || 'import numpy as np\nprint("CodeLab IDE ready")';
  });
  const [terminal, setTerminal] = useState<string>('Console initialized.');
  const [running, setRunning] = useState<boolean>(false);
  const [engineReady, setEngineReady] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('codelab_code', code);
  }, [code]);

  const handleRun = async () => {
    setRunning(true);
    setTerminal('Running code...');
    await runPythonCode(code, (out: string) => {
      setTerminal((prev) => prev + '\n' + out);
      setEngineReady(true);
    });
    setRunning(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', color: '#fff', overflow: 'hidden' }}>
      
      {/* Header Bar */}
      <header style={{ padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2d2d2d', borderBottom: '1px solid #000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SiPython color="#3776ab" size={18} />
          <span style={{ fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.5px' }}>CODELAB IDE</span>
        </div>
        <button 
          onClick={handleRun} 
          disabled={running} 
          style={{ 
            background: '#2ea44f', color: 'white', border: 'none', padding: '5px 20px', 
            borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', 
            gap: '5px', fontWeight: 'bold' 
          }}
        >
          {running ? <VscLoading className="spin-animation" /> : <VscPlay />} RUN
        </button>
      </header>

      {/* Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Pane: Editor and Terminal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '35px', background: '#2d2d2d', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
            <div style={{ background: '#1e1e1e', padding: '0 15px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '11px', borderTop: '1px solid #007acc' }}>
              main.py
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <Editor 
              height="100%" 
              theme="vs-dark" 
              defaultLanguage="python" 
              value={code} 
              onChange={(v) => setCode(v || '')} 
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }} 
            />
          </div>
          
          <div style={{ height: '200px', background: '#1e1e1e', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '5px 15px', background: '#252526', fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <VscTerminal /> TERMINAL
            </div>
            <pre style={{ flex: 1, margin: 0, padding: '10px', overflowY: 'auto', fontSize: '12px', color: '#fff', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {terminal}
            </pre>
          </div>
        </div>

        {/* Right Pane: Window Preview */}
        <div style={{ width: '400px', background: '#000', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 15px', fontSize: '11px', color: '#aaa', background: '#252526', borderBottom: '1px solid #333' }}>
            <VscLayout /> WINDOW PREVIEW
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <canvas id="canvas" style={{ maxWidth: '100%', maxHeight: '100%', background: '#000' }}></canvas>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer style={{ height: '22px', background: '#007acc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '11px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <VscCircleFilled color={engineReady ? '#4ec9b0' : '#ffa500'} /> 
            {engineReady ? 'System: Wasm Environment Active' : 'System: Waiting for first execution'}
          </div>
        </div>
        <div>UTF-8</div>
      </footer>

    </div>
  );
};

export default App;