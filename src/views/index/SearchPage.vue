<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {ElMessage} from 'element-plus';
import {get} from "@/net";

const route = useRoute();
const results = ref([]);
const isDownloading = ref(false);
const searching = ref(false);

const hoveredIndex = ref(-1);

onMounted(fetchResults);
watch(() => route.params.query, fetchResults);

function fetchResults() {
    const query = route.params.query;
    if (!query) return;
    searching.value = true;
    results.value=[]
    get(`/api/ytb/search?query=${encodeURIComponent(query)}`,
        (data) => {
            results.value = data; // 将搜索结果赋值给 results
            searching.value = false;
            ElMessage.success('鸡汤来咯！');
        },
        (message, status, url) => {
            console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
            ElMessage.error(`获取搜索结果失败: ${message}`);
            searching.value = false;
        }
    );
}

function ytbDownload(video) {
    if (isDownloading.value) {
        ElMessage.warning("你干嘛，哎呦，在下了🐣");
        return;
    }
    ElMessage.info("开始下了呦~，请耐心等待😶‍🌫️...");
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
    <div class="search-results" v-loading="searching">
        <el-table  v-if="results && results.length" :data="results">
            <el-table-column type="index" width="50"/>
            <el-table-column label="缩略图" width="150">
                <template #default="{ row }">
                    <img :src="row.thumbnailUrl.trim()" alt="视频缩略图" style="width: 160px; height: 90px;"/>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="视频标题" />
            <el-table-column prop="duration" label="时长" width="80px"/>
            <el-table-column label="下载" width="100px">
                <template #default="{ row }">
                    <font-awesome-icon
                        :icon="['fas', 'download']"
                        class="download-icon"
                        :style="{ cursor: isDownloading ? 'not-allowed' : 'pointer', color: isDownloading ? 'grey' : '' }"
                        @click="isDownloading ? null : ytbDownload(row)"
                        :aria-disabled="isDownloading.toString()"
                    />
                </template>
            </el-table-column>
        </el-table>
        <el-empty
            v-else
            :description="searching ? '正在搜索...' : '无搜索结果，请尝试其他关键字。'"/>
    </div>
</template>

<style scoped>

.download-icon {
    cursor: pointer;
    color: gray;
    font-size: 20px;
    transition: color 0.3s ease;

    &:hover {
        color: #e47470;
    }
}

.search-results {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}



</style>
