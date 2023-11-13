import * as SecureStorage from 'expo-secure-store'

export async function checkAvailability() {
  return await SecureStorage.isAvailableAsync()
}

export async function getSecureItem(
  key: string,
  options?: SecureStorage.SecureStoreOptions,
) {
  return await SecureStorage.getItemAsync(key, options)
}

export async function saveSecureItem(
  key: string,
  value: string,
  options?: SecureStorage.SecureStoreOptions,
) {
  return await SecureStorage.setItemAsync(key, value, options)
}

export async function deleteSecureItem(
  key: string,
  options?: SecureStorage.SecureStoreOptions,
) {
  return await SecureStorage.deleteItemAsync(key, options)
}
