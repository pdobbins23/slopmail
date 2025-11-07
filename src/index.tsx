/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';

const root = document.getElementById('root');

// Guard access to import.meta.env so editors/TypeScript don't complain in environments
// where ImportMeta or its env property may be missing or untyped.
const isDev = (() => {
  try {
    // Prefer Vite/Tauri style env when available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (import.meta as any) !== 'undefined') {
      return Boolean((import.meta as any).env?.DEV);
    }
  } catch {
    // ignore and continue to fallback
  }
  try {
    // Fallback to Node-like environment variables
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((globalThis as any).process?.env?.NODE_ENV === 'development');
  } catch {
    return false;
  }
})();

if (isDev && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => <App />, root!);
