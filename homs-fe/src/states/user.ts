import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type UserRole = 'admin' | 'user'

export const useUserStore = defineStore('user', () => {
  const role = ref<UserRole>('user') // 기본값은 'user'
  const isAdmin = computed(() => role.value === 'admin')

  function setRole(newRole: UserRole) {
    role.value = newRole
  }

  return { role, isAdmin, setRole }
})
