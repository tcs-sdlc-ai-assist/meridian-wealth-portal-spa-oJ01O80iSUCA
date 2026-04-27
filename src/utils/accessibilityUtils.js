/**
 * ARIA and keyboard navigation utilities for accessibility compliance.
 * Provides helpers for applying ARIA attributes, enabling keyboard navigation,
 * trapping focus within containers, and generating common ARIA prop objects.
 * @module accessibilityUtils
 */

/**
 * Apply ARIA attributes to a DOM element.
 * @param {HTMLElement | null} element - The DOM element to apply attributes to
 * @param {string} role - The ARIA role to set (e.g., 'button', 'menu', 'dialog')
 * @param {object} [attributes={}] - Additional ARIA attributes as key-value pairs
 * @returns {void}
 */
export function applyAria(element, role, attributes = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    return;
  }

  if (role && typeof role === 'string') {
    element.setAttribute('role', role);
  }

  if (attributes && typeof attributes === 'object') {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        element.removeAttribute(key);
        return;
      }

      const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
      element.setAttribute(attrName, String(value));
    });
  }
}

/**
 * Enable keyboard navigation on a container element.
 * Supports arrow keys for moving between focusable children,
 * Enter/Space for activation, and Escape for closing/cancelling.
 * @param {HTMLElement | null} container - The container element to enable keyboard navigation on
 * @param {object} [options={}] - Configuration options
 * @param {boolean} [options.vertical=true] - Enable vertical arrow key navigation (ArrowUp/ArrowDown)
 * @param {boolean} [options.horizontal=false] - Enable horizontal arrow key navigation (ArrowLeft/ArrowRight)
 * @param {boolean} [options.wrap=true] - Wrap around when reaching the first/last item
 * @param {function} [options.onEscape=null] - Callback invoked when Escape is pressed
 * @param {function} [options.onEnter=null] - Callback invoked when Enter is pressed on a focused item
 * @param {string} [options.selector='[tabindex], a, button, input, select, textarea'] - Selector for focusable children
 * @returns {function(): void} Cleanup function to remove the event listener
 */
export function enableKeyboardNavigation(container, options = {}) {
  if (!container || !(container instanceof HTMLElement)) {
    return () => {};
  }

  const {
    vertical = true,
    horizontal = false,
    wrap = true,
    onEscape = null,
    onEnter = null,
    selector = '[tabindex], a, button, input, select, textarea',
  } = options;

  function getFocusableChildren() {
    const elements = Array.from(container.querySelectorAll(selector));
    return elements.filter((el) => {
      return (
        !el.disabled &&
        el.tabIndex !== -1 &&
        !el.hasAttribute('aria-hidden') &&
        el.offsetParent !== null
      );
    });
  }

  function handleKeyDown(event) {
    const focusable = getFocusableChildren();
    if (focusable.length === 0) {
      return;
    }

    const currentIndex = focusable.indexOf(document.activeElement);

    let nextIndex = -1;
    let handled = false;

    if (
      (vertical && event.key === 'ArrowDown') ||
      (horizontal && event.key === 'ArrowRight')
    ) {
      event.preventDefault();
      handled = true;
      if (currentIndex < focusable.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (wrap) {
        nextIndex = 0;
      }
    }

    if (
      (vertical && event.key === 'ArrowUp') ||
      (horizontal && event.key === 'ArrowLeft')
    ) {
      event.preventDefault();
      handled = true;
      if (currentIndex > 0) {
        nextIndex = currentIndex - 1;
      } else if (wrap) {
        nextIndex = focusable.length - 1;
      }
    }

    if (event.key === 'Home') {
      event.preventDefault();
      handled = true;
      nextIndex = 0;
    }

    if (event.key === 'End') {
      event.preventDefault();
      handled = true;
      nextIndex = focusable.length - 1;
    }

    if (handled && nextIndex >= 0 && nextIndex < focusable.length) {
      focusable[nextIndex].focus();
    }

    if (event.key === 'Escape' && typeof onEscape === 'function') {
      event.preventDefault();
      onEscape(event);
    }

    if (
      (event.key === 'Enter' || event.key === ' ') &&
      typeof onEnter === 'function'
    ) {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        activeEl.tagName !== 'BUTTON' &&
        activeEl.tagName !== 'A' &&
        activeEl.tagName !== 'INPUT' &&
        activeEl.tagName !== 'SELECT' &&
        activeEl.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        onEnter(event, activeEl);
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Trap focus within a container element (useful for modals and dialogs).
 * When the user tabs past the last focusable element, focus wraps to the first,
 * and vice versa with Shift+Tab.
 * @param {HTMLElement | null} container - The container element to trap focus within
 * @param {object} [options={}] - Configuration options
 * @param {boolean} [options.autoFocus=true] - Automatically focus the first focusable element
 * @param {boolean} [options.restoreFocus=true] - Restore focus to the previously focused element on cleanup
 * @param {function} [options.onEscape=null] - Callback invoked when Escape is pressed
 * @returns {function(): void} Cleanup function to remove the focus trap and restore focus
 */
export function trapFocus(container, options = {}) {
  if (!container || !(container instanceof HTMLElement)) {
    return () => {};
  }

  const {
    autoFocus = true,
    restoreFocus = true,
    onEscape = null,
  } = options;

  const previouslyFocused = document.activeElement;

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  function getFocusableElements() {
    return Array.from(container.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null,
    );
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && typeof onEscape === 'function') {
      event.preventDefault();
      onEscape(event);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  if (autoFocus) {
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      requestAnimationFrame(() => {
        focusable[0].focus();
      });
    } else {
      container.setAttribute('tabindex', '-1');
      requestAnimationFrame(() => {
        container.focus();
      });
    }
  }

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    if (restoreFocus && previouslyFocused && previouslyFocused.focus) {
      try {
        previouslyFocused.focus();
      } catch (_) {
        // Element may no longer be in the DOM
      }
    }
  };
}

/**
 * Generate common ARIA prop objects for various UI patterns.
 * Returns an object of ARIA attributes suitable for spreading onto React elements.
 * @param {'button' | 'menu' | 'menuitem' | 'dialog' | 'alert' | 'tab' | 'tabpanel' | 'listbox' | 'option' | 'combobox' | 'tooltip' | 'navigation' | 'search' | 'status' | 'live'} type - The UI pattern type
 * @param {object} [config={}] - Configuration for the ARIA props
 * @param {string} [config.id] - Element ID for linking ARIA relationships
 * @param {string} [config.label] - Accessible label text
 * @param {string} [config.labelledBy] - ID of the labelling element
 * @param {string} [config.describedBy] - ID of the describing element
 * @param {boolean} [config.expanded] - Whether the element is expanded
 * @param {boolean} [config.selected] - Whether the element is selected
 * @param {boolean} [config.disabled] - Whether the element is disabled
 * @param {boolean} [config.hidden] - Whether the element is hidden
 * @param {boolean} [config.modal] - Whether the dialog is modal
 * @param {boolean} [config.hasPopup] - Whether the element has a popup
 * @param {string} [config.controls] - ID of the controlled element
 * @param {string} [config.owns] - ID of the owned element
 * @param {number} [config.setSize] - Total number of items in the set
 * @param {number} [config.posInSet] - Position within the set (1-based)
 * @param {string} [config.live] - ARIA live region politeness ('polite' | 'assertive' | 'off')
 * @param {boolean} [config.atomic] - Whether the live region should be treated as atomic
 * @returns {object} Object of ARIA props to spread onto a React element
 */
export function getAriaProps(type, config = {}) {
  const {
    id,
    label,
    labelledBy,
    describedBy,
    expanded,
    selected,
    disabled,
    hidden,
    modal,
    hasPopup,
    controls,
    owns,
    setSize,
    posInSet,
    live,
    atomic,
  } = config;

  const baseProps = {};

  if (id !== undefined) {
    baseProps.id = id;
  }
  if (label !== undefined) {
    baseProps['aria-label'] = label;
  }
  if (labelledBy !== undefined) {
    baseProps['aria-labelledby'] = labelledBy;
  }
  if (describedBy !== undefined) {
    baseProps['aria-describedby'] = describedBy;
  }
  if (disabled !== undefined) {
    baseProps['aria-disabled'] = disabled;
  }
  if (hidden !== undefined) {
    baseProps['aria-hidden'] = hidden;
  }

  switch (type) {
    case 'button': {
      const props = {
        role: 'button',
        tabIndex: disabled ? -1 : 0,
        ...baseProps,
      };
      if (expanded !== undefined) {
        props['aria-expanded'] = expanded;
      }
      if (hasPopup !== undefined) {
        props['aria-haspopup'] = hasPopup;
      }
      if (controls !== undefined) {
        props['aria-controls'] = controls;
      }
      return props;
    }

    case 'menu': {
      const props = {
        role: 'menu',
        ...baseProps,
      };
      if (controls !== undefined) {
        props['aria-controls'] = controls;
      }
      if (owns !== undefined) {
        props['aria-owns'] = owns;
      }
      return props;
    }

    case 'menuitem': {
      const props = {
        role: 'menuitem',
        tabIndex: disabled ? -1 : 0,
        ...baseProps,
      };
      if (selected !== undefined) {
        props['aria-selected'] = selected;
      }
      if (setSize !== undefined) {
        props['aria-setsize'] = setSize;
      }
      if (posInSet !== undefined) {
        props['aria-posinset'] = posInSet;
      }
      return props;
    }

    case 'dialog': {
      const props = {
        role: 'dialog',
        'aria-modal': modal !== undefined ? modal : true,
        ...baseProps,
      };
      return props;
    }

    case 'alert': {
      const props = {
        role: 'alert',
        'aria-live': 'assertive',
        'aria-atomic': true,
        ...baseProps,
      };
      return props;
    }

    case 'tab': {
      const props = {
        role: 'tab',
        tabIndex: selected ? 0 : -1,
        'aria-selected': selected || false,
        ...baseProps,
      };
      if (controls !== undefined) {
        props['aria-controls'] = controls;
      }
      return props;
    }

    case 'tabpanel': {
      const props = {
        role: 'tabpanel',
        tabIndex: 0,
        ...baseProps,
      };
      return props;
    }

    case 'listbox': {
      const props = {
        role: 'listbox',
        ...baseProps,
      };
      if (expanded !== undefined) {
        props['aria-expanded'] = expanded;
      }
      return props;
    }

    case 'option': {
      const props = {
        role: 'option',
        'aria-selected': selected || false,
        ...baseProps,
      };
      if (setSize !== undefined) {
        props['aria-setsize'] = setSize;
      }
      if (posInSet !== undefined) {
        props['aria-posinset'] = posInSet;
      }
      return props;
    }

    case 'combobox': {
      const props = {
        role: 'combobox',
        'aria-expanded': expanded || false,
        'aria-haspopup': 'listbox',
        ...baseProps,
      };
      if (controls !== undefined) {
        props['aria-controls'] = controls;
      }
      if (owns !== undefined) {
        props['aria-owns'] = owns;
      }
      return props;
    }

    case 'tooltip': {
      const props = {
        role: 'tooltip',
        ...baseProps,
      };
      return props;
    }

    case 'navigation': {
      const props = {
        role: 'navigation',
        ...baseProps,
      };
      return props;
    }

    case 'search': {
      const props = {
        role: 'search',
        ...baseProps,
      };
      return props;
    }

    case 'status': {
      const props = {
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': true,
        ...baseProps,
      };
      return props;
    }

    case 'live': {
      const props = {
        'aria-live': live || 'polite',
        ...baseProps,
      };
      if (atomic !== undefined) {
        props['aria-atomic'] = atomic;
      }
      return props;
    }

    default: {
      return { ...baseProps };
    }
  }
}

/**
 * Generate a unique ID suitable for linking ARIA relationships.
 * @param {string} [prefix='aria'] - Prefix for the generated ID
 * @returns {string} A unique ID string
 */
export function generateAriaId(prefix = 'aria') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Create an accessible announcer for screen readers using a live region.
 * @param {string} message - The message to announce
 * @param {'polite' | 'assertive'} [politeness='polite'] - The urgency of the announcement
 * @returns {void}
 */
export function announceToScreenReader(message, politeness = 'polite') {
  if (!message || typeof message !== 'string') {
    return;
  }

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', politeness);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  announcer.style.position = 'absolute';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.padding = '0';
  announcer.style.margin = '-1px';
  announcer.style.overflow = 'hidden';
  announcer.style.clip = 'rect(0, 0, 0, 0)';
  announcer.style.whiteSpace = 'nowrap';
  announcer.style.border = '0';

  document.body.appendChild(announcer);

  requestAnimationFrame(() => {
    announcer.textContent = message;
  });

  setTimeout(() => {
    if (announcer.parentNode) {
      announcer.parentNode.removeChild(announcer);
    }
  }, 3000);
}