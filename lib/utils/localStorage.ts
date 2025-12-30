/**
 * Kiểm tra xem localStorage có khả dụng không (client-side)
 */
export const isLocalStorageAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
        const test = '__localStorage_test__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Lấy giá trị từ localStorage với type-safety
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
    if (!isLocalStorageAvailable()) return defaultValue;

    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * Lưu giá trị vào localStorage
 */
export const setLocalStorage = <T>(key: string, value: T): boolean => {
    if (!isLocalStorageAvailable()) return false;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Xóa một key từ localStorage
 */
export const removeLocalStorage = (key: string): boolean => {
    if (!isLocalStorageAvailable()) return false;

    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Xóa toàn bộ localStorage
 */
export const clearLocalStorage = (): boolean => {
    if (!isLocalStorageAvailable()) return false;

    try {
        window.localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};