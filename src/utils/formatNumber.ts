export default (num: number): string => {
  if (Math.abs(num) < 1000) return num.toString();

  const absNum = Math.abs(num);
  const abbreviations = ["", "K", "M", "B", "T"];
  const scale = Math.min(
    Math.floor(Math.log10(absNum) / 3),
    abbreviations.length - 1
  );
  const scaledNum = num / Math.pow(10, scale * 3);
  const formattedNum = scaledNum.toFixed(1);
  return formattedNum.replace(/\.0$/, "") + abbreviations[scale];
};
