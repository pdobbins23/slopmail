import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ComposeWindow from './components/ComposeWindow';
import AccountSetup from './components/AccountSetup';
import FolderTree from './components/FolderTree';
import type { Account, Email, Folder } from './types/email';

const App: Component = () => {
  const [accounts, setAccounts] = createSignal<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = createSignal<Account | null>(null);
  const [folders, setFolders] = createSignal<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = createSignal<Folder | null>(null);
  const [emails, setEmails] = createSignal<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = createSignal<Email | null>(null);
  const [isComposing, setIsComposing] = createSignal(false);
  const [showAccountSetup, setShowAccountSetup] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  onMount(async () => {
    await loadAccounts();
  });

  const loadAccounts = async () => {
    try {
      const result = (await invoke('get_accounts')) as Account[];
      setAccounts(result);
      if (result.length > 0) {
        setSelectedAccount(result[0]);
        await loadFolders(result[0].id);
      } else {
        setShowAccountSetup(true);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const loadFolders = async (accountId: number) => {
    try {
      setLoading(true);
      const result = (await invoke('get_folders', { accountId })) as Folder[];
      setFolders(result);
      if (result.length > 0) {
        setSelectedFolder(result[0]);
        await loadEmails(result[0].id);
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmails = async (folderId: number) => {
    try {
      setLoading(true);
      const result = (await invoke('get_emails', { folderId, limit: 50, offset: 0 })) as Email[];
      setEmails(result);
    } catch (error) {
      console.error('Failed to load emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account);
    loadFolders(account.id);
  };

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    loadEmails(folder.id);
    setSelectedEmail(null);
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read && selectedAccount()) {
      invoke('mark_email_read', { 
        accountId: selectedAccount()!.id, 
        emailId: email.message_id 
      }).catch(console.error);
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = async (emailData: any) => {
    if (!selectedAccount()) return;
    
    try {
      await invoke('send_email', {
        accountId: selectedAccount()!.id,
        to: emailData.to,
        subject: emailData.subject,
        bodyText: emailData.bodyText,
        bodyHtml: emailData.bodyHtml,
      });
      setIsComposing(false);
      // Refresh sent folder
      const sentFolder = folders().find(f => f.folder_type === 'SENT');
      if (sentFolder) {
        loadEmails(sentFolder.id);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleAccountAdded = async (account: Account) => {
    setShowAccountSetup(false);
    await loadAccounts();
  };

  return (
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">SlopMail</h1>
        </div>
        
        {/* Account Selector */}
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <select
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onChange={(e) => {
              const account = accounts().find(a => a.id === parseInt(e.target.value));
              if (account) handleAccountSelect(account);
            }}
          >
            {accounts().map(account => (
              <option value={account.id}>{account.name} ({account.email})</option>
            ))}
          </select>
          <button
            class="mt-2 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setShowAccountSetup(true)}
          >
            Add Account
          </button>
        </div>

        {/* Folder Tree */}
        <div class="flex-1 overflow-y-auto">
          <FolderTree
            folders={folders()}
            selectedFolder={selectedFolder()}
            onFolderSelect={handleFolderSelect}
          />
        </div>

        {/* Compose Button */}
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleCompose}
          >
            Compose
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div class="flex-1 flex">
        {/* Email List */}
        <div class="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <EmailList
            emails={emails()}
            selectedEmail={selectedEmail()}
            onEmailSelect={handleEmailSelect}
            loading={loading()}
          />
        </div>

        {/* Email Detail or Compose */}
        <div class="flex-1 bg-white dark:bg-gray-800">
          {isComposing() ? (
            <ComposeWindow
              account={selectedAccount()}
              onSend={handleSendEmail}
              onCancel={() => setIsComposing(false)}
            />
          ) : selectedEmail() ? (
            <EmailDetail email={selectedEmail()!} />
          ) : (
            <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div class="text-center">
                <h3 class="text-lg font-medium mb-2">Select an email to read</h3>
                <p class="text-sm">Choose an email from the list to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Setup Modal */}
      {showAccountSetup() && (
        <AccountSetup
          onClose={() => setShowAccountSetup(false)}
          onAccountAdded={handleAccountAdded}
        />
      )}
    </div>
  );
};

export default App;