import { createSignal, onMount } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
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
    <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 class="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to SlopMail
        </h1>

        <div class="space-y-4">
          <input
            id="greet-input"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            value={name()}
          />

          <button
            class="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
            onClick={() => greet()}
          >
            Greet
          </button>

          {greetMsg() && (
            <p class="mt-4 text-center text-gray-700 dark:text-gray-300">{greetMsg()}</p>
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
