<template>
  <div class="question-list-page">
    <h2>全部题库管理</h2>

    <div class="table-wrapper">
      <table class="q-table">
        <thead>
          <tr>
            <th>题目标题</th>
            <th>一级分类</th>
            <th>二级分类</th>
            <th>创建时间</th>
            <th>观看数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in questions" :key="q._id || q.id || q.questionName">
            <td>{{ q.questionName }}</td>
            <td>{{ q.firstCategory }}</td>
            <td>{{ q.secondCategory }}</td>
            <td>{{ q.questionCreateTime}}</td>
            <td>{{ q.count }}</td>
            <td>
              <button class="op-btn" type="button" @click="openDeleteModal(q)">删除</button>
            </td>
          </tr>
          <tr v-if="questions.length === 0">
            <td colspan="6" class="empty">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ConfirmModal
    :visible="deleteVisible"
    :title="deleteTitle"
    :content="deleteContent"
    :showCancel="true"
    :showConfirm="true"
    cancelText="取消"
    confirmText="确定"
    @cancel="onDeleteCancel"
    @confirm="onDeleteConfirm"
    @update:visible="(v) => deleteVisible = v"
  />
</template>

<script setup>
/**
 * 全部题库管理页面 - QuestionList.vue
 * 
 * 功能说明：
 * - 展示所有题库题目的列表
 * - 提供题目的删除功能
 * - 显示题目的详细信息（标题、分类、创建时间、观看数量）
 * - 使用确认弹窗进行删除操作
 * 
 * 主要功能：
 * 1. 题目列表展示：显示所有题目的详细信息
 * 2. 题目删除：通过确认弹窗删除指定题目
 * 3. 数据刷新：删除后自动更新列表数据
 * 
 * 数据字段：
 * - questionName: 题目标题
 * - firstCategory: 一级分类
 * - secondCategory: 二级分类
 * - questionCreateTime: 创建时间
 * - count: 观看数量
 */

// 导入必要的依赖
import axios from "axios";
import { onMounted, ref } from "vue";
import { SERVER_IP } from "../tools/ip.js";
import ConfirmModal from "../components/ConfirmModal.vue";

// ==================== 响应式数据定义 ====================

/**
 * 题目列表数据
 * 存储从服务器获取的所有题目信息
 */
const questions = ref([]);

// ==================== 数据获取函数 ====================

/**
 * 获取题目列表
 * 从服务器获取所有题目数据
 */
async function fetchQuestions() {
  try {
    const res = await axios.get(`${SERVER_IP}questionBank/getQuestion`);
    questions.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
  } catch (e) {
    // 请求失败时设置为空数组，避免渲染错误
    questions.value = [];
  }
}

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载后执行
 * 初始化页面数据，获取题目列表
 */
onMounted(() => {
  fetchQuestions();
});

// ==================== 删除功能相关 ====================

/**
 * 删除弹窗控制状态
 * 管理删除确认弹窗的显示状态和内容
 */
const deleteVisible = ref(false); // 删除弹窗是否显示
const deleteTitle = ref("删除题目"); // 删除弹窗标题
const deleteContent = ref(""); // 删除弹窗内容
const pendingDeleteId = ref(""); // 待删除题目的ID

/**
 * 打开删除题目确认弹窗
 * 设置待删除题目的信息并显示确认弹窗
 */
function openDeleteModal(q) {
  const name = q?.questionName || "";
  const first = q?.firstCategory || "";
  const second = q?.secondCategory || "";
  pendingDeleteId.value = q?._id || q?.id || "";
  deleteTitle.value = "删除题目";
  deleteContent.value = `你确定删除 ${first} 下的 ${second} 分类的 ${name} 题目？`;
  deleteVisible.value = true;
}

/**
 * 处理删除取消事件
 * 关闭删除弹窗并清空待删除ID
 */
function onDeleteCancel() {
  deleteVisible.value = false;
  pendingDeleteId.value = "";
}

/**
 * 处理删除确认事件
 * 调用服务器接口删除题目，成功后更新本地数据
 */
async function onDeleteConfirm() {
  const id = pendingDeleteId.value;
  if (!id) {
    deleteVisible.value = false;
    return;
  }
  try {
    await axios.delete(`${SERVER_IP}questionBank/deleteQuestion`, { data: { id } });
    // 从本地数组中移除已删除的题目，避免重新请求
    questions.value = questions.value.filter(x => (x._id || x.id) !== id);
  } catch (e) {
    // 静默失败，不显示错误信息
  } finally {
    deleteVisible.value = false;
    pendingDeleteId.value = "";
  }
}
</script>

<style scoped>
.question-list-page {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  min-height: 600px;
}

.question-list-page h2 {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.table-wrapper {
  width: 100%;
}

.q-table {
  width: 100%;
}
.q-table th,
.q-table td {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 15px;
}
.q-table th {
  background: #f5f7fa;
}
.empty {
  text-align: center;
  color: #909399;
}
.op-btn {
  padding: 4px 12px;
  background: #3370ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}
.op-btn:hover {
  background: #2b63e5;
}
</style>


