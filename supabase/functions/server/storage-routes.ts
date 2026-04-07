import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Создаем Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Имя bucket для изображений платформы
const KATIA_IMAGES_BUCKET = "katia-images";

/**
 * Инициализация bucket при старте сервера
 * Вызывается автоматически при первом запросе
 */
async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(
      (bucket) => bucket.name === KATIA_IMAGES_BUCKET
    );

    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${KATIA_IMAGES_BUCKET}`);
      const { error } = await supabase.storage.createBucket(KATIA_IMAGES_BUCKET, {
        public: true, // Публичный доступ для быстрой загрузки
        fileSizeLimit: 5242880, // 5MB лимит
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
          "image/svg+xml",
        ],
      });

      if (error) {
        console.error("❌ Error creating bucket:", error);
        throw error;
      }

      console.log(`✅ Bucket created: ${KATIA_IMAGES_BUCKET}`);
    }
  } catch (error) {
    console.error("❌ Error ensuring bucket exists:", error);
  }
}

// Инициализируем bucket при загрузке модуля
ensureBucketExists();

/**
 * GET /make-server-3e5c72fb/storage/init
 * Принудительная инициализация bucket (для админов)
 */
app.get("/make-server-3e5c72fb/storage/init", async (c) => {
  try {
    await ensureBucketExists();
    
    // Получаем информацию о bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const katiaImagesBucket = buckets?.find(b => b.name === KATIA_IMAGES_BUCKET);
    
    return c.json({
      success: true,
      message: "Bucket initialized successfully",
      bucket: katiaImagesBucket,
      bucketName: KATIA_IMAGES_BUCKET,
      allBuckets: buckets?.map(b => b.name) || [],
    });
  } catch (error) {
    console.error("❌ Error in init endpoint:", error);
    return c.json(
      { error: "Failed to initialize bucket" },
      { status: 500 }
    );
  }
});

/**
 * GET /make-server-3e5c72fb/storage/status
 * Проверить статус bucket и получить статистику
 */
app.get("/make-server-3e5c72fb/storage/status", async (c) => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const katiaImagesBucket = buckets?.find(b => b.name === KATIA_IMAGES_BUCKET);
    
    if (!katiaImagesBucket) {
      return c.json({
        exists: false,
        message: "Bucket not found. Call /storage/init to create it.",
      });
    }
    
    // Получаем статистику по папкам
    const folders = ["logos", "products", "certificates", "masters", "gallery", "avatars", "general"];
    const folderStats = await Promise.all(
      folders.map(async (folder) => {
        const { data, error } = await supabase.storage
          .from(KATIA_IMAGES_BUCKET)
          .list(folder, { limit: 1000 });
        
        return {
          folder,
          count: data?.length || 0,
          error: error?.message,
        };
      })
    );
    
    return c.json({
      exists: true,
      bucket: katiaImagesBucket,
      bucketName: KATIA_IMAGES_BUCKET,
      folders: folderStats,
      totalImages: folderStats.reduce((sum, f) => sum + f.count, 0),
    });
  } catch (error) {
    console.error("❌ Error in status endpoint:", error);
    return c.json(
      { error: "Failed to get bucket status" },
      { status: 500 }
    );
  }
});

/**
 * GET /make-server-3e5c72fb/storage/upload-url
 * Получить signed URL для загрузки изображения
 */
app.post("/make-server-3e5c72fb/storage/upload-url", async (c) => {
  try {
    const { fileName, fileType, folder = "general" } = await c.req.json();

    if (!fileName || !fileType) {
      return c.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split(".").pop();
    const uniqueFileName = `${folder}/${timestamp}-${randomStr}.${extension}`;

    // Создаем signed URL для загрузки (действителен 60 секунд)
    const { data, error } = await supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .createSignedUploadUrl(uniqueFileName);

    if (error) {
      console.error("❌ Error creating upload URL:", error);
      return c.json({ error: error.message }, { status: 500 });
    }

    // Получаем публичный URL для будущего использования
    const { data: publicUrlData } = supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .getPublicUrl(uniqueFileName);

    return c.json({
      uploadUrl: data.signedUrl,
      filePath: uniqueFileName,
      publicUrl: publicUrlData.publicUrl,
      token: data.token,
    });
  } catch (error) {
    console.error("❌ Error in upload-url endpoint:", error);
    return c.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
});

/**
 * POST /make-server-3e5c72fb/storage/upload
 * Загрузить изображение напрямую
 */
app.post("/make-server-3e5c72fb/storage/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return c.json({ error: "No file provided" }, { status: 400 });
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const uniqueFileName = `${folder}/${timestamp}-${randomStr}.${extension}`;

    // Конвертируем File в ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Загружаем файл
    const { data, error } = await supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .upload(uniqueFileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Error uploading file:", error);
      return c.json({ error: error.message }, { status: 500 });
    }

    // Получаем публичный URL
    const { data: publicUrlData } = supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    console.log(`✅ File uploaded: ${uniqueFileName}`);

    return c.json({
      filePath: data.path,
      publicUrl: publicUrlData.publicUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("❌ Error in upload endpoint:", error);
    return c.json({ error: "Failed to upload file" }, { status: 500 });
  }
});

/**
 * GET /make-server-3e5c72fb/storage/images/:folder?
 * Получить список всех изображений в bucket (или в конкретной папке)
 */
app.get("/make-server-3e5c72fb/storage/images/:folder?", async (c) => {
  try {
    const folder = c.req.param("folder") || "";

    const { data, error } = await supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("❌ Error listing files:", error);
      return c.json({ error: error.message }, { status: 500 });
    }

    // Добавляем публичные URLs к каждому файлу
    const filesWithUrls = data.map((file) => {
      const path = folder ? `${folder}/${file.name}` : file.name;
      const { data: publicUrlData } = supabase.storage
        .from(KATIA_IMAGES_BUCKET)
        .getPublicUrl(path);

      return {
        ...file,
        path,
        publicUrl: publicUrlData.publicUrl,
      };
    });

    return c.json({
      files: filesWithUrls,
      count: filesWithUrls.length,
      folder: folder || "root",
    });
  } catch (error) {
    console.error("❌ Error in images endpoint:", error);
    return c.json({ error: "Failed to list images" }, { status: 500 });
  }
});

/**
 * DELETE /make-server-3e5c72fb/storage/delete
 * Удалить изображение из bucket
 */
app.delete("/make-server-3e5c72fb/storage/delete", async (c) => {
  try {
    const { filePath } = await c.req.json();

    if (!filePath) {
      return c.json({ error: "filePath is required" }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("❌ Error deleting file:", error);
      return c.json({ error: error.message }, { status: 500 });
    }

    console.log(`🗑️ File deleted: ${filePath}`);

    return c.json({ success: true, deletedPath: filePath });
  } catch (error) {
    console.error("❌ Error in delete endpoint:", error);
    return c.json({ error: "Failed to delete file" }, { status: 500 });
  }
});

/**
 * GET /make-server-3e5c72fb/storage/public-url/:path
 * Получить публичный URL для файла
 */
app.get("/make-server-3e5c72fb/storage/public-url/*", async (c) => {
  try {
    const path = c.req.path.replace(
      "/make-server-3e5c72fb/storage/public-url/",
      ""
    );

    if (!path) {
      return c.json({ error: "path is required" }, { status: 400 });
    }

    const { data } = supabase.storage
      .from(KATIA_IMAGES_BUCKET)
      .getPublicUrl(path);

    return c.json({ publicUrl: data.publicUrl, path });
  } catch (error) {
    console.error("❌ Error in public-url endpoint:", error);
    return c.json({ error: "Failed to get public URL" }, { status: 500 });
  }
});

export default app;