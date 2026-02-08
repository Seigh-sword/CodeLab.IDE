import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { SiPython, SiTypescript } from 'react-icons/si';
import { VscPlay, VscLoading } from 'react-icons/vsc';
import { runPythonCode } from './engine';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('import numpy as np\nprint("Hello from CodeLab!")\nprint(np.sqrt(25))');
  const [terminal, setTerminal] = useState<string>('Welcome to CodeLab IDE... Ready to run! 🚀');
  const [running, setRunning] = useState<boolean>(false);

  const handleRun = async () => {
    setRunning(true);
    setTerminal('Initializing Wasm environment... 🛠️\n');
    await runPythonCode(code, (out) => {
      setTerminal((prev) => prev + '\n' + out);
    });
    setRunning(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', color: '#fff' }}>
      <header style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SiPython color="#3776ab" size={20} />
          <b style={{ letterSpacing: '1px' }}>CODELAB IDE</b>
        </div>
        <button 
          onClick={handleRun} 
          disabled={running}
          style={{ background: '#2ea44f', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {running ? <VscLoading className="spin" /> : <VscPlay />} Run Code
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, borderRight: '1px solid #333' }}>
          <Editor height="100%" theme="vs-dark" defaultLanguage="python" value={code} onChange={(v) => setCode(v || '')} />
        </div>
        <div style={{ flex: 0.4, background: '#000', padding: '15px', overflowY: 'auto', borderLeft: '1px solid #333' }}>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase' }}>Console Output</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#00ff00' }}>{terminal}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;