let currentOpen = null;

export const openDropdown = (id, closeFn) => {
  if (currentOpen && currentOpen !== id) {
    currentOpen.close();
  }
  currentOpen = { id, close: closeFn };
};

export const closeDropdown = (id) => {
  if (currentOpen && currentOpen.id === id) {
    currentOpen = null;
  }
};
