# Phase 6: Deploy & Scale Preparation

⏱️ **Thời gian**: 1-2 giờ  
🎯 **Mục tiêu**: Deploy lên production và chuẩn bị cho scaling

---

## 📋 Phase 6 Checklist

- [ ] Vercel deployment
- [ ] Environment variables setup
- [ ] Production build test
- [ ] Custom domain (optional)
- [ ] Analytics setup (optional)
- [ ] Documentation for adding games
- [ ] Final testing on production

---

## Step 6.1: Prepare for Deployment

### 1. Final Code Review

```bash
# Check for console.logs in production code
grep -r "console.log" app/ components/ lib/

# Remove or wrap in development check
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

### 2. Build Test

```bash
# Test production build locally
npm run build

# Should complete without errors
# Check output for any warnings
```

### 3. Check .gitignore

```bash
# Make sure these are ignored
.env*.local
.next
node_modules
.DS_Store
*.log
```

### 4. Commit All Changes

```bash
git add .
git commit -m "feat: complete phase 5 - ready for deployment"
git push origin main
```

---

## Step 6.2: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

**Steps:**

1. **Login to Vercel**
   - Go to https://vercel.com
   - Click "Login" → Continue with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_value
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_value
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
   NEXT_PUBLIC_FIREBASE_APP_ID=your_value
   ```
   
   **💡 Tip:** Copy from your `.env.local` file

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://your-app.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? vocabulary-game
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

---

## Step 6.3: Configure Environment Variables

### 1. Via Vercel Dashboard

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add all `NEXT_PUBLIC_*` variables
4. Set for: **Production**, **Preview**, and **Development**

### 2. Via Vercel CLI

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# Choose environments:
# [x] Production
# [x] Preview
# [x] Development

# Repeat for all variables
```

### 3. Redeploy After Adding Variables

```bash
# Trigger new deployment
git commit --allow-empty -m "trigger redeploy"
git push

# Or via CLI
vercel --prod
```

---

## Step 6.4: Test Production Deployment

### 1. Basic Testing

Visit your Vercel URL and test:

```
✅ Home page loads
✅ Can navigate to other pages
✅ Can create room
✅ Room code displays
✅ Can join room from another device
✅ Realtime sync works
✅ No console errors
```

### 2. Mobile Testing

```
1. Open Vercel URL on mobile
2. Test touch interactions
3. Test room creation/joining
4. Test with another device
```

### 3. Performance Check

```bash
# Use Vercel Analytics (if enabled)
# Or use Lighthouse in Chrome DevTools

# Check:
- Page load time
- First contentful paint
- Largest contentful paint
- Cumulative layout shift
```

---

## Step 6.5: Custom Domain (Optional)

### 1. Buy Domain

Popular registrars:
- Namecheap: https://namecheap.com
- GoDaddy: https://godaddy.com
- Google Domains: https://domains.google

### 2. Add Domain to Vercel

1. Go to Vercel project → Settings → Domains
2. Enter your domain: `vocabgame.com`
3. Click "Add"

### 3. Configure DNS

Vercel will show DNS records to add:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Wait for DNS Propagation

- Usually takes 5-30 minutes
- Can take up to 48 hours
- Check status: https://dnschecker.org

---

## Step 6.6: Firebase Production Setup

### 1. Upgrade Security Rules

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "!data.exists() || data.child('players').hasChild(auth.uid)",
        "players": {
          "$playerId": {
            ".write": true
          }
        },
        "status": {
          ".write": "data.parent().child('hostId').val() === auth.uid"
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

### 2. Set Usage Limits (Free Tier)

In Firebase Console:
- Realtime Database → Usage
- Set alerts at:
  - 80% of storage
  - 80% of downloads
  - 80% of connections

### 3. Backup Data

```bash
# Via Firebase Console:
Realtime Database → Data → Export JSON

# Or use CLI:
firebase database:get / > backup.json
```

---

## Step 6.7: Analytics Setup (Optional)

### 1. Vercel Analytics

```bash
# Install
npm install @vercel/analytics

# Add to layout
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    
      
        {children}
        
      
    
  );
}
```

### 2. Google Analytics (Optional)

```bash
npm install react-ga4

# Configure
// lib/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX');
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
```

---

## Step 6.8: Documentation for Adding Games

Create a guide for future game development:

```markdown
// docs/ADDING_GAMES.md

# Adding New Game Modes

## 1. Create Game Component

```typescript
// components/games/FlashcardGame.tsx

export function FlashcardGame({ words, onComplete }) {
  // Game logic here
}
```

## 2. Add Game Route

```typescript
// app/game/flashcard/page.tsx

import { FlashcardGame } from '@/components/games/FlashcardGame';

export default function FlashcardPage() {
  return ;
}
```

## 3. Update Games List

```typescript
// app/games/page.tsx

const games = [
  {
    id: 'flashcard',
    status: 'available', // Change from 'coming-soon'
    route: '/game/flashcard'
  }
];
```

## 4. Add Game Logic

- Question generation
- Answer validation
- Score calculation
- Realtime sync

## 5. Test

- Solo mode
- Multiplayer mode
- Edge cases
```

---

## Step 6.9: Monitoring & Maintenance

### 1. Setup Error Tracking (Optional)

```bash
# Sentry for error tracking
npm install @sentry/nextjs

# Configure
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'your-sentry-dsn',
  tracesSampleRate: 1.0,
});
```

### 2. Monitor Firebase Usage

Check regularly:
- Realtime Database connections
- Data stored
- Data downloaded
- Peak concurrent users

### 3. Performance Monitoring

Use Vercel Dashboard:
- Page load times
- API response times
- Error rates
- Traffic analytics

---

## Step 6.10: Launch Checklist

### Pre-Launch
- [ ] All features working
- [ ] Mobile tested
- [ ] Multiplayer tested
- [ ] No console errors
- [ ] Environment variables set
- [ ] Firebase rules updated
- [ ] Build passes
- [ ] Production deployed

### Post-Launch
- [ ] Share with friends to test
- [ ] Monitor error logs
- [ ] Check Firebase usage
- [ ] Gather user feedback
- [ ] Plan next features

---

## Step 6.11: Scaling Considerations

### When You Grow

**Firebase Limits (Free Tier):**
- 100 concurrent connections
- 1 GB stored
- 10 GB downloaded/month

**Solutions:**
1. **Upgrade to Blaze Plan** (pay-as-you-go)
2. **Optimize data structure**
   - Use shorter keys
   - Clean up old rooms
   - Paginate data

3. **Add caching**
   - Cache static data (words)
   - Use local storage

4. **Consider alternatives**
   - Supabase (PostgreSQL)
   - PlanetScale (MySQL)
   - Redis for realtime

### Cost Estimates

**Vercel (Free Tier):**
- Unlimited deploys
- 100 GB bandwidth
- Serverless functions

**Firebase (Blaze - typical small app):**
- ~$5-10/month for 1000 active users
- ~$25/month for 5000 active users

---

## Step 6.12: Next Features to Build

### Priority 1: Core Games
1. **Flashcard** - Simplest to implement
2. **Multiple Choice** - Already have logic
3. **Fill in the Blank** - Text input validation

### Priority 2: Enhancements
4. **Sound effects** - Victory, error sounds
5. **Leaderboard** - Top scores
6. **User profiles** - Save progress
7. **Daily challenges** - Engagement

### Priority 3: Advanced
8. **Voice pronunciation** - Web Speech API
9. **Image cards** - Visual learning
10. **Spaced repetition** - Smart review
11. **Achievements** - Gamification

---

## ✅ Phase 6 Completion Checklist

- [ ] Deployed to Vercel
- [ ] Production URL working
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)
- [ ] Firebase production ready
- [ ] Error tracking setup (optional)
- [ ] Documentation created
- [ ] Mobile tested on production
- [ ] Multiplayer tested on production
- [ ] Monitoring in place

---

## 🎉 Congratulations!

Bạn đã hoàn thành toàn bộ roadmap! 

**Bạn hiện có:**
✅ Ứng dụng học từ vựng multiplayer realtime  
✅ Responsive mobile-first design  
✅ Firebase Realtime Database integration  
✅ Deploy trên Vercel với URL công khai  
✅ Infrastructure sẵn sàng cho thêm game modes  

**Next Steps:**
1. Share với bạn bè để test
2. Gather feedback
3. Implement game mode đầu tiên (Flashcard)
4. Iterate based on user feedback

---

## 📞 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

## 🐛 Need Help?

Common issues and solutions:

1. **Deployment fails**
   - Check build logs in Vercel
   - Verify all env variables set
   - Test build locally first

2. **Firebase not connecting**
   - Check database URL
   - Verify rules allow access
   - Check browser console

3. **Realtime not syncing**
   - Verify listeners subscribed
   - Check unsubscribe logic
   - Test on 2 devices

**Good luck with your project! 🚀**