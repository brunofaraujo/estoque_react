const useTrim = (text) => {
  return text.trimStart().replace(/\s+/g, " ");
};

export default useTrim;
