<script setup>
import {useDark} from '@vueuse/core'

// 强制启用黑暗模式
const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
})

// 手动设置为黑暗模式
isDark.value = true;

</script>

<template>
    <header>
        <div class="wrapper">
            <router-view/>
        </div>
    </header>
</template>

<style scoped>
header {
    line-height: 1.5;
}
</style>
