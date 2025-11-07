import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import './styles/app.css';

const App: Component = () => {
  const [greetMsg, setGreetMsg] = createSignal<string>('');
  const [name, setName] = createSignal<string>('');

  async function greet(): Promise<void> {
    try {
      const res = (await invoke('greet', { name: name() })) as string;
      setGreetMsg(res);
    } catch (err) {
      // Present a safe, user-friendly message and log for debugging
      setGreetMsg('Failed to fetch greeting');
      // eslint-disable-next-line no-console
      console.error('greet error', err);
    }
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
            onInput={(e: InputEvent) => {
              const target = e.currentTarget as HTMLInputElement;
              setName(target.value);
            }}
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
};

export default App;
