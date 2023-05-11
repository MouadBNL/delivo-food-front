import { defineStore } from 'pinia'
import http from '../services/http'

interface StoreI {
    token: string | null,
    user: {
        id: number,
        name: string,
        email: string,
        role: string,
    } | null,
    isLoadingToken: boolean
}

export const useAuthStore = defineStore('auth', {
  state: ():StoreI =>({
    token: "",
    user: null,
    isLoadingToken: true,
  }),
  actions: {
    async login(email: string, password:string) {
        const res = await http.post('/auth/login', {
            email, password
        })

        if(res.data.success) {
            localStorage.setItem('jwt-token', res.data.token)
            this.token = res.data.token
            await this.verifyToken()
        } else {
            throw new Error()
        }
    },
    async verifyToken() {
        this.isLoadingToken = true
        try {
            const res = await http.get('/auth/me');
    
            if(!res.data.success) {
                throw new Error()
            }
    
            console.log("LOGIN: success")
            console.log("LOGIN:", res.data.data)
            this.user = {
                id: res.data.data.user.id,
                name: res.data.data.user.name,
                email: res.data.data.user.email,
                role: res.data.data.user.role,
            }
            console.log("AUTH:", this.user)
        } catch (error) {
            throw error
        } finally {
            this.isLoadingToken = false
        }
    }
  }
})