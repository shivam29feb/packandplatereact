import React, { useState } from 'react';
import styles from './Tabs.module.css';

export type TabsVariant = 'standard' | 'contained' | 'fullWidth';
export type TabsOrientation = 'horizontal' | 'vertical';

interface TabsProps {
  /**
   * The variant of the tabs
   * @default 'standard'
   */
  variant?: TabsVariant;

  /**
   * The orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * The index of the initially selected tab
   * @default 0
   */
  defaultValue?: number;

  /**
   * Callback fired when a tab is selected
   */
  onChange?: (value: number) => void;

  /**
   * The content of the tabs
   */
  children: React.ReactNode;

  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Tabs component for navigation between different views
 */
const Tabs: React.FC<TabsProps> = ({
  variant = 'standard',
  orientation = 'horizontal',
  defaultValue = 0,
  onChange,
  children,
  className,
  ...rest
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  // Combine class names based on props
  const tabsClasses = [
    styles.tabs,
    styles[`variant-${variant}`],
    styles[`orientation-${orientation}`],
    className || ''
  ].filter(Boolean).join(' ');

  // Filter out Tab components from children
  const tabList = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  );

  // Filter out TabPanel components from children
  const tabPanels = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TabPanel
  );

  return (
    <div className={tabsClasses} {...rest}>
      <div className={styles.tabList} role="tablist">
        {React.Children.map(tabList, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child as React.ReactElement<any>, {
            selected: value === index,
            onClick: () => handleChange(index),
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
          });
        })}
      </div>

      <div className={styles.tabPanels}>
        {React.Children.map(tabPanels, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child as React.ReactElement<any>, {
            selected: value === index,
            id: `tabpanel-${index}`,
            'aria-labelledby': `tab-${index}`,
          });
        })}
      </div>
    </div>
  );
};

interface TabProps {
  /**
   * The label of the tab
   */
  label: React.ReactNode;

  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the tab is selected
   * @default false
   */
  selected?: boolean;

  /**
   * Callback fired when the tab is clicked
   */
  onClick?: () => void;

  /**
   * Additional class name
   */
  className?: string;

  /**
   * ID for accessibility
   */
  id?: string;

  /**
   * ARIA controls for accessibility
   */
  'aria-controls'?: string;
}

/**
 * Tab component for use within Tabs
 */
export const Tab: React.FC<TabProps> = ({
  label,
  disabled = false,
  selected = false,
  onClick,
  className,
  id,
  'aria-controls': ariaControls,
  ...rest
}) => {
  // Combine class names based on props
  const tabClasses = [
    styles.tab,
    selected ? styles.selected : '',
    disabled ? styles.disabled : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={tabClasses}
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-controls={ariaControls}
      id={id}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {label}
    </button>
  );
};

interface TabPanelProps {
  /**
   * The content of the tab panel
   */
  children: React.ReactNode;

  /**
   * Whether the tab panel is selected
   * @default false
   */
  selected?: boolean;

  /**
   * Additional class name
   */
  className?: string;

  /**
   * ID for accessibility
   */
  id?: string;

  /**
   * ARIA labelledby for accessibility
   */
  'aria-labelledby'?: string;
}

/**
 * TabPanel component for use within Tabs
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  selected = false,
  className,
  id,
  'aria-labelledby': ariaLabelledby,
  ...rest
}) => {
  // Combine class names based on props
  const tabPanelClasses = [
    styles.tabPanel,
    selected ? styles.selected : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={tabPanelClasses}
      role="tabpanel"
      aria-labelledby={ariaLabelledby}
      id={id}
      hidden={!selected}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Tabs;
