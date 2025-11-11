import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import type { Account, AddAccountRequest } from '../types/email';

interface AccountSetupProps {
  onClose: () => void;
  onAccountAdded: (account: Account) => void;
}

const AccountSetup: Component<AccountSetupProps> = (props) => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [protocol, setProtocol] = createSignal('IMAP');
  const [imapServer, setImapServer] = createSignal('');
  const [imapPort, setImapPort] = createSignal(993);
  const [smtpServer, setSmtpServer] = createSignal('');
  const [smtpPort, setSmtpPort] = createSignal(587);
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [useSsl, setUseSsl] = createSignal(true);
  const [testing, setTesting] = createSignal(false);
  const [adding, setAdding] = createSignal(false);
  const [error, setError] = createSignal('');

  // Auto-fill common provider settings
  const handleEmailChange = (email: string) => {
    setEmail(email);
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return;

    // Common email provider settings
    const providers: Record<string, any> = {
      'gmail.com': {
        imapServer: 'imap.gmail.com',
        imapPort: 993,
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587,
        username: email,
      },
      'outlook.com': {
        imapServer: 'outlook.office365.com',
        imapPort: 993,
        smtpServer: 'smtp-mail.outlook.com',
        smtpPort: 587,
        username: email,
      },
      'yahoo.com': {
        imapServer: 'imap.mail.yahoo.com',
        imapPort: 993,
        smtpServer: 'smtp.mail.yahoo.com',
        smtpPort: 587,
        username: email,
      },
      'icloud.com': {
        imapServer: 'imap.mail.me.com',
        imapPort: 993,
        smtpServer: 'smtp.mail.me.com',
        smtpPort: 587,
        username: email,
      },
    };

    const provider = providers[domain];
    if (provider) {
      setImapServer(provider.imapServer);
      setImapPort(provider.imapPort);
      setSmtpServer(provider.smtpServer);
      setSmtpPort(provider.smtpPort);
      setUsername(provider.username);
    }
  };

  const testConnection = async () => {
    if (!imapServer() || !username() || !password()) {
      setError('Please fill in all required fields');
      return;
    }

    setTesting(true);
    setError('');

    try {
      const success = await invoke('test_account_connection', {
        protocol: protocol(),
        imapServer: imapServer(),
        imapPort: imapPort(),
        smtpServer: smtpServer(),
        smtpPort: smtpPort(),
        username: username(),
        password: password(),
        useSsl: useSsl(),
      });

      if (success) {
        setError('');
        alert('Connection test successful!');
      } else {
        setError('Connection test failed. Please check your settings.');
      }
    } catch (error) {
      setError(`Connection test failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const handleAddAccount = async () => {
    if (!name() || !email() || !imapServer() || !username() || !password()) {
      setError('Please fill in all required fields');
      return;
    }

    setAdding(true);
    setError('');

    try {
      const account = await invoke('add_account', {
        name: name(),
        email: email(),
        protocol: protocol(),
        imapServer: imapServer(),
        imapPort: imapPort(),
        smtpServer: smtpServer(),
        smtpPort: smtpPort(),
        username: username(),
        password: password(),
        useSsl: useSsl(),
      }) as Account;

      props.onAccountAdded(account);
    } catch (error) {
      setError(`Failed to add account: ${error}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Add Email Account
            </h2>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={props.onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div class="p-6 space-y-6">
          {/* Basic Information */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Personal Gmail"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={email()}
                  onInput={(e) => handleEmailChange(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>

          {/* Server Settings */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Server Settings</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protocol
              </label>
              <select
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={protocol()}
                onInput={(e) => setProtocol(e.currentTarget.value)}
              >
                <option value="IMAP">IMAP</option>
                <option value="POP3">POP3</option>
                <option value="JMAP">JMAP</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IMAP Server
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="imap.gmail.com"
                  value={imapServer()}
                  onInput={(e) => setImapServer(e.currentTarget.value)}
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IMAP Port
                </label>
                <input
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={imapPort()}
                  onInput={(e) => setImapPort(parseInt(e.currentTarget.value))}
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="smtp.gmail.com"
                  value={smtpServer()}
                  onInput={(e) => setSmtpServer(e.currentTarget.value)}
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={smtpPort()}
                  onInput={(e) => setSmtpPort(parseInt(e.currentTarget.value))}
                />
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Credentials</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="your-email@gmail.com"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Your password or app password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="useSsl"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={useSsl()}
                onChange={(e) => setUseSsl(e.currentTarget.checked)}
              />
              <label for="useSsl" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Use SSL/TLS
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error() && (
            <div class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={props.onClose}
          >
            Cancel
          </button>
          
          <div class="space-x-3">
            <button
              class="px-4 py-2 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50"
              onClick={testConnection}
              disabled={testing()}
            >
              {testing() ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={handleAddAccount}
              disabled={adding()}
            >
              {adding() ? 'Adding...' : 'Add Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;