'use client';

import { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export default function IconButton({
  icon,
  label,
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}: IconButtonProps) {
  const variantClasses = {
    primary: 'bg-hoockers-green text-white hover:bg-opacity-90',
    secondary: 'bg-light-gray text-black hover:bg-spanish-gray',
    outline: 'bg-transparent border-2 border-hoockers-green text-hoockers-green hover:bg-hoockers-green hover:text-white',
    ghost: 'bg-transparent text-gray-web hover:text-hoockers-green hover:bg-cultured-1'
  };

  const sizeClasses = {
    small: 'p-2 text-8',
    medium: 'p-3 text-7',
    large: 'p-4 text-6'
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded font-urbanist font-500 
        transition-all duration-1 ease-cubic-out focus:outline-none focus:ring-2 
        focus:ring-hoockers-green focus:ring-offset-2
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      aria-label={label}
      {...props}
    >
      <ion-icon name={icon} size={size === 'small' ? 'small' : 'medium'}></ion-icon>
      {children && <span className="ml-2">{children}</span>}
    </button>
  );
}