# 📦 Supabase Storage - Image Management System

## 🎯 Overview

Katia Beauty Platform использует **Supabase Storage** для хранения и управления всеми изображениями:
- ✅ Логотипы салонов
- ✅ Фото продуктов
- ✅ Дизайны gift certificates
- ✅ Фото мастеров
- ✅ Галереи работ
- ✅ Аватары пользователей

---

## 📁 Folder Structure

Все изображения организованы в **bucket**: `katia-images`

```
katia-images/
├── logos/           # Логотипы салонов
├── products/        # Фото продуктов для продажи
├── certificates/    # Дизайны подарочных сертификатов
├── masters/         # Фото мастеров
├── gallery/         # Галерея работ салонов
├── avatars/         # Аватары пользователей
└── general/         # Общие изображения
```

---

## 🚀 Quick Start

### **1. Загрузка изображения (React Component)**

```tsx
import { ImageUploader } from './components/ImageUploader';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

function SalonSettings() {
  const [logoUrl, setLogoUrl] = useState('');

  return (
    <ImageUploader
      folder={IMAGE_FOLDERS.LOGOS}
      onUploadComplete={(url) => setLogoUrl(url)}
      currentImageUrl={logoUrl}
      label="Логотип салона"
    />
  );
}
```

### **2. Отображение изображения**

```tsx
import { SupabaseImage } from './components/SupabaseImage';

function SalonCard({ salon }) {
  return (
    <SupabaseImage
      src={salon.logoUrl}
      alt={salon.name}
      className="w-20 h-20 rounded-full object-cover"
      fallbackSrc="/default-logo.png"
    />
  );
}
```

### **3. Программная загрузка**

```tsx
import { useImageUpload } from '../hooks/useImageUpload';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

function MyComponent() {
  const { uploadImageFile, uploading, error, imageUrl } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageFile(file, IMAGE_FOLDERS.LOGOS);
      console.log('Uploaded:', url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {error && <p className="text-red-500">{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

---

## 🛠️ API Reference

### **Frontend Utils (`/src/utils/supabaseStorage.ts`)**

#### `uploadImage(file: File, folder: string): Promise<string>`

Загружает изображение и возвращает публичный URL.

```tsx
const url = await uploadImage(file, IMAGE_FOLDERS.LOGOS);
```

#### `listImages(folder?: string): Promise<ListImagesResponse>`

Получает список всех изображений в папке.

```tsx
const { files, count } = await listImages(IMAGE_FOLDERS.PRODUCTS);
files.forEach(img => console.log(img.publicUrl));
```

#### `deleteImage(filePath: string): Promise<void>`

Удаляет изображение из storage.

```tsx
await deleteImage('logos/1234567890-abc123.png');
```

#### `validateImageFile(file: File, maxSizeMB?: number): boolean`

Валидирует файл перед загрузкой.

```tsx
try {
  validateImageFile(file, 5); // Max 5MB
  console.log('Valid!');
} catch (error) {
  console.error(error.message);
}
```

---

### **Backend API Endpoints**

#### `POST /make-server-3e5c72fb/storage/upload`

Загрузить изображение.

**Request:**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'logos');

const response = await fetch(`${SERVER_URL}/storage/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
  },
  body: formData,
});
```

**Response:**
```json
{
  "filePath": "logos/1735132800000-abc123.png",
  "publicUrl": "https://your-project.supabase.co/storage/v1/object/public/katia-images/logos/1735132800000-abc123.png",
  "fileName": "logo.svg",
  "size": 12345,
  "type": "image/png"
}
```

---

#### `GET /make-server-3e5c72fb/storage/images/:folder?`

Получить список изображений.

**Request:**
```javascript
const response = await fetch(`${SERVER_URL}/storage/images/logos`, {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
  },
});
```

**Response:**
```json
{
  "files": [
    {
      "name": "1735132800000-abc123.png",
      "path": "logos/1735132800000-abc123.png",
      "publicUrl": "https://...",
      "created_at": "2024-12-25T12:00:00Z",
      "size": 12345
    }
  ],
  "count": 1,
  "folder": "logos"
}
```

---

#### `DELETE /make-server-3e5c72fb/storage/delete`

Удалить изображение.

**Request:**
```javascript
const response = await fetch(`${SERVER_URL}/storage/delete`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  },
  body: JSON.stringify({ 
    filePath: 'logos/1735132800000-abc123.png' 
  }),
});
```

**Response:**
```json
{
  "success": true,
  "deletedPath": "logos/1735132800000-abc123.png"
}
```

---

## 📋 Validation Rules

### **Allowed File Types:**
- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/webp`
- `image/svg+xml`

### **File Size Limit:**
- **Maximum:** 5 MB per file

### **File Naming:**
- Автоматически генерируется уникальное имя:
  ```
  {folder}/{timestamp}-{random}.{extension}
  ```
- Пример: `logos/1735132800000-abc123def.png`

---

## 🔒 Security & Access

### **Bucket Configuration:**
- **Type:** Public
- **Access:** Read-only для всех, Write через API с authentication
- **CDN:** Автоматически enabled через Supabase

### **Row Level Security (RLS):**
```sql
-- Пока bucket публичный, RLS не используется
-- В будущем можно добавить для приватных изображений
```

---

## 💡 Best Practices

### **✅ DO:**

1. **Используй правильные папки:**
   ```tsx
   uploadImage(logoFile, IMAGE_FOLDERS.LOGOS) // ✅
   uploadImage(productFile, IMAGE_FOLDERS.PRODUCTS) // ✅
   ```

2. **Валидируй перед загрузкой:**
   ```tsx
   validateImageFile(file, 5); // ✅
   ```

3. **Обрабатывай ошибки:**
   ```tsx
   try {
     const url = await uploadImage(file, folder);
   } catch (error) {
     console.error('Upload failed:', error);
     // Show user-friendly message
   }
   ```

4. **Используй SupabaseImage компонент:**
   ```tsx
   <SupabaseImage src={url} alt="..." fallbackSrc="/placeholder.png" />
   ```

### **❌ DON'T:**

1. **Не храни изображения в Git:**
   ```
   ❌ /public/images/uploaded-logo.png
   ✅ Supabase Storage URL
   ```

2. **Не используй локальные пути:**
   ```tsx
   ❌ <img src="/uploads/logo.png" />
   ✅ <SupabaseImage src={supabaseUrl} />
   ```

3. **Не забывай про fallback:**
   ```tsx
   ❌ <img src={url} />
   ✅ <SupabaseImage src={url} fallbackSrc="/placeholder.png" />
   ```

---

## 🧪 Testing

### **Upload Test:**
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/make-server-3e5c72fb/storage/upload \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -F "file=@/path/to/test-image.png" \
  -F "folder=logos"
```

### **List Test:**
```bash
curl https://your-project.supabase.co/functions/v1/make-server-3e5c72fb/storage/images/logos \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 📊 Storage Limits

| Plan | Storage | Bandwidth |
|------|---------|-----------|
| **Free** | 1 GB | 2 GB/month |
| **Pro** | 100 GB | 200 GB/month |
| **Enterprise** | Unlimited | Unlimited |

**Current Usage:** Check in Supabase Dashboard → Storage

---

## 🔧 Troubleshooting

### **Error: "Failed to upload image"**
- Проверь размер файла (max 5MB)
- Проверь тип файла (только PNG, JPG, WebP, SVG)
- Проверь SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env

### **Error: "Bucket does not exist"**
- Bucket создается автоматически при первом запуске сервера
- Проверь логи сервера: должно быть `✅ Bucket created: katia-images`

### **Images not loading:**
- Проверь публичный URL (должен начинаться с `https://`)
- Проверь bucket permissions (должен быть public)
- Проверь CORS settings

---

## 🚀 Migration Guide

### **Migrate from local images to Supabase:**

1. **Подготовь список изображений:**
   ```bash
   find public/images -type f -name "*.png" -o -name "*.jpg"
   ```

2. **Загрузи через API:**
   ```tsx
   const migrateImages = async () => {
     const images = [...]; // Array of File objects
     
     for (const img of images) {
       const url = await uploadImage(img, IMAGE_FOLDERS.LOGOS);
       console.log(`Migrated: ${url}`);
     }
   };
   ```

3. **Обнови database:**
   ```tsx
   await kv.set(`salon:${salonId}`, {
     ...salon,
     logoUrl: newSupabaseUrl, // Update from local path
   });
   ```

---

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [CDN & Caching](https://supabase.com/docs/guides/storage/cdn/fundamentals)
- [Image Transformations](https://supabase.com/docs/guides/storage/image-transformations)

---

**Created:** 25.12.2024  
**Last Updated:** 25.12.2024  
**Version:** 1.0.0
