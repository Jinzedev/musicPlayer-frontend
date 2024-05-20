<!-- src/App.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light'
});
const toggleDark = useToggle(isDark);

const applyClickedCursor = () => {
    document.body.classList.add('custom-cursor-clicked');
};

const removeClickedCursor = () => {
    document.body.classList.remove('custom-cursor-clicked');
};

const applyCustomCursor = () => {
    document.body.classList.add('custom-cursor');
};

const removeCustomCursor = () => {
    document.body.classList.remove('custom-cursor');
};

onMounted(() => {
    applyCustomCursor();
    document.addEventListener('mousedown', applyClickedCursor);
    document.addEventListener('mouseup', removeClickedCursor);
});

onUnmounted(() => {
    removeCustomCursor();
    document.removeEventListener('mousedown', applyClickedCursor);
    document.removeEventListener('mouseup', removeClickedCursor);
});
</script>

<template>
    <header>
        <div class="wrapper">
            <router-view/>
        </div>
        <canvas class="fireworks"></canvas>
    </header>
</template>

<style scoped>
@import './styles/cursor.css';

header {
    line-height: 1.5;
}

.fireworks {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99999999;
    pointer-events: none;
}
</style>
