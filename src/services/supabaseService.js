import { supabase } from '../supabaseClient';

// Categories
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('"order"');

  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  }

  return data;
};

export const addCategory = async (category) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select();

  if (error) {
    console.error('Error adding category:', error);
    return null;
  }

  return data[0];
};

export const updateCategory = async (id, updates) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating category:', error);
    return null;
  }

  return data[0];
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
};

// Menu Items
export const fetchMenuItems = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  if (error) {
    console.error('Error fetching menu items:', error);
    return null;
  }

  return data;
};

export const addMenuItem = async (item) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([item])
    .select();

  if (error) {
    console.error('Error adding menu item:', error);
    return null;
  }

  return data[0];
};

export const updateMenuItem = async (id, updates) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating menu item:', error);
    return null;
  }

  return data[0];
};

export const deleteMenuItem = async (id) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }

  return true;
};

// Authentication
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return false;
  }

  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return data.user;
};

// Realtime subscription
export const subscribeToMenuChanges = (callback) => {
  const menuSubscription = supabase
    .channel('menu_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'menu_items'
    }, payload => {
      callback(payload);
    })
    .subscribe();

  return menuSubscription;
};

export const subscribeToCategoryChanges = (callback) => {
  const categorySubscription = supabase
    .channel('category_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'categories'
    }, payload => {
      callback(payload);
    })
    .subscribe();

  return categorySubscription;
};

// Storage functions for images
export const uploadImage = async (file, fileName) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${fileName}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

// Helper function to organize menu items by category
export const organizeMenuItemsByCategory = (menuItems, categories) => {
  const organizedData = {};

  // Initialize categories
  categories.forEach(category => {
    organizedData[category.id] = [];
  });

  // Populate categories with menu items
  menuItems.forEach(item => {
    if (organizedData[item.category_id]) {
      organizedData[item.category_id].push(item);
    }
  });

  return organizedData;
};
