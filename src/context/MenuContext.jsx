import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { menuData as defaultMenuData, categories as defaultCategories } from '../data/menuData';
import {
  fetchCategories,
  fetchMenuItems,
  addMenuItem as addMenuItemToSupabase,
  updateMenuItem as updateMenuItemInSupabase,
  deleteMenuItem as deleteMenuItemFromSupabase,
  addCategory as addCategoryToSupabase,
  updateCategory as updateCategoryInSupabase,
  deleteCategory as deleteCategoryFromSupabase,
  organizeMenuItemsByCategory,
  subscribeToMenuChanges,
  subscribeToCategoryChanges
} from '../services/supabaseService';

// Create the context
const MenuContext = createContext();

// Create a provider component
export const MenuProvider = ({ children }) => {
  // State for online/offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // State for loading status
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from localStorage or use default data
  const [menuData, setMenuData] = useState(() => {
    const savedMenuData = localStorage.getItem('casanova_menuData');
    return savedMenuData ? JSON.parse(savedMenuData) : defaultMenuData;
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('casanova_categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  // Add a refresh timestamp to trigger re-renders
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Check for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to load data from Supabase
  const fetchDataFromSupabase = useCallback(async () => {
    if (!isOnline) {
      console.log('Offline mode: using localStorage data');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch categories
      const categoriesData = await fetchCategories();
      if (categoriesData) {
        setCategories(categoriesData);
        localStorage.setItem('casanova_categories', JSON.stringify(categoriesData));
      }

      // Fetch menu items
      const menuItemsData = await fetchMenuItems();
      if (menuItemsData && categoriesData) {
        const organizedData = organizeMenuItemsByCategory(menuItemsData, categoriesData);
        setMenuData(organizedData);
        localStorage.setItem('casanova_menuData', JSON.stringify(organizedData));
      }

      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  // Function to load data from localStorage (fallback for offline mode)
  const refreshDataFromLocalStorage = useCallback(() => {
    try {
      const savedMenuData = localStorage.getItem('casanova_menuData');
      const savedCategories = localStorage.getItem('casanova_categories');

      if (savedMenuData) {
        const parsedMenuData = JSON.parse(savedMenuData);
        setMenuData(parsedMenuData);
      }

      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      }

      // Update the timestamp to trigger re-renders
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (isOnline) {
      fetchDataFromSupabase();
    } else {
      refreshDataFromLocalStorage();
    }
  }, [isOnline, fetchDataFromSupabase, refreshDataFromLocalStorage]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!isOnline) return;

    // Subscribe to menu item changes
    const menuSubscription = subscribeToMenuChanges((payload) => {
      console.log('Menu item changed:', payload);
      fetchDataFromSupabase();
    });

    // Subscribe to category changes
    const categorySubscription = subscribeToCategoryChanges((payload) => {
      console.log('Category changed:', payload);
      fetchDataFromSupabase();
    });

    return () => {
      menuSubscription.unsubscribe();
      categorySubscription.unsubscribe();
    };
  }, [isOnline, fetchDataFromSupabase]);

  // Function to force a refresh of the menu data
  const refreshMenu = useCallback(() => {
    console.log('Menu refresh requested at:', new Date().toLocaleTimeString());

    if (isOnline) {
      fetchDataFromSupabase();
    } else {
      refreshDataFromLocalStorage();
    }

    console.log('Menu refreshed at:', new Date().toLocaleTimeString());
  }, [isOnline, fetchDataFromSupabase, refreshDataFromLocalStorage]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('casanova_menuData', JSON.stringify(menuData));
    console.log('Menu data saved to localStorage:', menuData);
  }, [menuData]);

  useEffect(() => {
    localStorage.setItem('casanova_categories', JSON.stringify(categories));
    console.log('Categories saved to localStorage:', categories);
  }, [categories]);

  // Function to update menu data
  const updateMenuData = (newMenuData) => {
    setMenuData(newMenuData);
    // In a real app, you would save this to a database or API
    console.log('Menu data updated:', newMenuData);
  };

  // Function to update categories
  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    // In a real app, you would save this to a database or API
    console.log('Categories updated:', newCategories);
  };

  // Function to add a new item to a category
  const addMenuItem = async (categoryId, newItem) => {
    try {
      console.log('Adding new item to category:', categoryId, newItem);

      // Create a lightweight version of the image URL to prevent loading issues
      // Convert camelCase to snake_case for Supabase
      const optimizedItem = {
        ...newItem,
        category_id: categoryId,
        // Convert isPopular to is_popular for Supabase
        is_popular: newItem.isPopular,
        is_special: newItem.isSpecial,
        // Remove camelCase properties that don't match the database schema
        isPopular: undefined,
        isSpecial: undefined,
        // Add a cache-busting parameter to the image URL
        image: newItem.image.includes('?')
          ? `${newItem.image}&v=${Date.now()}`
          : `${newItem.image}?v=${Date.now()}`
      };

      console.log('Optimized item for Supabase:', optimizedItem);

      if (isOnline) {
        // Add to Supabase
        const addedItem = await addMenuItemToSupabase(optimizedItem);
        if (!addedItem) return false;

        // Refresh data from Supabase
        await fetchDataFromSupabase();
      } else {
        // Offline mode: update local state
        const updatedMenuData = JSON.parse(JSON.stringify(menuData));

        if (!updatedMenuData[categoryId]) {
          updatedMenuData[categoryId] = [];
        }

        updatedMenuData[categoryId].push(optimizedItem);
        setMenuData(updatedMenuData);
        localStorage.setItem('casanova_menuData', JSON.stringify(updatedMenuData));
      }

      setLastRefresh(Date.now());
      console.log('New item added:', optimizedItem);
      return true;
    } catch (error) {
      console.error('Error adding menu item:', error);
      return false;
    }
  };

  // Function to update an existing item
  const updateMenuItem = async (categoryId, updatedItem) => {
    try {
      console.log('Updating item in category:', categoryId, updatedItem);

      // Create a lightweight version of the image URL to prevent loading issues
      // Convert camelCase to snake_case for Supabase
      const optimizedItem = {
        ...updatedItem,
        category_id: categoryId,
        // Convert isPopular to is_popular for Supabase
        is_popular: updatedItem.isPopular,
        is_special: updatedItem.isSpecial,
        // Remove camelCase properties that don't match the database schema
        isPopular: undefined,
        isSpecial: undefined,
        // Add a cache-busting parameter to the image URL if it's a new URL
        image: updatedItem.image.includes('?')
          ? updatedItem.image
          : `${updatedItem.image}?v=${Date.now()}`
      };

      console.log('Optimized item for Supabase update:', optimizedItem);

      if (isOnline) {
        // Update in Supabase
        const updatedItemFromSupabase = await updateMenuItemInSupabase(optimizedItem.id, optimizedItem);
        if (!updatedItemFromSupabase) return false;

        // Refresh data from Supabase
        await fetchDataFromSupabase();
      } else {
        // Offline mode: update local state
        const updatedMenuData = JSON.parse(JSON.stringify(menuData));

        if (!updatedMenuData[categoryId]) {
          updatedMenuData[categoryId] = [];
          return false;
        }

        const itemIndex = updatedMenuData[categoryId].findIndex(item => item.id === optimizedItem.id);

        if (itemIndex !== -1) {
          updatedMenuData[categoryId][itemIndex] = optimizedItem;
          setMenuData(updatedMenuData);
          localStorage.setItem('casanova_menuData', JSON.stringify(updatedMenuData));
        } else {
          return false;
        }
      }

      setLastRefresh(Date.now());
      console.log('Item updated:', optimizedItem);
      return true;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return false;
    }
  };

  // Function to delete an item
  const deleteMenuItem = async (categoryId, itemId) => {
    try {
      console.log('Deleting item from category:', categoryId, itemId);

      if (isOnline) {
        // Delete from Supabase
        const success = await deleteMenuItemFromSupabase(itemId);
        if (!success) return false;

        // Refresh data from Supabase
        await fetchDataFromSupabase();
      } else {
        // Offline mode: update local state
        const updatedMenuData = JSON.parse(JSON.stringify(menuData));

        if (!updatedMenuData[categoryId]) {
          return false;
        }

        updatedMenuData[categoryId] = updatedMenuData[categoryId].filter(item => item.id !== itemId);
        setMenuData(updatedMenuData);
        localStorage.setItem('casanova_menuData', JSON.stringify(updatedMenuData));
      }

      setLastRefresh(Date.now());
      console.log('Item deleted:', itemId);
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
  };

  // Function to add a new category
  const addCategory = async (newCategory) => {
    try {
      console.log('Adding new category:', newCategory);

      // Check if category ID already exists
      if (categories.some(cat => cat.id === newCategory.id)) {
        return false;
      }

      // Add order field if not present
      const categoryWithOrder = {
        ...newCategory,
        order: newCategory.order || categories.length + 1
      };

      if (isOnline) {
        // Add to Supabase
        const addedCategory = await addCategoryToSupabase(categoryWithOrder);
        if (!addedCategory) return false;

        // Refresh data from Supabase
        await fetchDataFromSupabase();
      } else {
        // Offline mode: update local state
        const updatedCategories = JSON.parse(JSON.stringify(categories));
        updatedCategories.push(categoryWithOrder);
        setCategories(updatedCategories);
        localStorage.setItem('casanova_categories', JSON.stringify(updatedCategories));

        const updatedMenuData = JSON.parse(JSON.stringify(menuData));
        updatedMenuData[categoryWithOrder.id] = [];
        setMenuData(updatedMenuData);
        localStorage.setItem('casanova_menuData', JSON.stringify(updatedMenuData));
      }

      setLastRefresh(Date.now());
      console.log('New category added:', newCategory);
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };

  // Function to delete a category
  const deleteCategory = async (categoryId) => {
    try {
      console.log('Deleting category:', categoryId);

      if (categoryId === 'plats' || categoryId === 'sandwichs' || categoryId === 'boissons' || categoryId === 'desserts') {
        return false;
      }

      if (isOnline) {
        // Delete from Supabase
        const success = await deleteCategoryFromSupabase(categoryId);
        if (!success) return false;

        // Refresh data from Supabase
        await fetchDataFromSupabase();
      } else {
        // Offline mode: update local state
        const updatedCategories = JSON.parse(JSON.stringify(categories));
        const filteredCategories = updatedCategories.filter(cat => cat.id !== categoryId);
        setCategories(filteredCategories);
        localStorage.setItem('casanova_categories', JSON.stringify(filteredCategories));

        const updatedMenuData = JSON.parse(JSON.stringify(menuData));
        delete updatedMenuData[categoryId];
        setMenuData(updatedMenuData);
        localStorage.setItem('casanova_menuData', JSON.stringify(updatedMenuData));
      }

      setLastRefresh(Date.now());
      console.log('Category deleted:', categoryId);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  // Debug function to reset data to defaults
  const resetToDefaults = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      console.log('Resetting data to defaults');

      // Reset menu data to defaults
      setMenuData(defaultMenuData);

      // Reset categories to defaults
      setCategories(defaultCategories);

      // Clear localStorage
      localStorage.removeItem('casanova_menuData');
      localStorage.removeItem('casanova_categories');

      // Set localStorage with default values
      localStorage.setItem('casanova_menuData', JSON.stringify(defaultMenuData));
      localStorage.setItem('casanova_categories', JSON.stringify(defaultCategories));

      // If online, sync with Supabase (this would require additional implementation)
      if (isOnline) {
        // This would require implementing a reset function in the Supabase service
        // For now, we'll just refresh the data
        await fetchDataFromSupabase();
      }

      setLastRefresh(Date.now());
      console.log('Data reset to defaults');
      return true;
    }
    return false;
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('Current menuData:', menuData);
    console.log('Current categories:', categories);
    console.log('localStorage menuData:', localStorage.getItem('casanova_menuData'));
    console.log('localStorage categories:', localStorage.getItem('casanova_categories'));
    console.log('Online status:', isOnline);
  };

  return (
    <MenuContext.Provider value={{
      menuData,
      categories,
      isLoading,
      isOnline,
      updateMenuData,
      updateCategories,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory,
      deleteCategory,
      resetToDefaults,
      debugState,
      refreshMenu,
      lastRefresh
    }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to use the menu context
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export default MenuContext;
