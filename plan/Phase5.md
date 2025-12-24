# Phase 5: Testing & Refinement

⏱️ **Thời gian**: 2-3 giờ  
🎯 **Mục tiêu**: Test toàn bộ app, fix bugs, optimize, và setup security

---

## 📋 Phase 5 Checklist

- [ ] Local testing (desktop browser)
- [ ] Mobile testing (điện thoại thật)
- [ ] Multiplayer testing (2+ devices)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Firebase Security Rules
- [ ] Error handling improvements
- [ ] UX refinements

---

## Step 5.1: Local Testing (Desktop)

### 1. Test Flow Checklist

```
HOME PAGE:
✅ Page loads correctly
✅ Hero section renders
✅ All buttons work
✅ Navigation to other pages works

GAMES HUB:
✅ All game cards display
✅ Coming soon badges show
✅ Back button works
✅ Animations smooth

LOBBY:
✅ Can enter player name
✅ Create room button works
✅ Join room button works
✅ Validation messages show
✅ Error handling works

ROOM (Waiting):
✅ Room code displays
✅ Copy room code works
✅ Players list updates realtime
✅ Ready/Unready toggle works
✅ Host can start game
✅ Non-host sees correct UI
✅ Leave room works
✅ Room deletes when empty
```

### 2. Test Commands

```bash
# Clear cache and restart
rm -rf .next
npm run dev

# Check for TypeScript errors
npm run build

# Check console for errors
# Open DevTools → Console
```

---

## Step 5.2: Mobile Testing (LAN)

### 1. Get Your Computer's IP Address

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```bash
ipconfig
```

Look for `IPv4 Address`, example: `192.168.1.100`

### 2. Access from Mobile

```
http://YOUR_IP:3000

Example: http://192.168.1.100:3000
```

**⚠️ Important:**
- Computer and phone must be on same WiFi
- Disable firewall or allow port 3000
- If using Windows, allow Node.js in Windows Firewall

### 3. Mobile Testing Checklist

```
BASIC FUNCTIONALITY:
✅ App loads on mobile
✅ Touch interactions work
✅ Buttons are touchable (44px min)
✅ Text is readable (not too small)
✅ Inputs can be typed
✅ Keyboard doesn't break layout
✅ Scrolling works smoothly

RESPONSIVE DESIGN:
✅ Layout looks good on mobile
✅ No horizontal scrolling
✅ Elements don't overflow
✅ Safe areas respected (notch)
✅ Bottom nav doesn't overlap content

PERFORMANCE:
✅ Pages load quickly
✅ Animations are smooth (60fps)
✅ No lag when typing
✅ Realtime updates fast
```

---

## Step 5.3: Multiplayer Testing

### 1. Test Scenarios

**Scenario 1: Basic Multiplayer**
```
Device A:
1. Create room
2. Note room code
3. Wait for Device B

Device B:
1. Join room with code
2. Toggle ready

Device A:
1. See Device B in player list
2. Start game when both ready
```

**Scenario 2: Multiple Players**
```
3-4 devices:
1. All join same room
2. Toggle ready/unready
3. Check real-time sync
4. Host starts game
```

**Scenario 3: Edge Cases**
```
Test:
- Join full room (should fail)
- Join non-existent room (should fail)
- Leave room (should update others)
- Host leaves (new host assigned)
- All leave (room deleted)
```

### 2. Test Report Template

```markdown
## Test Report

Date: [DATE]
Devices: [Device 1, Device 2, etc.]

### ✅ Passed Tests:
- [ ] Create room
- [ ] Join room
- [ ] Realtime sync
- [ ] Ready toggle
- [ ] Start game
- [ ] Leave room

### ❌ Failed Tests:
- [ ] Issue description
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior

### 🐛 Bugs Found:
1. [Bug description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Screenshot/video

### 📝 Notes:
- [Any observations]
```

---

## Step 5.4: Common Bugs & Fixes

### Bug 1: Firebase Permission Denied

**Error:**
```
Firebase: Error (auth/permission-denied)
```

**Fix:**
```json
// In Firebase Console → Realtime Database → Rules
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    },
    "words": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Bug 2: Player Not Showing in Room

**Fix:**
```typescript
// Make sure player is set before navigation
setCurrentPlayer(player);
await router.push(`/room/${roomId}`);
```

### Bug 3: Realtime Not Working

**Check:**
1. Firebase Realtime Database URL correct in `.env.local`
2. Database rules allow read/write
3. Listener properly subscribed
4. No unsubscribe on wrong dependency

### Bug 4: Layout Breaks on Mobile

**Fix:**
```css
/* In globals.css */
input, select, textarea {
  font-size: 16px !important; /* Prevents zoom on iOS */
}

body {
  overscroll-behavior: none; /* Prevents rubber-band scroll */
}
```

---

## Step 5.5: Performance Optimization

### 1. Code Splitting

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => ,
  ssr: false
});
```

### 2. Memoization

```typescript
// Use memo for components that re-render often
import { memo } from 'react';

export const PlayerListItem = memo(({ player }: { player: Player }) => {
  return (
    
      
      {player.name}
    
  );
});
```

### 3. Optimize Firebase Listeners

```typescript
// Only listen to what you need
const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`);
// Instead of entire room

// Always unsubscribe
useEffect(() => {
  const unsubscribe = onValue(roomRef, callback);
  return () => unsubscribe(); // Cleanup
}, [roomId]);
```

---

## Step 5.6: Firebase Security Rules

### 1. Development Rules (Current)

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    },
    "words": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **Warning: These rules are insecure! Use only in development.**

### 2. Production Rules (Recommended)

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "!data.exists() || data.child('players').hasChild(auth.uid)",
        "players": {
          "$playerId": {
            ".write": "$playerId === auth.uid"
          }
        }
      }
    },
    "words": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}
```

### 3. Apply Rules

1. Go to Firebase Console
2. Realtime Database → Rules
3. Paste rules
4. Click "Publish"

---

## Step 5.7: Error Handling Improvements

### 1. Global Error Boundary

```typescript
// app/error.tsx

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    
      
        Có lỗi xảy ra!
        
          {error.message || 'Đã có lỗi không mong muốn'}
        
        Thử lại
      
    
  );
}
```

### 2. Network Error Handling

```typescript
// lib/utils/errorHandler.ts

export function handleFirebaseError(error: any): string {
  if (error.code === 'PERMISSION_DENIED') {
    return 'Không có quyền truy cập';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
  }
  
  if (error.message?.includes('not exist')) {
    return 'Phòng không tồn tại';
  }
  
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
}
```

---

## Step 5.8: UX Improvements

### 1. Loading States

```typescript
// Add loading states to all async actions
const [isCreating, setIsCreating] = useState(false);
const [isJoining, setIsJoining] = useState(false);

// Use in buttons
Create Room
```

### 2. Confirmation Dialogs

```typescript
// Confirm before leaving room
const handleLeaveRoom = async () => {
  if (confirm('Bạn có chắc muốn rời phòng?')) {
    await RealtimeService.leaveRoom(roomId, currentPlayer.id);
    router.push('/');
  }
};
```

### 3. Empty States

```typescript
// Show helpful message when no players
{players.length === 1 && (
  
    
    Chờ bạn bè tham gia...
    Chia sẻ mã phòng với họ
  
)}
```

---

## Step 5.9: Accessibility Improvements

### 1. Keyboard Navigation

```typescript
// Add keyboard support
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  }}
/>
```

### 2. ARIA Labels

```typescript

  

```

### 3. Focus Management

```typescript
// Auto-focus important inputs

```

---

## Step 5.10: Testing Checklist

### Desktop Testing
- [ ] All pages load
- [ ] Navigation works
- [ ] Forms validate
- [ ] Buttons respond
- [ ] Animations smooth
- [ ] No console errors

### Mobile Testing (Same WiFi)
- [ ] Accessible via IP
- [ ] Touch works
- [ ] Responsive layout
- [ ] Keyboard doesn't break UI
- [ ] Scrolling smooth
- [ ] Animations smooth

### Multiplayer Testing
- [ ] Create room works
- [ ] Join room works
- [ ] Players sync realtime
- [ ] Ready toggle works
- [ ] Start game works
- [ ] Leave room works
- [ ] Host transfer works
- [ ] Room cleanup works

### Edge Cases
- [ ] Join full room fails
- [ ] Join invalid room fails
- [ ] Network errors handled
- [ ] Page refresh recovers
- [ ] Rapid actions don't break
- [ ] Concurrent updates work

---

## Step 5.11: Final Refinements

### 1. Add Loading Screen

```typescript
// app/loading.tsx

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function Loading() {
  return (
    
      
    
  );
}
```

### 2. Add 404 Page

```typescript
// app/not-found.tsx

import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    
      
        404
        
          Trang không tồn tại
        
        
          Về Trang Chủ
        
      
    
  );
}
```

---

## ✅ Phase 5 Completion Checklist

- [ ] Desktop testing complete
- [ ] Mobile testing complete
- [ ] Multiplayer testing complete
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Firebase security rules applied
- [ ] Error handling improved
- [ ] UX refinements done
- [ ] Accessibility improved
- [ ] Loading/error states added

---

## 🎯 Next Step

➡️ **[Phase 6: Deploy & Scale Preparation](./PHASE_6_Deploy_Scale_Preparation.md)**

Trong Phase 6, chúng ta sẽ:
- Deploy lên Vercel
- Setup environment variables production
- Configure custom domain (optional)
- Setup analytics (optional)
- Prepare for adding game modes