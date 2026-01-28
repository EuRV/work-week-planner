import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right' | 'center';
}

type ButtonStyleProps = Pick<ButtonProps, 
  'variant' | 'size' | 'disabled' | 'loading' | 'fullWidth' | 'className'
>;

type ActionButtonProps = Pick<ButtonProps, 'onClick' | 'disabled' | 'loading'>;

const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 focus:ring-blue-500 shadow-md hover:shadow-lg active:scale-[0.98]',
  secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 shadow-sm',
  outline: 'border-2 border-blue-200 text-blue-600 bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm focus:ring-blue-500',
  ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500 shadow-md hover:shadow-lg',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-500 shadow-md hover:shadow-lg',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-4 text-xl',
} as const;

const gaps = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-2',
  xl: 'gap-3',
} as const;

function getButtonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: ButtonStyleProps): string {
  return [
    baseStyles,
    variants[variant],
    sizes[size],
    gaps[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const buttonClasses = getButtonClasses({ variant, size, fullWidth, className });

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
          <span>{loadingText || children}</span>
        </>
      );
    }

    const iconElement = icon && <span className="shrink-0">{icon}</span>;
    
    if (iconPosition === 'center') {
      return (
        <>
          {iconElement}
          <span className="whitespace-nowrap ml-2">{children}</span>
        </>
      );
    }
    
    return (
      <>
        {iconPosition === 'left' && iconElement}
        <span className="whitespace-nowrap">{children}</span>
        {iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-busy={loading}
    >
      {renderContent()}
    </button>
  );
}

// Дополнительные специализированные кнопки
export function AddButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      variant="outline"
      size="lg"
      fullWidth
      className="border-dashed hover:border-blue-300"
      iconPosition="left"
    >
      + Add Event
    </Button>
  );
}

export function RefreshButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      loadingText="Refreshing..."
      variant="secondary"
      icon="🔄"
      iconPosition="left"
    >
      Refresh
    </Button>
  );
}

export function DeleteButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      loadingText="Deleting..."
      variant="danger"
      size="sm"
      icon="🗑️"
      iconPosition="left"
      className="min-w-20"
    >
      Delete
    </Button>
  );
}

// Дополнительные кнопки для календаря
export function TodayButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      variant="secondary"
      icon="📅"
    >
      Today
    </Button>
  );
}

export function PreviousWeekButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      variant="ghost"
      icon="◀"
      size="md"
    >
      Prev Week
    </Button>
  );
}

export function NextWeekButton({ onClick, disabled, loading }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      variant="ghost"
      icon="▶"
      size="md"
      iconPosition="right"
    >
      Next Week
    </Button>
  );
}

// Экспорт типов для использования в других компонентах
export type { ButtonProps, ActionButtonProps };
