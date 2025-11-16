import React from 'react';
import { X } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  description: string;
  mediaUrl: string;
  onDismiss?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  description,
  mediaUrl,
  onDismiss,
  primaryActionLabel = "What's new?",
  onPrimaryAction,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden my-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <img
          className="absolute h-full w-full object-cover"
          src={mediaUrl}
          alt={title}
        />
      </div>

      <div className="p-4 flex justify-between items-center">
        {onDismiss && (
            <button
                onClick={onDismiss}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline"
            >
                Dismiss
            </button>
        )}
        {onPrimaryAction && primaryActionLabel && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPrimaryAction();
            }}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {primaryActionLabel}
          </a>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
