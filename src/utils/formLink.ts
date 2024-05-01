export const validateLink = (url: string): boolean => {
  const regex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;

  if (!regex.test(url)) return false;

  return true;
};

export const validateName = (
  name: string
): { error: boolean; message: string } => {
  const regexSpaces = /^\S+$/;
  const regexMinus = /^[a-z-]+$/;

  if (!name.trim()) return { error: true, message: "Name is required" };

  if (!regexSpaces.test(name))
    return {
      error: true,
      message: "Name must not contain spaces",
    };

  if (!regexMinus.test(name))
    return {
      error: true,
      message: "Name must only contain lowercase characters and hyphens",
    };

  return { error: false, message: "OK" };
};
