import type { Component } from 'solid-js';
import type { Folder } from '../types/email';

interface FolderTreeProps {
  folders: Folder[];
  selectedFolder: Folder | null;
  onFolderSelect: (folder: Folder) => void;
}

const FolderTree: Component<FolderTreeProps> = (props) => {
  const getFolderIcon = (folderType: string) => {
    switch (folderType) {
      case 'INBOX':
        return '📥';
      case 'SENT':
        return '📤';
      case 'DRAFTS':
        return '📝';
      case 'TRASH':
        return '🗑️';
      case 'SPAM':
        return '🚫';
      default:
        return '📁';
    }
  };

  const getFolderColor = (folderType: string) => {
    switch (folderType) {
      case 'INBOX':
        return 'text-blue-600 dark:text-blue-400';
      case 'SENT':
        return 'text-green-600 dark:text-green-400';
      case 'DRAFTS':
        return 'text-orange-600 dark:text-orange-400';
      case 'TRASH':
        return 'text-red-600 dark:text-red-400';
      case 'SPAM':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Sort folders: INBOX first, then SENT, then other special folders, then custom folders alphabetically
  const sortedFolders = () => {
    return [...props.folders].sort((a, b) => {
      const priority = {
        'INBOX': 0,
        'SENT': 1,
        'DRAFTS': 2,
        'TRASH': 3,
        'SPAM': 4,
        'CUSTOM': 5
      };

      const aPriority = priority[a.folder_type as keyof typeof priority] ?? 5;
      const bPriority = priority[b.folder_type as keyof typeof priority] ?? 5;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.display_name.localeCompare(b.display_name);
    });
  };

  return (
    <div class="p-2">
      <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Folders
      </h3>
      
      <div class="space-y-1">
        {sortedFolders().map((folder) => (
          <button
            class={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              props.selectedFolder?.id === folder.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => props.onFolderSelect(folder)}
          >
            <div class="flex items-center space-x-2">
              <span class={`text-lg ${getFolderColor(folder.folder_type)}`}>
                {getFolderIcon(folder.folder_type)}
              </span>
              <span class="truncate">
                {folder.display_name}
              </span>
            </div>
            
            <div class="flex items-center space-x-1">
              {folder.unread_count > 0 && (
                <span class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {folder.unread_count}
                </span>
              )}
              {folder.message_count > 0 && folder.unread_count === 0 && (
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {folder.message_count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {props.folders.length === 0 && (
        <div class="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
          <span class="text-sm">No folders found</span>
          <br />
          <span class="text-xs">Sync your account to load folders</span>
        </div>
      )}
    </div>
  );
};

export default FolderTree;