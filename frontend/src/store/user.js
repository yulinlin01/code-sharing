import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: []
  }),
  
  getters: {
    getAllUsers: (state) => state.users,
    getUserById: (state) => (id) => state.users.find(user => user._id === id),
    getUserByUsername: (state) => (username) => state.users.find(user => user.username === username)
  },
  
  actions: {
    setUsers(users) {
      this.users = users
    },
    
    addUser(user) {
      this.users.push(user)
    },
    
    updateUser(updatedUser) {
      const index = this.users.findIndex(user => user._id === updatedUser._id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
    },
    
    removeUser(userId) {
      this.users = this.users.filter(user => user._id !== userId)
    },
    
    clearUsers() {
      this.users = []
    }
  }
})
