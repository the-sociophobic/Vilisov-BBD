export default (array, N) =>
  array
    .sort(() => Math.random() - Math.random())
    .slice(0, N)