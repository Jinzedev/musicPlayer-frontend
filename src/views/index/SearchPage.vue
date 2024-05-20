<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { get } from "@/net";

const route = useRoute();
const results = ref([]);
const isDownloading = ref(false);
const isPlaying = ref(false);
const searching = ref(false);
const audioSrc = ref(null);
const audioElement = ref(null);

onMounted(fetchResults);
watch(() => route.params.query, fetchResults);

function fetchResults() {
  const query = route.params.query;
  if (!query) return;
  searching.value = true;
  results.value = [];
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

function playAudio(video) {
  if (isPlaying.value) {
    ElMessage.warning("已经在播放中");
    return;
  }
  isPlaying.value = true;

  get(`/api/ytb/stream?videoId=${encodeURIComponent(video.videoId)}`,
      (data) => {
        // 设置音频源并播放
        audioSrc.value = URL.createObjectURL(data);
        nextTick(() => {
          console.log("Loading audio...");
          audioElement.value.load();
          audioElement.value.play().then(() => {
            console.log("Audio started playing.");
          }).catch((error) => {
            console.error("Audio play error:", error);
            isPlaying.value = false;
          });
        });
        ElMessage.success(`正在播放：${video.title}`);
      },
      (message, status, url) => {
        console.error(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
        ElMessage.error(`播放音频失败: ${message}`);
        isPlaying.value = false;
      },
      'blob' // 指定响应类型为 Blob
  );
}
</script>

<template>
  <div class="search-results" v-loading="searching">
    <el-table v-if="results && results.length" :data="results">
      <el-table-column type="index" width="50" label="#"/>
      <el-table-column label="缩略图" width="150">
        <template #default="{ row }">
          <img :src="row.thumbnailUrl.trim()" alt="视频缩略图" style="width: 160px; height: 90px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="视频标题"/>
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
      <el-table-column label="播放" width="100px">
        <template #default="{ row }">
          <font-awesome-icon
              :icon="['fas', 'play']"
              class="download-icon"
              :style="{ cursor: isPlaying ? 'not-allowed' : 'pointer', color: isPlaying ? 'grey' : '' }"
              @click="isPlaying ? null : playAudio(row)"
              :aria-disabled="isPlaying.toString()"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-empty
        v-else
        :description="searching ? '正在搜索...' : '无搜索结果，请尝试其他关键字。'"/>
  </div>
  <audio ref="audioElement" :src="audioSrc" @ended="isPlaying = false" controls></audio>
</template>

<style scoped>
.download-icon {
  cursor: pointer;
  color: gray;
  font-size: 20px;
  transition: color 0.3s ease;
}

.download-icon:hover {
  color: var(--active-text-color);
}

.search-results {
  transition: .3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  padding: 20px;
  margin: 20px;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: none;
}
</style>
