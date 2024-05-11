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
const searchResults = ref([])
const isDownloading = ref(false);

const handleSearch = () => {
    // 检查搜索关键词是否为空
    if (!searchInput.value.trim()) {
        ElMessage.warning("搞什么✈️，正常输入啊！");
        return;
    }

    loading.value = true;

    const query = encodeURIComponent(searchInput.value);

    // 使用封装的 get 请求调用后端接口
    get(`/api/ytb/search?query=${query}`,
        (data) => {
            searchResults.value = data;
            ElMessage.success('搜索成功！');
            loading.value = false;
        },
        (message, status, url) => {
            console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
            loading.value = false;
            ElMessage.error(`获取搜索结果失败: ${message}`);
        }
    )
};

get("/api/user/info", (data) => {
    store.user = data
    loading.value = false
})


function userLogout() {
    logout(() => router.push('/'))
}

function handleMenuSelect(index) {
    // Implement your menu item selection logic here
    console.log(`Selected menu item: ${index}`)
}
function ytbDownload(video) {
    if (isDownloading.value) {
        ElMessage.warning("你干嘛，哎呦，在下了");
        return;
    }
    ElMessage.info("开始下了呦~，耐心等待...");
    isDownloading.value = true;
    get(`/api/ytb/download?videoId=${encodeURIComponent(video.videoId)}`,
        (data) => {
            // 处理 Blob 数据，创建下载链接
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${video.title}.mp3`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            ElMessage.success(`来了 来了：${video.title}`);
            isDownloading.value = false;

        },
        (message, status, url) => {
            console.error(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
            ElMessage.error(`获取下载结果失败: ${message}`);
            isDownloading.value = false;
        },
        'blob' // 指定响应类型为 Blob
    );
}


</script>
<template>
    <div class="main-content" v-loading="loading" element-loading-text="正在进入，请稍后...">
        <el-container style="height: 100%;">
            <!-- Sidebar Navigation -->
            <el-aside width="200px" class="sidebar">
                <el-image class="logo" src="logo.svg"/>
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
                            v-model="searchInput"
                            style="width: 360px; border-radius: 10px"
                            size="large"
                            placeholder="Please Input"
                            :prefix-icon="Search"
                            @keyup.enter="handleSearch"
                        />
                        <el-button
                            type="primary"
                            icon="Search"
                            @click="handleSearch"
                            :loading="loading"
                        >
                            搜索
                        </el-button>
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
                    </div>
                </el-header>
                <!-- Main Content Area -->

                <el-main class="main-content-page">
                    <el-scrollbar>
                        <!-- Add your main page content here -->
                        <div class="search-results">
                            <el-table v-if="searchResults !== null&& searchResults.length" :data="searchResults">
                                <el-table-column type="index" width="50" />
                                <el-table-column
                                    label="缩略图"
                                    width="150"
                                >
                                    <template v-slot="scope">
                                        <img :src="scope.row.thumbnailUrl "
                                             alt="缩略图" style="width: 160px; height: 90px;"/>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="title" label="视频标题"/>
                                <el-table-column prop="duration" label="时长"/>
                                <el-table-column label="下载">
                                    <template #default="scope">
                                        <font-awesome-icon
                                            :icon="['fas', 'download']"
                                            class="download-icon"
                                            :style="{ cursor: isDownloading ? 'not-allowed' : 'pointer', color: isDownloading ? 'grey' : '' }"
                                            @click="ytbDownload(scope.row)"
                                        />
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-empty v-else-if="searchResults !== null" description="无搜索结果，请尝试其他关键字。"/>
                        </div>
                    </el-scrollbar>
                </el-main>
                <!-- Bottom Music Player Controls -->
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
    justify-content: flex-start;
    align-items: center;
}

.el-avatar:hover {
    cursor: pointer;
}

.sidebar {
    background-color: var(--el-bg-color);
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
    background-color: #1D1D1D;
}

.menu-icon-margin {
    margin-left: 10px;
    font-size: 18px;
}

.main-content-page {
    padding: 20px;
}

.download-icon {
    cursor: pointer;
    color:  gray;
    font-size: 20px;
    transition: color 0.3s ease;
}

.download-icon:hover {
    color: #e47470;
}
</style>
