/**
 * Утилита для быстрой отладки Supabase Storage через консоль браузера
 * 
 * Использование в консоли:
 * - window.checkStorageStatus() - проверить статус bucket
 * - window.initStorage() - инициализировать bucket
 * - window.openStorageAdmin() - открыть админ-панель
 * - window.openStorageDemo() - открыть демо-страницу
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb`;