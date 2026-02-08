let pyodideInstance: any = null;

async function getPyodide(onOutput: (out: string) => void) {
    if (pyodideInstance) return pyodideInstance;

    onOutput("Initializing WebAssembly runtime...");
    // @ts-ignore
    pyodideInstance = await window.loadPyodide();
    await pyodideInstance.loadPackage("micropip");
    return pyodideInstance;
}

export async function runPythonCode(code: string, onOutput: (out: string) => void) {
    try {
        const pyodide = await getPyodide(onOutput);
        const micropip = pyodide.pyimport("micropip");

        // Scan for imports and map to browser-optimized packages
        const importRegex = /^(?:from|import)\s+([\w.]+)/gm;
        const matches = Array.from(code.matchAll(importRegex), m => m[1].split('.')[0]);
        const uniqueLibs = [...new Set(matches)];

        for (const lib of uniqueLibs) {
            const isStandard = pyodide.runPython(`import sys; '${lib}' in sys.modules or '${lib}' in sys.builtin_module_names`);
            
            if (!isStandard) {
                onOutput(`Installing ${lib} from remote repository...`);
                try {
                    const pkgMap: { [key: string]: string } = {
                        'pygame': 'pygame-ce',
                        'OpenGL': 'PyOpenGL'
                    };
                    await micropip.install(pkgMap[lib] || lib);
                } catch (e) {
                    onOutput(`System: Failed to install ${lib} or it is a built-in.`);
                }
            }
        }

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        pyodide.canvas.setCanvas2D(canvas);
        
        pyodide.setStdout({
            batched: (str: string) => onOutput(str)
        });

        onOutput("Execution started.");
        await pyodide.runPythonAsync(code);
        
    } catch (err: any) {
        onOutput(`\n[Fatal Error]: ${err.message}`);
    }
}