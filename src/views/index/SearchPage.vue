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
              :style="{ cursor: 'pointer', color: isPlaying ? 'grey' : '' }"
              @click="playAudio(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-empty
        v-else
        :description="searching ? '正在搜索...' : '无搜索结果，请尝试其他关键字。'"/>
  </div>

  <!-- Custom Audio Player -->
  <div class="custom-audio-player" v-if="audioSrc">
    <div class="audio-info">
      <img :src="currentThumbnail" alt="音频封面" class="thumbnail"/>
      <div class="title">{{ currentTitle }}</div>
    </div>
    <audio ref="audioElement" :src="audioSrc" @ended="onAudioEnded" @timeupdate="updateProgress" controls></audio>
    <div class="controls">
      <button @click="togglePlay">
        <font-awesome-icon :icon="[isPlaying ? 'fas' : 'fas', isPlaying ? 'pause' : 'play']" />
      </button>
      <div class="progress-container">
        <span>{{ currentTime }}</span>
        <input type="range" min="0" max="100" step="1" v-model="progress" @input="seek"/>
        <span>{{ duration }}</span>
      </div>
      <button @click="mute">
        <font-awesome-icon :icon="['fas', isMuted ? 'volume-mute' : 'volume-up']" />
      </button>
    </div>
  </div>
</template>

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
const isLoading = ref(false);
const audioSrc = ref(null);
const audioElement = ref(null);
const currentTitle = ref('');
const currentThumbnail = ref('');
const currentTime = ref('0:00');
const duration = ref('0:00');
const progress = ref(0);
const isMuted = ref(false);

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

function playAudio(video) {
  if (isPlaying.value) {
    // 停止当前播放的音频
    audioElement.value.pause();
    audioElement.value.currentTime = 0;
  }
  ElMessage.info("马上来了嗷~，等个几秒😶‍...");
  isLoading.value = true;

  get(`/api/ytb/stream?videoId=${encodeURIComponent(video.videoId)}`,
      (data) => {
        // 设置音频源并播放
        audioSrc.value = URL.createObjectURL(data);
        currentTitle.value = video.title;
        currentThumbnail.value = video.thumbnailUrl;
        nextTick(() => {
          console.log("Loading audio...");
          audioElement.value.load();
          audioElement.value.play().then(() => {
            console.log("Audio started playing.");
            isPlaying.value = true;
            isLoading.value = false;
          }).catch((error) => {
            console.error("Audio play error:", error);
            isPlaying.value = false;
            isLoading.value = false;
          });
        });
        ElMessage.success(`正在播放：${video.title}`);
      },
      (message, status, url) => {
        console.error(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
        ElMessage.error(`播放音频失败: ${message}`);
        isPlaying.value = false;
        isLoading.value = false;
      },
      'blob' // 指定响应类型为 Blob
  );
}

function onAudioEnded() {
  isPlaying.value = false;
  currentTime.value = '0:00';
  progress.value = 0;
}

function togglePlay() {
  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
  isPlaying.value = !isPlaying.value;
}

function mute() {
  isMuted.value = !isMuted.value;
  audioElement.value.muted = isMuted.value;
}

function updateProgress() {
  const current = audioElement.value.currentTime;
  const total = audioElement.value.duration;
  currentTime.value = formatTime(current);
  duration.value = formatTime(total);
  progress.value = (current / total) * 100;
}

function seek(event) {
  const seekTime = (event.target.value / 100) * audioElement.value.duration;
  audioElement.value.currentTime = seekTime;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
</script>

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

.custom-audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.audio-info {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.controls {
  display: flex;
  align-items: center;
  width: 100%;
}

.controls button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin: 0 10px;
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0 10px;
}

.progress-container input[type="range"] {
  flex: 1;
  margin: 0 10px;
}

.progress-container span {
  font-size: 14px;
  width: 50px;
  text-align: center;
}
</style>
