/**
 * ViewToggle component for switching between table and card views
 */

import React from 'react';
import { TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import type { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white">
      <button
        onClick={() => onChange('table')}
        className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
          viewMode === 'table'
            ? 'bg-openvino-purple text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Table view"
        aria-pressed={viewMode === 'table'}
      >
        <TableCellsIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => onChange('card')}
        className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l border-gray-300 transition-colors ${
          viewMode === 'card'
            ? 'bg-openvino-purple text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Card view"
        aria-pressed={viewMode === 'card'}
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
    </div>
  );
};
