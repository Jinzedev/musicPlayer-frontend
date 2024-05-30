import { createRouter, createWebHistory } from 'vue-router';
import { unauthorized } from "@/net";
import {userStore} from "@/store";



const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                {
                    path: '',
                    name: 'welcome-login',
                    component: () => import('@/views/welcome/LoginPage.vue')
                },
            ]
        }, {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
            children: [
                {
                    path: '',
                    name: 'index-home',
                    component: () => import('@/views/index/HomePage.vue')
                }, {
                    path: 'love',
                    name: 'index-love',
                    component: () => import('@/views/index/LovePage.vue')
                }, {
                    path: 'download',
                    name: 'index-download',
                    component: () => import('@/views/index/DownloadPage.vue')
                },
                {
                    path: '/search/:query',
                    name: 'index-search',
                    component: () => import('@/views/index/SearchPage.vue'),
                    props: true
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized();
    if (to.name.startsWith('welcome') && !isUnauthorized) {
        next('/index');
    } else if (to.fullPath.startsWith('/index') && isUnauthorized) {
        next('/');
    } else {
        next();
    }
    const store = userStore()
    // 确保音频状态在页面切换时保持一致
    if (store.isPlaying && store.audioElement.paused) {
        store.playAudio();
    }
});

export default router;
