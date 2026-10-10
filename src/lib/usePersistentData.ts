'use client';

import { useState, useEffect } from 'react';

export function usePersistentData<T extends { id: string }>(
  entityKey: string,
  initialFallback: T[]
) {
  const storageKey = `6102_data_${entityKey}`;
  const [data, setData] = useState<T[]>(initialFallback);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load: localStorage first, then sync with Supabase API
  useEffect(() => {
    let localItems: T[] | null = null;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            localItems = parsed;
            setData(parsed);
          }
        } catch (e) {
          console.error(`Failed to parse cache for ${entityKey}:`, e);
        }
      }
    }

    // Fetch from Supabase API
    fetch(`/api/data/${entityKey}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setData(resData.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(resData.data));
          }
        } else if (!localItems) {
          // If no database records and no local storage, initialize with fallback
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(initialFallback));
          }
        }
      })
      .catch((err) => {
        console.warn(`Supabase sync failed for ${entityKey}, using local state:`, err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, [entityKey, storageKey]);

  // 2. Persist to localStorage whenever state changes after initial load
  const saveToStorage = (updatedList: T[]) => {
    setData(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    }
  };

  // 3. Add Item
  const addItem = async (item: T) => {
    const updated = [item, ...data];
    saveToStorage(updated);

    try {
      await fetch(`/api/data/${entityKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (e) {
      console.warn(`Background sync failed for adding ${entityKey}:`, e);
    }
  };

  // 4. Update Item
  const updateItem = async (id: string, updates: Partial<T>) => {
    const updated = data.map((item) => (item.id === id ? { ...item, ...updates } : item));
    saveToStorage(updated);

    try {
      await fetch(`/api/data/${entityKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) {
      console.warn(`Background sync failed for updating ${entityKey}:`, e);
    }
  };

  // 5. Delete Item
  const deleteItem = async (id: string) => {
    const updated = data.filter((item) => item.id !== id);
    saveToStorage(updated);

    try {
      await fetch(`/api/data/${entityKey}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn(`Background sync failed for deleting ${entityKey}:`, e);
    }
  };

  return {
    data,
    setData: saveToStorage,
    addItem,
    updateItem,
    deleteItem,
    isLoaded,
  };
}
