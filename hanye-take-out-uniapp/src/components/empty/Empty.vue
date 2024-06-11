<!-- 空组件 -->
<template>
  <div class="empty-box">
    <div class="img-box">
      <img src="../static/images/table_empty.png" alt="" />
      <p>{{ !props.isSearch ? '这里空空如也~' : 'Sorry，木有找到您搜索的内容哦~' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isSearch: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="less">
.empty-box {
  text-align: center;
  margin: 20px 0;

  img {
    margin: 0 atuo;
    width: 238px;
    height: 184px;
    margin-top: 20px;
    margin-bottom: 26px;
  }

  p {
    color: #818693;
  }
}
</style>
