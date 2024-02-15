// store.js
import create from 'zustand';

export const useStore = create(set => ({
  favorites: [],
  favoriteDetails: [],
  setFavorites: (favorites) => set({ favorites }),
  setFavoriteDetails: (favoriteDetails) => set({ favoriteDetails }),
}));
