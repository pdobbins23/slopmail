import type { Component } from 'solid-js';
import type { Email } from '../types/email';

interface EmailDetailProps {
  email: Email;
}

const EmailDetail: Component<EmailDetailProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAddresses = (addressesJson: string) => {
    try {
      const addresses = JSON.parse(addressesJson);
      if (Array.isArray(addresses)) {
        return addresses.map((addr: any) => 
          addr.name ? `${addr.name} <${addr.address}>` : addr.address
        ).join(', ');
      }
      return addressesJson;
    } catch {
      return addressesJson;
    }
  };

  return (
    <div class="h-full flex flex-col">
      {/* Email Header */}
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {props.email.subject || '(No Subject)'}
        </h1>

        <div class="flex items-center space-x-4 mb-4">
          {/* Sender Avatar */}
          <div class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
              {(props.email.from_name || props.email.from_address.split('@')[0]).charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Sender Info */}
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {props.email.from_name || props.email.from_address}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {props.email.from_address}
                </div>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(props.email.internal_date)}
              </div>
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div class="space-y-2 text-sm">
          <div class="flex">
            <span class="font-medium text-gray-700 dark:text-gray-300 w-16">To:</span>
            <span class="text-gray-600 dark:text-gray-400">
              {formatAddresses(props.email.to_addresses)}
            </span>
          </div>
          {props.email.cc_addresses && (
            <div class="flex">
              <span class="font-medium text-gray-700 dark:text-gray-300 w-16">Cc:</span>
              <span class="text-gray-600 dark:text-gray-400">
                {formatAddresses(props.email.cc_addresses)}
              </span>
            </div>
          )}
        </div>

        {/* Email Actions */}
        <div class="flex items-center space-x-2 mt-4">
          <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Reply
          </button>
          <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            Forward
          </button>
          <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            Delete
          </button>
          <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            {props.email.is_flagged ? 'Unflag' : 'Flag'}
          </button>
        </div>
      </div>

      {/* Email Body */}
      <div class="flex-1 overflow-y-auto p-6">
        {props.email.body_html ? (
          <div 
            class="prose dark:prose-invert max-w-none"
            innerHTML={props.email.body_html}
          />
        ) : props.email.body_text ? (
          <div class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
            {props.email.body_text}
          </div>
        ) : (
          <div class="text-gray-500 dark:text-gray-400 text-center py-8">
            <p class="text-lg">No content available</p>
            <p class="text-sm mt-2">This email appears to be empty</p>
          </div>
        )}
      </div>

      {/* Attachments */}
      {props.email.attachments && (
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments</h3>
          <div class="space-y-2">
            {(() => {
              try {
                const attachments = JSON.parse(props.email.attachments!);
                return attachments.map((attachment: any) => (
                  <div class="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span class="text-2xl">📎</span>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {attachment.filename}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.content_type} • {attachment.size_bytes} bytes
                      </div>
                    </div>
                    <button class="text-blue-600 hover:text-blue-700 text-sm">
                      Download
                    </button>
                  </div>
                ));
              } catch {
                return null;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;