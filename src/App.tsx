import { createSignal, onMount } from 'solid-js';
import { invoke } from '@tauri-apps/api/tauri';
import './styles/app.css';

function App() {
  const [greetMsg, setGreetMsg] = createSignal('');
  const [name, setName] = createSignal('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name: name() }));
  }

  onMount(() => {
    console.log('SlopMail initialized');
  });

  return (
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Welcome to SlopMail
        </h1>

        <div class="space-y-4">
          <input
            id="greet-input"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            value={name()}
          />

          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            onClick={() => greet()}
          >
            Greet
          </button>

          {greetMsg() && (
            <p class="text-center text-gray-700 dark:text-gray-300 mt-4">
              {greetMsg()}
            </p>
          )}
        </div>

        <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>A modern, privacy-focused email client</p>
          <p class="mt-2">Built with Tauri, SolidJS, and Rust</p>
        </div>
      </div>
    </div>
  );
}

export default App;
