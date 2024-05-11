<script setup>

import {logout} from '@/net'
import router from '@/router'
import {ArrowDown, Back, Search} from '@element-plus/icons-vue'
import {ref} from "vue";
import {userStore} from "@/store";
import {get} from "@/net"
import {ElMessage} from "element-plus";

const store = userStore()
const loading = ref(true)
const searchInput = ref('')


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
})


function userLogout() {
    logout(() => router.push('/'))
}



</script>
<template>
    <div class="main-content" v-loading="loading" element-loading-text="正在进入，请稍后...">
        <el-container style="height: 100%;">
            <!-- Sidebar Navigation -->
            <el-aside width="200px" class="sidebar">
                <el-image class="logo" src="logo.svg"/>
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
                            style="width: 360px; border-radius: 10px"
                            size="large"
                            placeholder="Please Input"
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
                                           class="header-setting"/>
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

            </el-container>
        </el-container>
    </div>
</template>

<style scoped>
.main-content {
    height: 100vh;
    width: 100vw;
}

.main-content-header {
    height: 80px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 120px;
}


.search-bar {
    flex: 1;
    padding: 0 20px;


}


.user-info {
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-avatar:hover {
    cursor: pointer;
}

.header-setting {
    margin: 10px;
    vertical-align: middle;
    cursor: pointer;
    font-size: 20px;

    &:hover {
        color: #e47470;
    }
}

.sidebar {
    background-color: #121212;
    padding-top: 20px;

}

.logo {
    margin-left: 20px;
    height: 52px;
}

.sidebar-menu {
    border-right: none;
    margin-top: 20px;
    padding-left: 30px;
}

.sidebar-menu .el-menu-item {
    border-radius: 10px;
}

.sidebar-menu .el-menu-item:hover {
    cursor: pointer;
    background-color: #212121;
}

.menu-icon-margin {
    margin-left: 10px;
    font-size: 18px;
}

.main-content-page {
    padding: 20px;
}


</style>
