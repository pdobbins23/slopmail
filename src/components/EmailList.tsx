import type { Component } from 'solid-js';
import type { Email } from '../types/email';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  loading: boolean;
}

const EmailList: Component<EmailListProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatSender = (email: Email) => {
    if (email.from_name) {
      return email.from_name;
    }
    return email.from_address.split('@')[0];
  };

  return (
    <div class="h-full flex flex-col">
      {/* Header */}
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Inbox</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {props.emails.length} messages
        </p>
      </div>

      {/* Email List */}
      <div class="flex-1 overflow-y-auto">
        {props.loading ? (
          <div class="flex items-center justify-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : props.emails.length === 0 ? (
          <div class="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <p class="text-center">
              <span class="block text-lg font-medium">No messages</span>
              <span class="text-sm">Your inbox is empty</span>
            </p>
          </div>
        ) : (
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            {props.emails.map((email) => (
              <div
                class={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  props.selectedEmail?.id === email.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : email.is_read
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-blue-50/50 dark:bg-gray-700/50'
                }`}
                onClick={() => props.onEmailSelect(email)}
              >
                <div class="flex items-start space-x-3">
                  {/* Sender Avatar */}
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {formatSender(email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <span class={`text-sm ${
                        email.is_read
                          ? 'text-gray-900 dark:text-gray-300 font-medium'
                          : 'text-gray-900 dark:text-white font-semibold'
                      }`}>
                        {formatSender(email)}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(email.internal_date)}
                      </span>
                    </div>

                    <div class={`text-sm mb-1 ${
                      email.is_read
                        ? 'text-gray-700 dark:text-gray-400'
                        : 'text-gray-900 dark:text-gray-200 font-medium'
                    }`}>
                      {email.subject || '(No Subject)'}
                    </div>

                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {email.body_text ? (
                        email.body_text.substring(0, 100) + (email.body_text.length > 100 ? '...' : '')
                      ) : (
                        '(No content)'
                      )}
                    </div>

                    {/* Email indicators */}
                    <div class="flex items-center mt-2 space-x-2">
                      {email.is_flagged && (
                        <span class="text-yellow-500" title="Flagged">
                          ⭐
                        </span>
                      )}
                      {email.has_attachments && (
                        <span class="text-gray-400" title="Has attachments">
                          📎
                        </span>
                      )}
                      {!email.is_read && (
                        <span class="w-2 h-2 bg-blue-600 rounded-full" title="Unread"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;