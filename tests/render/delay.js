// Emulate delays. For example, requests to the database, etc..
export default function emulateDelay(timeout){
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}