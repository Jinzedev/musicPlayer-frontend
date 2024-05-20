<script setup>
import {ref} from 'vue';

const platforms = ref([
    {id: '_NETEASE_MUSIC', name: '网易云音乐', action: () => playSpotify()},
    {id: '_QQ_MUSIC', name: 'QQ音乐', action: () => playAppleMusic()},
    {id: '_XIAMI_MUSIC', name: '虾米音乐', action: () => playYouTubeMusic()},
    {id: '_KUGOU_MUSIC', name: '酷狗音乐', action: () => playYouTubeMusic()},
    {id: '_KUWO_MUSIC', name: '酷我音乐', action: () => playYouTubeMusic()},
    {id: '_BILIBILI_MUSIC', name: '哔哩哔哩', action: () => playYouTubeMusic()},
    {id: '_MIGU_MUSIC', name: '咪咕音乐', action: () => playYouTubeMusic()},
    {id: '_TAIHE_MUSIC', name: '千千音乐', action: () => playYouTubeMusic()},
]);

function playSpotify() {
    console.log("Playing Spotify");
    // 特定的逻辑
}

function playAppleMusic() {
    console.log("Playing Apple Music");
    // 特定的逻辑
}

function playYouTubeMusic() {
    console.log("Playing YouTube Music");
    // 特定的逻辑
}
</script>

<template>
    <div class="music-tag">

        <el-button
            :key="platforms[0].id"
            @click="playSpotify"
        >
            {{ platforms[0].name }}
        </el-button>
        <el-divider class="music-tag-divider" direction="vertical"/>
        <el-button
            :key="platforms[1].id"
            @click="playAppleMusic"
        >
            {{ platforms[1].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[2].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[2].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[3].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[3].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[4].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[4].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[5].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[5].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[6].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[6].name }}
        </el-button>
        <el-divider class="music-tag-divider"
                    direction="vertical"/>
        <el-button
            :key="platforms[7].id"
            @click="playYouTubeMusic"
        >
            {{ platforms[7].name }}
        </el-button>


    </div>
</template>


<style scoped>
.music-tag {
    display: flex;
    justify-content: flex-start;
    padding: 10px;
    transition: margin 0.4s;
    overflow: hidden; /* 防止内容溢出容器 */
}

.music-tag .el-button {
    font-weight: bold;
    margin: 0 10px;
    border: none;
    color: var(--secondary-text-color);
    border-radius: 7px;
    transition: background-color 0.2s, color 0.2s, transform 0.3s;
    cursor: pointer;
    transform-origin: center center;
    padding: 5px;
}

.music-tag .el-button:hover,
.music-tag .el-button.is-active,
.music-tag .el-button:focus {
    background-color: var(--hover-bg-color);
    color: var(--active-text-color);
    transform: scale(1.5);
    outline: none;
    margin: 0 30px;
}

.music-tag .el-button:focus {
    background-color: var(--main-bg-color);
    border-bottom: 2px solid var(--text-color);
}

.music-tag-divider {
    height: 1em;
    margin: 8px 2px 0;
    background-color: var(--text-color);
}
</style>
