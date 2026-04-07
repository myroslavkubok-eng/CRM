import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const feedRoutes = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// ===========================================
// GET ALL FEED POSTS
// Возвращает все посты в ленте, отсортированные по дате
// ===========================================
feedRoutes.get("/make-server-3e5c72fb/feed/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("feed:post:");
    
    // Сортируем по дате создания (новые сверху)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return c.json({
      success: true,
      posts: sortedPosts,
    });
  } catch (error) {
    console.error("[Feed] Error fetching posts:", error);
    return c.json(
      { 
        success: false, 
        error: "Failed to fetch feed posts",
        details: error.message 
      },
      500
    );
  }
});

// ===========================================
// GET POSTS BY SALON ID
// Возвращает все посты конкретного салона
// ===========================================
feedRoutes.get("/make-server-3e5c72fb/feed/posts/salon/:salonId", async (c) => {
  try {
    const salonId = c.req.param("salonId");
    const allPosts = await kv.getByPrefix("feed:post:");
    
    // Фильтруем по salonId
    const salonPosts = allPosts.filter(post => post.salonId === salonId);
    
    // Сортируем по дате
    const sortedPosts = salonPosts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return c.json({
      success: true,
      posts: sortedPosts,
    });
  } catch (error) {
    console.error("[Feed] Error fetching salon posts:", error);
    return c.json(
      { 
        success: false, 
        error: "Failed to fetch salon posts",
        details: error.message 
      },
      500
    );
  }
});

// ===========================================
// CREATE NEW FEED POST
// Создание нового поста (требует авторизации)
// Доступно только для owner и admin
// ===========================================
feedRoutes.post("/make-server-3e5c72fb/feed/posts", async (c) => {
  try {
    // Проверяем авторизацию
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error("[Feed] Authorization error:", authError);
      return c.json({ 
        success: false, 
        error: "Unauthorized - invalid token",
        details: authError?.message 
      }, 401);
    }

    // Получаем данные поста из request body
    const postData = await c.req.json();
    
    const {
      salonId,
      salonName,
      type, // 'post' | 'last-minute'
      title,
      description,
      imageUrl,
      category,
      // Для last-minute постов:
      serviceId,
      serviceName,
      originalPrice,
      discountPrice,
      availableDate,
      availableTime,
    } = postData;

    // Валидация обязательных полей
    if (!salonId || !salonName || !type || !title) {
      return c.json({
        success: false,
        error: "Missing required fields: salonId, salonName, type, title",
      }, 400);
    }

    // Создаем ID поста
    const postId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Формируем объект поста
    const newPost = {
      id: postId,
      salonId,
      salonName,
      type,
      title,
      description: description || "",
      imageUrl: imageUrl || "",
      category: category || "",
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.user_metadata?.full_name || user.email || "Unknown",
      // Дополнительные поля для услуг
      serviceId: serviceId || "",
      // Дополнительные поля для last-minute
      ...(type === "last-minute" && {
        serviceName,
        originalPrice,
        discountPrice,
        availableDate,
        availableTime,
      }),
    };

    // Сохраняем в KV store
    await kv.set(`feed:post:${postId}`, newPost);

    console.log(`[Feed] Created new ${type} post: ${postId} by user ${user.id}`);

    return c.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("[Feed] Error creating post:", error);
    return c.json(
      { 
        success: false, 
        error: "Failed to create feed post",
        details: error.message 
      },
      500
    );
  }
});

// ===========================================
// DELETE FEED POST
// Удаление поста (требует авторизации)
// Может удалить только автор поста
// ===========================================
feedRoutes.delete("/make-server-3e5c72fb/feed/posts/:postId", async (c) => {
  try {
    // Проверяем авторизацию
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error("[Feed] Authorization error:", authError);
      return c.json({ 
        success: false, 
        error: "Unauthorized - invalid token" 
      }, 401);
    }

    const postId = c.req.param("postId");
    
    // Получаем пост
    const post = await kv.get(`feed:post:${postId}`);
    
    if (!post) {
      return c.json({
        success: false,
        error: "Post not found",
      }, 404);
    }

    // Проверяем, что пользователь - автор поста
    if (post.authorId !== user.id) {
      return c.json({
        success: false,
        error: "Forbidden - you can only delete your own posts",
      }, 403);
    }

    // Удаляем пост
    await kv.del(`feed:post:${postId}`);

    console.log(`[Feed] Deleted post: ${postId} by user ${user.id}`);

    return c.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("[Feed] Error deleting post:", error);
    return c.json(
      { 
        success: false, 
        error: "Failed to delete post",
        details: error.message 
      },
      500
    );
  }
});

// ===========================================
// LIKE/UNLIKE POST (Optional future feature)
// ===========================================
feedRoutes.post("/make-server-3e5c72fb/feed/posts/:postId/like", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const postId = c.req.param("postId");
    
    // Получаем пост
    const post = await kv.get(`feed:post:${postId}`);
    
    if (!post) {
      return c.json({ success: false, error: "Post not found" }, 404);
    }

    // И��ициализируем массив лайков, если его нет
    if (!post.likes) {
      post.likes = [];
    }

    // Проверяем, лайкнул ли уже пользователь
    const alreadyLiked = post.likes.includes(user.id);

    if (alreadyLiked) {
      // Unlike - удаляем из массива
      post.likes = post.likes.filter((id: string) => id !== user.id);
    } else {
      // Like - добавляем в массив
      post.likes.push(user.id);
    }

    // Обновляем пост
    await kv.set(`feed:post:${postId}`, post);

    return c.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("[Feed] Error toggling like:", error);
    return c.json(
      { 
        success: false, 
        error: "Failed to toggle like",
        details: error.message 
      },
      500
    );
  }
});

export default feedRoutes;