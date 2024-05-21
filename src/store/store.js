import { createStore } from 'vuex';
import { ElMessage } from "element-plus";

const audioElement = new Audio();

const store = createStore({
    state() {
        return {
            isPlaying: false,
            isLoading: false,
            audioSrc: null,
            currentTitle: '',
            currentThumbnail: '',
            audioElement: audioElement,  // 保持全局引用
        };
    },
    mutations: {
        setPlaying(state, playing) {
            state.isPlaying = playing;
        },
        setLoading(state, loading) {
            state.isLoading = loading;
        },
        setAudioSrc(state, src) {
            state.audioSrc = src;
            audioElement.src = src;
        },
        setCurrentTitle(state, title) {
            state.currentTitle = title;
        },
        setCurrentThumbnail(state, thumbnail) {
            state.currentThumbnail = thumbnail;
        },
        playAudio(state) {
            audioElement.play().then(() => {
                state.isPlaying = true;
                state.isLoading = false;
            }).catch((error) => {
                console.error("Audio play error:", error);
                state.isPlaying = false;
                state.isLoading = false;
            });
        },
        pauseAudio(state) {
            audioElement.pause();
            audioElement.currentTime = 0;
            state.isPlaying = false;
        },
    },
    actions: {
        fetchAndPlayAudio({ commit, state }, video) {
            if (state.isPlaying) {
                commit('pauseAudio');
            }
            ElMessage.info("马上来了嗷~，等个几秒😶‍...");
            commit('setLoading', true);

            get(`/api/ytb/stream?videoId=${encodeURIComponent(video.videoId)}`,
                (data) => {
                    const audioSrc = URL.createObjectURL(data);
                    commit('setAudioSrc', audioSrc);
                    commit('setCurrentTitle', video.title);
                    commit('setCurrentThumbnail', video.thumbnailUrl);
                    commit('playAudio');
                    ElMessage.success(`正在播放：${video.title}`);
                },
                (message, status, url) => {
                    console.error(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
                    ElMessage.error(`播放音频失败: ${message}`);
                    commit('setPlaying', false);
                    commit('setLoading', false);
                },
                'blob' // 指定响应类型为 Blob
            );
        }
    },
});

audioElement.addEventListener('ended', () => {
    store.commit('playAudio'); // 单曲循环
});

export default store;
