import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, isLocalStorageAvailable, removeLocalStorage, setLocalStorage } from '../utils/localStorage';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // State để lưu giá trị
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Đọc giá trị từ localStorage khi component mount (chỉ trên client)
    useEffect(() => {
        if (isLocalStorageAvailable()) {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item) as T);
                }
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
            }
            setIsInitialized(true);
        }
    }, [key]);

    // Hàm để set giá trị
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Cho phép value là một function giống như useState
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);

                if (isLocalStorageAvailable()) {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Hàm để xóa giá trị
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (isLocalStorageAvailable()) {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}
