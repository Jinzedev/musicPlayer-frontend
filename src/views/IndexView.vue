<template>
    <el-container class="main-content">
        <!-- Sidebar Navigation -->
        <el-aside width="200px"  class="sidebar">
            <el-image class="logo" src="https://element-plus.org/images/element-plus-logo.svg"/>
            <el-menu default-active="1"
                     class="sidebar-menu"
                     active-text-color="#e47470"
                     @select="handleMenuSelect">
                <el-menu-item index="1">
                    <font-awesome-icon :icon="['fas', 'house-chimney-crack']"/>
                    <span class="menu-icon-margin">为你推荐</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <font-awesome-icon :icon="['fas', 'heart']"/>
                    <span class="menu-icon-margin">我的最爱</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <font-awesome-icon :icon="['fas', 'download']"/>
                    <span class="menu-icon-margin">下载管理</span>
                </el-menu-item>

            </el-menu>
        </el-aside>

        <el-container>
            <!-- Header -->
            <el-header class="main-content-header">

                <div class="search-bar">
                    <el-input
                        v-model="input1"
                        style="width: 360px; border-radius: 10px"
                        size="large"
                        placeholder="Please Input"
                        :prefix-icon="Search"
                    />
                </div>
                <div class="user-info">
                    <el-dropdown>
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
                        <template #dropdown>
                            <el-dropdown-item @click="userLogout">
                                <el-icon>
                                    <Back/>
                                </el-icon>
                                退出登录
                            </el-dropdown-item>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <!-- Main Content Area -->

            <el-main class="main-content-page">
                <!-- Add your main page content here -->
                <div>
                    <h2>Main Content Area</h2>
                    <!-- Example Playlist -->
                    <el-card class="playlist-card">
                        <h3>Top Hits</h3>
                        <el-table :data="playlistData">
                            <el-table-column prop="name" label="Song" width="200"></el-table-column>
                            <el-table-column prop="artist" label="Artist" width="200"></el-table-column>
                            <el-table-column prop="duration" label="Duration" width="100"></el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </el-main>
            <!-- Bottom Music Player Controls -->
        </el-container>
        <el-footer class="music-controls">
            <el-row justify="center" align="middle">
                <el-button icon="el-icon-back"/>
                <el-button icon="el-icon-play"/>
                <el-button icon="el-icon-next"/>
            </el-row>
        </el-footer>
    </el-container>
</template>
<script setup>
import {logout} from '@/net'
import router from '@/router'
import {Back, Search} from '@element-plus/icons-vue'

function userLogout() {
    logout(() => router.push('/'))
}

function handleMenuSelect(index) {
    // Implement your menu item selection logic here
    console.log(`Selected menu item: ${index}`)
}

const input1 = ''
const playlistData = [
    {name: 'Blinding Lights', artist: 'The Weeknd', duration: '3:24'},
    {name: 'Levitating', artist: 'Dua Lipa', duration: '3:23'},
    {name: 'Peaches', artist: 'Justin Bieber', duration: '3:18'},
]
</script>
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

.logo {
    height: 38px;
}

.search-bar {
    flex: 1;
    padding: 0 20px;
    text-align: center;

}


.user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.el-avatar:hover {
    cursor: pointer;
}

.sidebar {
    background-color: var(--el-bg-color);
    padding-top: 20px;
    text-align: center;
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
    background-color: #1D1D1D;
}

.menu-icon-margin {
    margin-left: 10px;
    font-size: 18px;
}

.main-content-page {
    padding: 20px;
}

.playlist-card {
    margin-top: 20px;
}

.music-controls {
    height: 80px;
    border-top: solid 1px var(--el-border-color);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
