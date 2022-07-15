const store = new Map()

export function setData(key: string, data: any) {
  store.set(key, data)
}

export function getData(key: string) {
  return store.get(key)
}

export function removeData(key: string) {
  return store.delete(key)
}

export function hasData(key) {
  return store.has(key)
}

export function clear() {
  return store.clear()
}