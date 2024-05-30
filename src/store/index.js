
import { defineStore } from "pinia";
import axios from "axios";
import { ElMessage } from "element-plus";
import { get } from "@/net";

const audioElement = new Audio();

export const userStore = defineStore('userStore', {
    state: () => {
        return {
            user: {
                username: '',
                email: '',
                role: '',
                avatar: null,
                registerTime: null
            },
            isPlaying: false,
            isLoading: false,
            audioSrc: null,
            currentTitle: '',
            currentThumbnail: '',
            audioElement: audioElement // 保持全局引用
        };
    },
    getters: {
        avatarUrl(state) {
            if (state.user.avatar) {
                return `${axios.defaults.baseURL}/images${state.user.avatar}`;
            } else {
                return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
            }
        }
    },
    actions: {
        setPlaying(playing) {
            this.isPlaying = playing;
        },
        setLoading(loading) {
            this.isLoading = loading;
        },
        setAudioSrc(src) {
            this.audioSrc = src;
            audioElement.src = src;
        },
        setCurrentTitle(title) {
            this.currentTitle = title;
        },
        setCurrentThumbnail(thumbnail) {
            this.currentThumbnail = thumbnail;
        },
        playAudio() {
            audioElement.play().then(() => {
                this.isPlaying = true;
                this.isLoading = false;
            }).catch((error) => {
                console.error("Audio play error:", error);
                this.isPlaying = false;
                this.isLoading = false;
            });
        },
        pauseAudio() {
            audioElement.pause();
            audioElement.currentTime = 0;
            this.isPlaying = false;
        },
        fetchAndPlayAudio(video) {
            if (this.isPlaying) {
                this.pauseAudio();
            }
            ElMessage.info("马上来了嗷~，等个几秒😶‍...");
            this.setLoading(true);

            get(`/api/ytb/stream?videoId=${encodeURIComponent(video.videoId)}`,
                (data) => {
                    const audioSrc = URL.createObjectURL(data);
                    this.setAudioSrc(audioSrc);
                    this.setCurrentTitle(video.title);
                    this.setCurrentThumbnail(video.thumbnailUrl);
                    this.playAudio();
                    ElMessage.success(`正在播放：${video.title}`);
                },
                (message, status, url) => {
                    console.error(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
                    ElMessage.error(`播放音频失败: ${message}`);
                    this.setPlaying(false);
                    this.setLoading(false);
                },
                'blob' // 指定响应类型为 Blob
            );
        }
    }
});

audioElement.addEventListener('ended', () => {
    const store = userStore();
    store.playAudio(); // 单曲循环
});
