import * as SecureStore from 'expo-secure-store';

// Offline storage utilities
export const offlineStorage = {
    // Store meal data offline
    storeMealOffline: async (meal) => {
        try {
            const existingMeals = await offlineStorage.getOfflineMeals();
            const offlineId = `offline_${Date.now()}`;
            const mealWithOfflineId = { ...meal, id: offlineId, isOffline: true };

            const updatedMeals = [...existingMeals, mealWithOfflineId];
            await SecureStore.setItemAsync('offline_meals', JSON.stringify(updatedMeals));

            return mealWithOfflineId;
        } catch (error) {
            console.error('Error storing meal offline:', error);
            throw error;
        }
    },

    // Get offline meals
    getOfflineMeals: async () => {
        try {
            const offlineMealsJson = await SecureStore.getItemAsync('offline_meals');
            return offlineMealsJson ? JSON.parse(offlineMealsJson) : [];
        } catch (error) {
            console.error('Error getting offline meals:', error);
            return [];
        }
    },

    // Sync offline data when online
    syncOfflineData: async () => {
        try {
            const offlineMeals = await offlineStorage.getOfflineMeals();
            const syncPromises = offlineMeals.map(async (meal) => {
                if (meal.isOffline) {
                    // Remove offline properties before syncing
                    const { id, isOffline, ...mealData } = meal;
                    // This would call your actual API
                    // await mealsAPI.createMeal(mealData);
                    return meal;
                }
                return null;
            });

            await Promise.all(syncPromises);

            // Clear offline data after successful sync
            await SecureStore.deleteItemAsync('offline_meals');

            return true;
        } catch (error) {
            console.error('Error syncing offline data:', error);
            throw error;
        }
    },

    // Clear all offline data
    clearOfflineData: async () => {
        try {
            await SecureStore.deleteItemAsync('offline_meals');
        } catch (error) {
            console.error('Error clearing offline data:', error);
        }
    },
};

// Network connectivity utilities
export const networkUtils = {
    // Check if device is online
    isOnline: async () => {
        // This would typically use @react-native-async-storage/async-storage
        // and check network connectivity
        return true; // Placeholder
    },

    // Handle network state changes
    onNetworkChange: (callback) => {
        // This would set up network state listeners
        // NetInfo.addEventListener(callback);
    },
};

// Image utilities
export const imageUtils = {
    // Compress image for better performance
    compressImage: async (imageUri, quality = 0.8) => {
        // This would use expo-image-manipulator or similar
        return imageUri;
    },

    // Generate thumbnail
    generateThumbnail: async (imageUri) => {
        // This would create a smaller version of the image
        return imageUri;
    },
};

// Notification utilities (for meal reminders, etc.)
export const notificationUtils = {
    // Schedule a meal reminder
    scheduleMealReminder: async (title, body, scheduledTime) => {
        // This would use expo-notifications
        console.log('Scheduling notification:', { title, body, scheduledTime });
    },

    // Request notification permissions
    requestPermissions: async () => {
        // This would request notification permissions
        return true;
    },
};