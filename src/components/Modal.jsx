/**
 * Accessible modal dialog component using @headlessui/react Dialog.
 * Implements focus trapping, Escape to close, overlay click to close,
 * and proper ARIA attributes. Styled with Tailwind for centered overlay
 * with backdrop blur.
 * @module components/Modal
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Size-to-Tailwind max-width class mapping.
 * @type {Record<string, string>}
 */
const SIZE_CLASSES = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
};

/**
 * Modal component for displaying accessible dialog overlays.
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is currently open
 * @param {function} props.onClose - Callback invoked when the modal should close
 * @param {string} [props.title] - Optional title displayed in the modal header
 * @param {React.ReactNode} props.children - Content to render inside the modal body
 * @param {string} [props.size='md'] - Size of the modal: 'sm', 'md', or 'lg'
 * @returns {React.ReactElement} The Modal component
 */
function Modal({ isOpen, onClose, title, children, size }) {
  const maxWidthClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${maxWidthClass} transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all`}
              >
                {/* Header */}
                {title && (
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Close dialog"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Close button when no title */}
                {!title && (
                  <div className="flex justify-end px-6 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Close dialog"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Body */}
                <div className="px-6 py-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

Modal.propTypes = {
  /** Whether the modal is currently open */
  isOpen: PropTypes.bool.isRequired,
  /** Callback invoked when the modal should close */
  onClose: PropTypes.func.isRequired,
  /** Optional title displayed in the modal header */
  title: PropTypes.string,
  /** Content to render inside the modal body */
  children: PropTypes.node.isRequired,
  /** Size of the modal */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

Modal.defaultProps = {
  title: null,
  size: 'md',
};

export default Modal;