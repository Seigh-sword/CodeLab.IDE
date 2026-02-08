export async function runPythonCode(code: string, onOutput: (out: string) => void) {
    try {
        const pyodide = await (window as any).loadPyodide();
        
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        
        const imports = code.match(/import (\w+)|from (\w+)/g);
        if (imports) {
            onOutput("Detecting libraries and preparing environment... ");
            for (const imp of imports) {
                const pkg = imp.replace('import ', '').replace('from ', '').split(' ')[0].trim();
                try {
                    await micropip.install(pkg);
                } catch (e) {
                    onOutput(`Note: Standard library or unknown package: ${pkg}`);
                }
            }
        }

        pyodide.setStdout({ batched: (str: string) => onOutput(str) });
        
        const result = await pyodide.runPythonAsync(code);
        if (result) onOutput(`\n[Result]: ${result}`);
    } catch (err) {
        onOutput(`\n[Error]: ${err}`);
    }
}