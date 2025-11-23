# ✨ Hero Section with 3D Animation

## 🎯 Overview

Hero section telah diperbaharui dengan **animasi 3D yang elegant dan simple**, plus konten yang lebih sesuai untuk sistem booking UMKM.

---

## 🎨 3D Animation Features

### **1. Floating 3D Cards**

Tiga kartu glass dengan 3D transform dan floating animation:

#### **Card 1 - Clock (Top Left)**
```jsx
<div className="absolute w-64 h-40 top-20 left-10 
                bg-white/10 backdrop-blur-md border-white/20 
                rounded-2xl animate-float-3d hover:scale-110"
     style={{ 
         transform: 'perspective(1000px) rotateY(-15deg) rotateX(10deg)',
         animationDelay: '0s' 
     }}>
    <Clock className="w-16 h-16 text-white/60" />
</div>
```

**Features:**
- 🕐 **Icon**: Clock (simbol booking waktu)
- 📐 **Transform**: Perspective 3D dengan rotate Y & X
- ✨ **Animation**: Float 3D dengan 6s duration
- 🎯 **Position**: Top-left corner
- 💫 **Hover**: Scale 110%

---

#### **Card 2 - Shield (Top Right)**
```jsx
<div className="absolute hidden md:block w-56 h-36 top-32 right-20
                bg-white/10 backdrop-blur-md border-white/20 
                rounded-2xl animate-float-3d hover:scale-110"
     style={{ 
         transform: 'perspective(1000px) rotateY(15deg) rotateX(-10deg)',
         animationDelay: '1.5s' 
     }}>
    <Shield className="w-14 h-14 text-white/60" />
</div>
```

**Features:**
- 🛡️ **Icon**: Shield (simbol keamanan/terpercaya)
- 📐 **Transform**: Perspective 3D opposite rotation
- ✨ **Animation**: Delay 1.5s
- 🎯 **Position**: Top-right corner
- 📱 **Responsive**: Hidden on mobile

---

#### **Card 3 - TrendingUp (Bottom Left)**
```jsx
<div className="absolute hidden md:block w-48 h-32 bottom-32 left-20
                bg-white/10 backdrop-blur-md border-white/20 
                rounded-2xl animate-float-3d hover:scale-110"
     style={{ 
         transform: 'perspective(1000px) rotateY(10deg) rotateX(15deg)',
         animationDelay: '3s' 
     }}>
    <TrendingUp className="w-14 h-14 text-white/60" />
</div>
```

**Features:**
- 📈 **Icon**: TrendingUp (simbol pertumbuhan UMKM)
- 📐 **Transform**: Unique 3D angle
- ✨ **Animation**: Delay 3s
- 🎯 **Position**: Bottom-left corner
- 📱 **Responsive**: Hidden on mobile

---

### **2. Gradient Orbs**

Background blur orbs dengan floating animation:

```jsx
{/* Gradient Orbs */}
<div className="absolute rounded-full opacity-20 
                -top-24 -left-24 w-96 h-96 
                bg-sky-400 blur-3xl animate-float-slow" />

<div className="absolute rounded-full opacity-20 
                -bottom-24 -right-24 w-96 h-96 
                bg-blue-500 blur-3xl animate-float-slow" 
     style={{ animationDelay: '3s' }} />
```

**Features:**
- 🌊 **Size**: 384px (w-96 h-96)
- 🎨 **Colors**: Sky-400 & Blue-500
- 💨 **Blur**: 3xl (very soft)
- ✨ **Animation**: Slower float (8s)
- 🎯 **Position**: Diagonal corners
- 🔄 **Delay**: Staggered 3s

---

## 📝 Content Updates

### **Before:**
```
Platform Booking #1 untuk UMKM Indonesia
Booking Mudah, Usaha Lancar
Reservasi online untuk semua kebutuhan Anda
```

### **After:**
```
Platform Booking UMKM Terpercaya
Booking UMKM Jadi Lebih Mudah
Reservasi online untuk layanan salon, barbershop, klinik, spa, dan UMKM lainnya.
Sekali klik, langsung terjadwal!
```

---

## 🎨 Typography & Styling

### **Badge (Top)**
```jsx
<div className="inline-flex items-center px-5 py-2.5 space-x-2 
                border rounded-full bg-white/10 backdrop-blur-xl 
                border-white/20 shadow-glass animate-fade-in-down">
    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
    <span className="text-sm font-semibold tracking-wide text-white">
        Platform Booking UMKM Terpercaya
    </span>
</div>
```

**Features:**
- ✨ Sparkles icon dengan pulse animation
- 🎯 Font semibold dengan tracking-wide
- 💫 Fade-in-down entrance animation
- 🔮 Glass background

---

### **Main Heading**
```jsx
<h1 className="text-5xl font-extrabold leading-tight text-white 
               md:text-7xl drop-shadow-2xl animate-fade-in">
    Booking UMKM
    <br />
    <span className="text-transparent bg-clip-text 
                     bg-gradient-to-r from-yellow-300 
                     via-orange-300 to-orange-400 animate-gradient">
        Jadi Lebih Mudah
    </span>
</h1>
```

**Features:**
- 📏 **Size**: 5xl mobile → 7xl desktop
- 🎨 **Gradient text**: Yellow → Orange animated
- ✨ **Animation**: Fade-in + gradient shift
- 💎 **Drop shadow**: 2xl for depth

---

### **Subtitle**
```jsx
<p className="max-w-3xl mx-auto text-xl leading-relaxed text-blue-50 
              md:text-2xl animate-fade-in" 
   style={{ animationDelay: '0.2s' }}>
    Reservasi online untuk layanan salon, barbershop, klinik, spa, dan UMKM lainnya.<br />
    <span className="font-semibold text-yellow-300">
        Sekali klik, langsung terjadwal!
    </span>
</p>
```

**Features:**
- 📝 **Specific services**: Salon, barbershop, clinic, spa
- 🎯 **Highlight**: Yellow CTA text
- ✨ **Animation delay**: 0.2s stagger
- 📏 **Max width**: 3xl for readability

---

### **CTA Buttons**
```jsx
{/* Primary Button */}
<a href="#umkm-list"
   className="relative px-10 py-4 text-lg font-bold 
              bg-gradient-to-r from-yellow-300 to-orange-400 
              rounded-2xl hover:scale-105 hover:shadow-2xl">
    <span className="relative z-10 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Cari UMKM
    </span>
    <div className="absolute inset-0 scale-x-0 origin-left
                    bg-gradient-to-r from-orange-400 to-orange-500 
                    group-hover:scale-x-100" />
</a>

{/* Secondary Button */}
<a href="/register"
   className="relative px-10 py-4 text-lg font-semibold text-white
              border-2 backdrop-blur-xl bg-white/10 border-white/30 
              rounded-2xl hover:bg-white/20 hover:scale-105">
    Daftarkan UMKM Anda
</a>
```

**Changes:**
- 🔍 **Primary**: "Cari UMKM" dengan Search icon
- 📝 **Secondary**: "Daftarkan UMKM Anda" lebih specific
- ✨ **Animation**: Scale 105% (tidak 110%, lebih subtle)
- 💫 **Delay**: 0.4s animation entrance

---

### **Stats Cards**
```jsx
<div className="grid grid-cols-1 gap-6 pt-16 mt-16 
                sm:grid-cols-3 animate-fade-in" 
     style={{ animationDelay: '0.6s' }}>
    
    {/* Card 1 */}
    <div className="p-6 border group rounded-2xl 
                    bg-white/5 backdrop-blur-md border-white/10 
                    hover:bg-white/10 hover:scale-105 
                    shadow-glass hover:shadow-glass-lg">
        <div className="text-4xl font-bold text-transparent 
                        bg-clip-text bg-gradient-to-br 
                        from-yellow-300 to-orange-400">
            150+
        </div>
        <div className="mt-2 text-sm font-medium text-blue-50">
            UMKM Mitra
        </div>
    </div>
    
    {/* Similar for 5K+ Booking Berhasil & 24/7 Layanan Aktif */}
</div>
```

**Changes:**
- 📊 **Stats**: 150+ UMKM, 5K+ Booking, 24/7 Service
- 🎨 **Text**: Gradient yellow → orange
- ✨ **Animation**: Fade-in dengan delay 0.6s
- 📱 **Responsive**: 1 col mobile → 3 cols desktop

---

## 🎬 Animation Keyframes

### **1. Float 3D**
```css
@keyframes float-3d {
    0%, 100% { 
        transform: translateY(0px) translateZ(0px) 
                   rotateX(0deg) rotateY(0deg);
    }
    25% { 
        transform: translateY(-15px) translateZ(20px) 
                   rotateX(5deg) rotateY(-5deg);
    }
    50% { 
        transform: translateY(-25px) translateZ(40px) 
                   rotateX(-5deg) rotateY(5deg);
    }
    75% { 
        transform: translateY(-15px) translateZ(20px) 
                   rotateX(3deg) rotateY(-3deg);
    }
}
```

**Properties:**
- 🎯 **Duration**: 6s
- 🔄 **Easing**: ease-in-out
- ♾️ **Loop**: infinite
- 📐 **3D axes**: translateY, translateZ, rotateX, rotateY

---

### **2. Float Slow**
```css
@keyframes float-slow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-30px) translateX(10px); }
}
```

**Properties:**
- 🎯 **Duration**: 8s (slower)
- 🔄 **Movement**: Y & X axis
- 💨 **Subtle**: For background orbs

---

### **3. Fade In**
```css
@keyframes fade-in {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
```

**Properties:**
- 🎯 **Duration**: 0.8s
- 🔄 **Direction**: Bottom to top
- ✨ **Opacity**: 0 → 1

---

### **4. Fade In Down**
```css
@keyframes fade-in-down {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
}
```

**Properties:**
- 🎯 **Duration**: 0.8s
- 🔄 **Direction**: Top to bottom
- ✨ **Opacity**: 0 → 1

---

### **5. Gradient Animation**
```css
@keyframes gradient {
    0%, 100% { backgroundPosition: '0% 50%'; }
    50% { backgroundPosition: '100% 50%'; }
}
```

**Properties:**
- 🎯 **Duration**: 3s
- 🔄 **Movement**: Background position shift
- 🎨 **Effect**: Animated gradient text

---

## 📐 3D Transform Details

### **Perspective:**
```css
perspective: 1000px;
```
- Creates 3D space for child elements
- 1000px = moderate depth

### **RotateY:**
```css
rotateY(-15deg)  /* Card tilts left */
rotateY(15deg)   /* Card tilts right */
```
- Horizontal rotation
- Negative = left, Positive = right

### **RotateX:**
```css
rotateX(10deg)   /* Card tilts down */
rotateX(-10deg)  /* Card tilts up */
```
- Vertical rotation
- Positive = down, Negative = up

---

## 🎯 Animation Sequencing

**Staggered entrance animations:**

1. **0s** - Badge fades in from top
2. **0s** - Heading fades in
3. **0.2s** - Subtitle fades in
4. **0.4s** - Buttons fade in
5. **0.6s** - Stats cards fade in

**Background:**
- 3D cards float continuously (0s, 1.5s, 3s delays)
- Gradient orbs float slowly (0s, 3s delays)

---

## 📱 Responsive Design

### **Mobile (<768px):**
- 3D cards hidden (except Clock card visible)
- Stats: 1 column layout
- Text: 5xl heading
- All animations maintained

### **Desktop (≥768px):**
- All 3D cards visible
- Stats: 3 columns
- Text: 7xl heading
- Full 3D effect

---

## 🎨 Color Palette

### **Text:**
- Primary: White
- Highlight: Yellow-300 → Orange-400
- Subtle: Blue-50 (light blue text)

### **Cards:**
- Background: white/10 (10% opacity)
- Border: white/20
- Icons: white/60

### **Buttons:**
- Primary: Yellow-300 → Orange-400 gradient
- Secondary: White/10 glass
- Hover: Scale + shadow enhancement

---

## ✨ Key Improvements

### **Visual:**
✅ 3D floating cards add depth and interest  
✅ Glassmorphism consistent throughout  
✅ Gradient animations catch attention  
✅ Staggered entrance feels professional  

### **Content:**
✅ More specific to booking system  
✅ Clear value proposition  
✅ Service examples listed  
✅ Call-to-actions improved  

### **UX:**
✅ Hover interactions on all cards  
✅ Smooth animations (not jarring)  
✅ Mobile-optimized (cards hidden)  
✅ Sequential loading guides eye  

### **Performance:**
✅ Pure CSS animations (no JS)  
✅ GPU-accelerated transforms  
✅ Optimized keyframes  
✅ Responsive without bloat  

---

## 🚀 Testing

Access `http://127.0.0.1:8000/` and test:

### **Desktop:**
1. ✅ See 3 floating 3D cards
2. ✅ Hover cards to see scale effect
3. ✅ Watch gradient text animation
4. ✅ Observe staggered entrance
5. ✅ Test button hover effects

### **Mobile:**
1. ✅ Only Clock card visible
2. ✅ Stats in single column
3. ✅ All text readable
4. ✅ Buttons touch-friendly
5. ✅ Smooth animations

---

## 💡 Design Philosophy

### **Simple but Elegant:**
- Not overdone with effects
- Subtle 3D transforms
- Clean glassmorphism
- Professional look

### **Purposeful Animation:**
- Every animation has meaning
- 3D cards represent features
- Floating = dynamic, active
- Gradient = modern, engaging

### **Content-Focused:**
- Animations support content
- Not distracting from message
- Clear hierarchy maintained
- Easy to read and scan

---

**Status: HERO SECTION UPGRADED ✨**

Hero section sekarang dengan animasi 3D yang elegant, konten yang lebih relevan, dan glassmorphism yang stunning!
