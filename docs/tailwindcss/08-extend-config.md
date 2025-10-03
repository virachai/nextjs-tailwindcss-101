# Tailwind CSS: Extend Configuration

การใช้ `extend` ใน Tailwind Config เพื่อเพิ่มค่าใหม่โดยไม่เขียนทับค่าเดิม

## สารบัญ
- [Extend vs Override](#extend-vs-override)
- [การใช้งาน Extend](#การใช้งาน-extend)
- [ตัวอย่างการ Extend](#ตัวอย่างการ-extend)
- [Best Practices](#best-practices)

---

## Extend vs Override

### Override (เขียนทับค่าเดิม)
```ts
// tailwind.config.ts
export default {
  theme: {
    // ⚠️ จะเขียนทับค่า default ทั้งหมด
    colors: {
      primary: '#3490dc',
      secondary: '#ffed4e',
    }
    // ❌ สูญเสีย: slate, gray, zinc, red, blue, etc.
  }
}
```

### Extend (เพิ่มค่าใหม่โดยไม่เขียนทับ)
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      // ✅ เพิ่มสีใหม่ + เก็บค่า default ไว้
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4e',
      }
      // ✅ ยังใช้ slate, gray, zinc, red, blue ได้ตามปกติ
    }
  }
}
```

---

## การใช้งาน Extend

### 1. เพิ่มสีใหม่
```ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      }
    }
  }
}
```

**ใช้งาน:**
```tsx
<div className="bg-brand-500 text-brand-50">
  {/* ยังใช้ bg-blue-500 หรือ text-red-600 ได้ด้วย */}
</div>
```

### 2. เพิ่ม Font Family
```ts
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

**ใช้งาน:**
```tsx
<h1 className="font-display">Title</h1>
<p className="font-body">Body text</p>
{/* ยังใช้ font-sans, font-serif ได้ */}
```

### 3. เพิ่ม Spacing
```ts
export default {
  theme: {
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      }
    }
  }
}
```

**ใช้งาน:**
```tsx
<div className="w-72 h-96 p-128">
  {/* ยังใช้ w-4, h-8, p-6 ได้ตามปกติ */}
</div>
```

### 4. เพิ่ม Breakpoints
```ts
export default {
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        'xs': '475px',
      }
    }
  }
}
```

**ใช้งาน:**
```tsx
<div className="xs:text-sm 3xl:text-2xl">
  {/* ยังใช้ sm:, md:, lg:, xl:, 2xl: ได้ */}
</div>
```

---

## ตัวอย่างการ Extend

### Example 1: E-commerce Theme
```ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        accent: '#f59e0b',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
      }
    }
  }
}
```

### Example 2: Dashboard Theme
```ts
export default {
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1e293b',
          hover: '#334155',
          active: '#475569',
        },
        chart: {
          blue: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
        }
      },
      spacing: {
        'sidebar': '280px',
        'header': '64px',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  }
}
```

---

## Best Practices

### ✅ ควรใช้ Extend เมื่อ:
- ต้องการเพิ่มค่าใหม่โดยไม่สูญเสียค่า default
- สร้าง design system ที่เป็น extension ของ Tailwind
- เพิ่ม brand colors, custom fonts, spacing ใหม่
- ต้องการความยืดหยุ่นในการใช้ทั้งค่าเดิมและค่าใหม่

### ❌ ไม่ควรใช้ Extend เมื่อ:
- ต้องการ replace ค่า default ทั้งหมด (ใช้ override แทน)
- ต้องการลด bundle size โดยใช้เฉพาะสีที่กำหนดเอง

### 🎯 Tips
1. **ใช้ semantic naming**
   ```ts
   colors: {
     primary: {...},
     secondary: {...},
     accent: {...},
   }
   ```

2. **Group related values**
   ```ts
   extend: {
     colors: { /* all colors */ },
     spacing: { /* all spacing */ },
     animation: { /* all animations */ },
   }
   ```

3. **Document custom values**
   ```ts
   extend: {
     // Brand colors from design system
     colors: {
       brand: { /* ... */ }
     },
     // Custom breakpoint for ultra-wide screens
     screens: {
       '3xl': '1920px'
     }
   }
   ```

---

## เปรียบเทียบ Override vs Extend

| Feature | Override | Extend |
|---------|----------|--------|
| **ค่า Default** | ❌ สูญหาย | ✅ คงอยู่ |
| **Bundle Size** | เล็กกว่า | ใหญ่กว่า |
| **ความยืดหยุ่น** | จำกัด | สูง |
| **Use Case** | Custom design system | เพิ่มเติม Tailwind |

### ตัวอย่างผลลัพธ์

**Override:**
```ts
theme: {
  colors: { primary: '#000' }
}
// ✅ ใช้ได้: bg-primary
// ❌ ใช้ไม่ได้: bg-blue-500, bg-red-600
```

**Extend:**
```ts
theme: {
  extend: {
    colors: { primary: '#000' }
  }
}
// ✅ ใช้ได้: bg-primary
// ✅ ใช้ได้: bg-blue-500, bg-red-600
```

---

## สรุป

- **Extend** = เพิ่ม + คงเดิม ✅
- **Override** = แทนที่ทั้งหมด ⚠️
- ส่วนใหญ่ใช้ **extend** เพื่อความยืดหยุ่น
- ใช้ **override** เฉพาะเมื่อต้องการควบคุม design system ทั้งหมด

---

*Reference: [Tailwind CSS - Theme Configuration](https://tailwindcss.com/docs/theme)*
