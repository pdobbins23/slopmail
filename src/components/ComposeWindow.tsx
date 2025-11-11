import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import type { Account } from '../types/email';

interface ComposeWindowProps {
  account: Account | null;
  onSend: (emailData: any) => void;
  onCancel: () => void;
}

const ComposeWindow: Component<ComposeWindowProps> = (props) => {
  const [to, setTo] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [bodyText, setBodyText] = createSignal('');
  const [sending, setSending] = createSignal(false);

  const handleSend = async () => {
    if (!props.account || !to() || !subject()) {
      alert('Please fill in recipient and subject');
      return;
    }

    setSending(true);
    try {
      const emailData = {
        to: to().split(',').map(email => email.trim()),
        subject: subject(),
        bodyText: bodyText() || undefined,
        bodyHtml: undefined, // TODO: Add rich text editor
      };

      await props.onSend(emailData);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please check your settings and try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onCancel();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div class="h-full flex flex-col" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            New Message
          </h2>
          <div class="flex items-center space-x-2">
            <button
              class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={props.onCancel}
            >
              Cancel
            </button>
            <button
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSend}
              disabled={sending() || !to() || !subject()}
            >
              {sending() ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Compose Form */}
      <div class="flex-1 p-4">
        <div class="space-y-4">
          {/* From */}
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
              From:
            </label>
            <div class="flex-1">
              <div class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {props.account ? `${props.account.name} <${props.account.email}>` : 'No account selected'}
              </div>
            </div>
          </div>

          {/* To */}
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
              To:
            </label>
            <input
              type="email"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="recipient@example.com"
              value={to()}
              onInput={(e) => setTo(e.currentTarget.value)}
              multiple
            />
          </div>

          {/* Subject */}
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
              Subject:
            </label>
            <input
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email subject"
              value={subject()}
              onInput={(e) => setSubject(e.currentTarget.value)}
            />
          </div>

          {/* Body */}
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message:
            </label>
            <textarea
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Type your message here..."
              rows={15}
              value={bodyText()}
              onInput={(e) => setBodyText(e.currentTarget.value)}
            />
          </div>

          {/* Formatting Toolbar (placeholder) */}
          <div class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <button class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="Bold">
              <strong>B</strong>
            </button>
            <button class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="Italic">
              <em>I</em>
            </button>
            <button class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="Underline">
              <u>U</u>
            </button>
            <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <button class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="Attach file">
              📎
            </button>
            <button class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="Insert link">
              🔗
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span>Ctrl+Enter to send</span>
            <span class="mx-2">•</span>
            <span>Esc to cancel</span>
          </div>
          <div>
            {bodyText().length} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeWindow;