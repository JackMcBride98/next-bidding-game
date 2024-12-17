export const formatName = (name: string): string => {
  return name?.charAt(0).toUpperCase() + name?.toLowerCase().slice(1);
};
