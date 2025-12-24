# Phase 3: UI Components Foundation

⏱️ **Thời gian**: 4-5 giờ  
🎯 **Mục tiêu**: Tạo các UI components cơ bản, layouts, và animation wrappers

---

## 📋 Phase 3 Checklist

- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Modal component
- [ ] Toast notification
- [ ] Loading states
- [ ] Layout components
- [ ] Animation wrappers
- [ ] Player avatar component
- [ ] Progress bar

---

## Step 3.1: Base UI Components

### 1. Button Component

```typescript
// components/ui/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-semibold',
          'transition-all duration-200',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'touch-target',
          {
            // Variants
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': 
              variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400': 
              variant === 'secondary',
            'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500': 
              variant === 'outline',
            'hover:bg-gray-100 text-gray-700 focus:ring-gray-400': 
              variant === 'ghost',
            'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500': 
              variant === 'danger',
            
            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && }
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      
    );
  }
);

Button.displayName = 'Button';
```

### 2. Input Component

```typescript
// components/ui/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      
        {label && (
          
            {label}
          
        )}
        
        
          {leftIcon && (
            
              {leftIcon}
            
          )}
          
          
          
          {rightIcon && (
            
              {rightIcon}
            
          )}
        
        
        {error && (
          {error}
        )}
      
    );
  }
);

Input.displayName = 'Input';
```

### 3. Card Component

```typescript
// components/ui/Card.tsx

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes {
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = forwardRef(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-4',
          {
            'bg-white': variant === 'default',
            'bg-white border-2 border-gray-200': variant === 'bordered',
            'bg-white shadow-lg': variant === 'elevated',
          },
          className
        )}
        {...props}
      >
        {children}
      
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className, ...props }: HTMLAttributes) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes) {
  return <h3 className={cn('text-lg font-bold', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes) {
  return <div className={cn('', className)} {...props} />;
}
```

---

## Step 3.2: Interactive Components

### 1. Modal Component

```typescript
// components/ui/Modal.tsx

'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showClose?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    
      {isOpen && (
        <>
          {/* Backdrop */}
          
          
          {/* Modal */}
          
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                'bg-white rounded-2xl shadow-2xl w-full relative',
                {
                  'max-w-sm': size === 'sm',
                  'max-w-md': size === 'md',
                  'max-w-lg': size === 'lg',
                }
              )}
            >
              {/* Header */}
              {(title || showClose) && (
                
                  {title && {title}}
                  {showClose && (
                    
                      
                    
                  )}
                
              )}
              
              {/* Content */}
              
                {children}
              
            
          
        </>
      )}
    ,
    document.body
  );
}
```

### 2. Toast Notification

```typescript
// components/ui/Toast.tsx

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ 
  message, 
  type, 
  isVisible, 
  onClose,
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: ,
    error: ,
    info: ,
  };

  return (
    
      {isVisible && (
        
          <div
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg shadow-lg',
              {
                'bg-success-500 text-white': type === 'success',
                'bg-error-500 text-white': type === 'error',
                'bg-blue-500 text-white': type === 'info',
              }
            )}
          >
            {icons[type]}
            {message}
            
              
            
          
        
      )}
    
  );
}
```

### 3. Progress Bar

```typescript
// components/ui/ProgressBar.tsx

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function ProgressBar({ 
  value, 
  max, 
  className,
  showLabel = false,
  color = 'primary'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        
          {value}/{max}
          {Math.round(percentage)}%
        
      )}
      
      
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full', {
            'bg-primary-500': color === 'primary',
            'bg-success-500': color === 'success',
            'bg-yellow-500': color === 'warning',
            'bg-error-500': color === 'error',
          })}
        />
      
    
  );
}
```

---

## Step 3.3: Layout Components

### 1. Mobile Container

```typescript
// components/layout/MobileContainer.tsx

import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    
      
        {children}
      
    
  );
}
```

### 2. Header Component

```typescript
// components/layout/Header.tsx

'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export function Header({ title, showBack = false, rightAction, onBack }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    
      {showBack && (
        
          
        
      )}
      
      {title}
      
      {rightAction}
    
  );
}
```

### 3. Bottom Navigation

```typescript
// components/layout/BottomNav.tsx

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Games', path: '/games' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    
      
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 touch-target',
                'transition-colors',
                isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              
              {item.label}
            
          );
        })}
      
    
  );
}
```

---

## Step 3.4: Game-Specific Components

### 1. Player Avatar

```typescript
// components/ui/PlayerAvatar.tsx

import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PlayerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  isOnline?: boolean;
}

const avatarColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export function PlayerAvatar({ 
  name, 
  size = 'md', 
  showName = false,
  isOnline 
}: PlayerAvatarProps) {
  // Generate consistent color based on name
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  const bgColor = avatarColors[colorIndex];
  
  const initial = name.charAt(0).toUpperCase();

  return (
    
      
        <div
          className={cn(
            'flex items-center justify-center rounded-full text-white font-bold',
            bgColor,
            {
              'w-8 h-8 text-sm': size === 'sm',
              'w-12 h-12 text-lg': size === 'md',
              'w-16 h-16 text-2xl': size === 'lg',
            }
          )}
        >
          {initial}
        
        
        {isOnline !== undefined && (
          
        )}
      
      
      {showName && (
        {name}
      )}
    
  );
}
```

### 2. Loading States

```typescript
// components/ui/LoadingSpinner.tsx

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    
      <Loader2
        className={cn('animate-spin text-primary-600', {
          'w-6 h-6': size === 'sm',
          'w-10 h-10': size === 'md',
          'w-16 h-16': size === 'lg',
        })}
      />
      {message && (
        {message}
      )}
    
  );

  if (fullScreen) {
    return (
      
        {content}
      
    );
  }

  return content;
}
```

---

## Step 3.5: Animation Wrappers

### 1. Page Transition

```typescript
// components/animations/PageTransition.tsx

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    
      {children}
    
  );
}
```

### 2. Slide Transition

```typescript
// components/animations/SlideTransition.tsx

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideTransitionProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideTransition({ children, direction = 'right' }: SlideTransitionProps) {
  const variants = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 },
  };

  return (
    
      {children}
    
  );
}
```

---

## Step 3.6: Test Components

Create a test page to view all components:

```typescript
// app/components-test/page.tsx

'use client';

import { useState } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { User, Mail } from 'lucide-react';

export default function ComponentsTestPage() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    
      
      
      
        {/* Buttons */}
        
          
            Buttons
          
          
            Primary Button
            Secondary Button
            Outline Button
            Ghost Button
            Loading...
          
        

        {/* Inputs */}
        
          
            Inputs
          
          
            
            }
            />
            
          
        

        {/* Progress */}
        
          
            Progress Bar
          
          
            
            
          
        

        {/* Avatars */}
        
          
            Player Avatars
          
          
            
            
            
          
        

        {/* Modal & Toast Triggers */}
        
          
            Overlays
          
          
            <Button onClick={() => setShowModal(true)}>
              Open Modal
            
            <Button 
              variant="secondary"
              onClick={() => setShowToast(true)}
            >
              Show Toast
            
          
        

        {/* Loading */}
        
          
            Loading States
          
          
            
          
        
      

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Test Modal"
      >
        This is a modal dialog!
        <Button className="mt-4" onClick={() => setShowModal(false)}>
          Close
        
      

      {/* Toast */}
      <Toast
        message="This is a success message!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    
  );
}
```

---

## ✅ Phase 3 Completion Checklist

- [ ] Button component created
- [ ] Input component created
- [ ] Card component created
- [ ] Modal component created
- [ ] Toast notification created
- [ ] Progress bar created
- [ ] Player avatar created
- [ ] Loading spinner created
- [ ] Layout components (Container, Header, BottomNav)
- [ ] Animation wrappers created
- [ ] Components tested on test page

---

## 🎯 Next Step

➡️ **[Phase 4: Main Pages & Game Hub](./PHASE_4_Main_Pages_Game_Hub.md)**

Trong Phase 4, chúng ta sẽ:
- Tạo Home page
- Tạo Games Hub
- Tạo Lobby page
- Tạo Room page với realtime sync