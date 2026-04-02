export function CHECK_NODE_DEV_IS_TEST() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('TEST UTILS ONLY FOR TESTS');
  }
}
