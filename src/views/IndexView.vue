<script setup>

import {logout} from '@/net'
import router from '@/router'
import {ArrowDown, Back, Search} from '@element-plus/icons-vue'
import {ref} from "vue";
import {userStore} from "@/store";
import {get} from "@/net"
import {ElMessage} from "element-plus";
import {computed} from 'vue';

const store = userStore()
const loading = ref(true)
const searchInput = ref('')


const currentTitle = computed(() => store.currentTitle);
const currentThumbnail = computed(() => store.currentThumbnail);
const isPlaying = computed(() => store.isPlaying);
const isLoading = computed(() => store.isLoading);

const stopTrack = () => {
    store.pauseAudio();
};

const handleSearch = () => {
    if (!searchInput.value.trim()) {
        ElMessage.warning("在搞什么✈️，正常输入！");
        return;
    }
    // 导航到搜索页面并带上搜索关键词
    router.push({name: 'index-search', params: {query: searchInput.value.trim()}});
};

get("/api/user/info", (data) => {
    store.user = data
    loading.value = false
}, (e)=>{ElMessage.error('出错了{}',e)})


function userLogout() {
    logout(() => router.push('/'))
}

const handleSearchClear = () => {
    ElMessage.info("搜索已清空");
};


</script>
<template>
    <div class="main-content" v-loading="loading" element-loading-text="正在进入，请稍后...">
        <el-container style="height: 100%;">
            <!-- Sidebar Navigation -->
            <el-aside width="200px" class="sidebar">
                <el-image class="logo" src="https://element-plus.org/images/element-plus-logo.svg"/>
                <el-menu
                    router
                    :default-active="$route.path"
                    class="sidebar-menu"
                    active-text-color="#e47470">
                    <el-menu-item index="/index">
                        <font-awesome-icon :icon="['fas', 'house-chimney-crack']"/>
                        <span class="menu-icon-margin">为你推荐</span>
                    </el-menu-item>
                    <el-menu-item index="/index/love">
                        <font-awesome-icon :icon="['fas', 'heart']"/>
                        <span class="menu-icon-margin">我的最爱</span>
                    </el-menu-item>
                    <el-menu-item index="/index/download">
                        <font-awesome-icon :icon="['fas', 'download']"/>
                        <span class="menu-icon-margin">下载管理</span>
                    </el-menu-item>

                </el-menu>
            </el-aside>

            <el-container style=" background-color: #1E1E1E;">
                <!-- Header -->
                <el-header class="main-content-header">

                    <div class="search-bar">
                        <el-input
                            v-model="searchInput"
                            style="width: 360px; padding: 8px 10px; border-radius: 5px;"
                            size="large"
                            clearable
                            @clear="handleSearchClear"
                            placeholder="请输入..."
                            :prefix-icon="Search"
                            @keyup.enter="handleSearch"
                        />
                    </div>
                    <div>
                        <el-dropdown>
                            <div class="user-info">
                                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
                                <span style="margin-left: 15px;color: #b4b3b3;font-size: 15px"> {{
                                        store.user.username
                                    }}</span>
                                <el-icon class="el-icon--right">
                                    <arrow-down/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-item @click="userLogout">
                                    <el-icon>
                                        <Back/>
                                    </el-icon>
                                    退出登录
                                </el-dropdown-item>
                            </template>
                        </el-dropdown>
                        <font-awesome-icon :icon="['fas', 'gear']"
                                           class="user-setting"/>
                    </div>
                </el-header>
                <!-- Main Content Area -->

                <el-main class="main-content-page">
                    <el-scrollbar>
                        <router-view v-slot="{Component}">
                            <transition name="el-fade-in-linear" mode="out-in">
                                <component :is="Component" style="height: 100%"/>
                            </transition>
                        </router-view>

                    </el-scrollbar>

                </el-main>
                <footer class="footer">

                    <div v-if="isPlaying || isLoading" class="music-player">
                        <img :src="currentThumbnail" alt="Thumbnail" v-if="currentThumbnail" class="thumbnail"/>
                        <p v-if="isLoading">加载中...</p>
                        <p v-else>正在播放: {{ currentTitle }}</p>
                        <button @click="stopTrack">停止播放</button>
                    </div>
                </footer>
            </el-container>

        </el-container>
    </div>
</template>

<style scoped>

.main-content {
    height: 100vh;
    width: 100vw;
}

.sidebar {
    background-color: var(--sidebar-bg-color); /* 稍亮的侧边栏背景色 */
    padding-top: 20px;
}

.logo {
    margin-left: 20px;
    height: 32px;
}

.sidebar-menu {
    border-right: none;
    margin-top: 20px;
    padding-left: 30px;
}

.menu-icon-margin {
    margin-left: 10px;
    font-size: 18px;
}

.sidebar-menu .el-menu-item {
    border-radius: 10px;
    color: var(--secondary-text-color);
    transition: background-color 0.2s, color 0.2s; /* 平滑过渡效果 */
}

.sidebar-menu .el-menu-item:not(.is-disabled):hover {
    background-color: var(--hover-bg-color); /* 悬停时的背景色 */
    color: var(--active-text-color);
}

.sidebar-menu .el-menu-item.is-active {
    background-color: var(--highlight-color); /* 选中时的背景色 */
    color: var(--active-text-color);
    border-left: 3px solid var(--text-color); /* 左侧边框表示活跃状态 */
    padding-left: 5px; /* 调整内边距以适应边框 */
}


.main-content-header {
    background-color: var(--main-bg-color);
    padding: 10px 20px; /* 增加内边距 */
    display: flex;
    align-items: center;
    justify-content: space-between; /* 内容分布 */
}

.search-bar {
    flex-grow: 1;
    margin-right: 20px; /* 调整间距 */
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

/* 用户信息样式调整 */
.user-info {
    display: flex;
    align-items: center;
    font-size: 14px;
}

.el-avatar:hover {
    cursor: pointer;
}

.user-setting {
    margin: 10px;
    vertical-align: middle;
    cursor: pointer;
    font-size: 20px;

    &:hover {
        color: var(--active-text-color);
    }
}

.main-content-page {
    padding: 20px;
    background-color: var(--main-bg-color);
    color: var(--secondary-text-color);
}

.footer {
    background-color: var(--main-bg-color);
    color: var(--secondary-text-color);
    text-align: center;
    padding: 10px 0;
    border-top: 1px solid var(--secondary-text-color);
}

.music-player {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.thumbnail {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
</style>
