<template>
  <div class="add-tool-link-page">
    <div class="add-link-section">
      <h2>添加快捷工具链接</h2>
      <form class="tool-link-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">链接标题</label>
          <input
            id="title"
            v-model="linksName"
            type="text"
            placeholder="请输入链接标题"
            required
          />
        </div>
        <div class="form-group">
          <label for="url">链接</label>
          <input
            id="url"
            v-model="linksContent"
            type="url"
            placeholder="请输入链接地址"
            required
          />
        </div>
        <div class="form-group">
          <label for="function">链接功能说明</label>
          <textarea
            id="function"
            v-model="linksFunction"
            placeholder="请输入该链接的功能说明"
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" class="submit-btn">提交链接信息</button>
      </form>
    </div>
    <div class="links-table-section">
      <h2>已添加的链接</h2>
      <div class="table-card" v-if="links.length">
        <table class="links-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>链接</th>
              <th>功能说明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in links" :key="item.id">
              <td>{{ item.linksName || item.title }}</td>
              <td>
                <a :href="item.linksContent || item.url" target="_blank">{{
                  item.linksContent || item.url
                }}</a>
              </td>
              <td>{{ item.linksFunction }}</td>
              <td>
                <button class="delete-btn" @click="deleteLink(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-links-tip">暂无链接</div>
    </div>
    
    <!-- 提交成功弹窗 -->
    <ConfirmModal
      v-model:visible="showSuccessModal"
      title="提交链接"
      :show-cancel="false"
      confirm-text="确定"
      @confirm="closeSuccessModal"
    >
      <p>提交链接 <strong>"{{ successLinkName }}"</strong> 成功！</p>
    </ConfirmModal>
    
    <!-- 确认删除弹窗 -->
    <ConfirmModal
      v-model:visible="showDeleteModal"
      title="删除链接"
      confirm-text="确定删除"
      cancel-text="取消删除"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
      <p>你确定删除 <strong>"{{ linkToDelete?.linksName || linkToDelete?.title }}"</strong> 链接吗？</p>
    </ConfirmModal>
  </div>
</template>

<script setup>
// 导入必要的依赖
import axios from "axios";                                    // HTTP 请求库
import { onMounted, ref } from "vue";                        // Vue 3 组合式 API
import { SERVER_IP } from "../tools/ip.js";                  // 服务器 IP 配置
import ConfirmModal from "../components/ConfirmModal.vue";   // 确认弹窗组件

// ==================== 响应式数据定义 ====================

// 表单输入数据
const linksName = ref("");        // 链接标题
const linksContent = ref("");     // 链接地址
const linksFunction = ref("");    // 链接功能说明

// 链接列表数据
const links = ref([]);            // 存储所有链接的数组

// 弹窗控制状态
const showDeleteModal = ref(false);    // 控制删除确认弹窗显示/隐藏
const linkToDelete = ref(null);      // 存储待删除的链接对象
const showSuccessModal = ref(false); // 控制提交成功弹窗显示/隐藏
const successLinkName = ref("");      // 存储成功提交的链接名称

// ==================== 业务逻辑函数 ====================

/**
 * 处理表单提交
 * 提交链接信息到服务器，成功后显示成功弹窗并刷新链接列表
 */
async function handleSubmit() {
  try {
    // 发送 POST 请求添加链接
    await axios.post(`${SERVER_IP}links/addLinks`, {
      linksName: linksName.value,
      linksContent: linksContent.value,
      linksFunction: linksFunction.value,
    });
    
    // 保存成功提交的链接名称，用于弹窗显示
    successLinkName.value = linksName.value;
    
    // 显示成功弹窗
    showSuccessModal.value = true;
    
    // 清空表单输入
    linksName.value = "";
    linksContent.value = "";
    linksFunction.value = "";
    
    // 刷新链接列表
    fetchLinks();
  } catch (e) {
    // 提交失败时显示错误提示
    alert("添加失败");
  }
}

/**
 * 获取链接列表
 * 从服务器获取所有链接数据并更新本地状态
 */
async function fetchLinks() {
  try {
    // 发送 GET 请求获取链接列表
    const res = await axios.get(`${SERVER_IP}links/getLinks`);
    
    // 处理响应数据，兼容不同的数据格式
    links.value = Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (e) {
    // 获取失败时设置为空数组
    links.value = [];
  }
}

/**
 * 关闭成功提示弹窗
 * 关闭提交成功弹窗并清空成功链接名称
 */
function closeSuccessModal() {
  // 隐藏成功弹窗
  showSuccessModal.value = false;
  
  // 清空成功链接名称
  successLinkName.value = "";
}


/**
 * 显示删除确认弹窗
 * @param {Object} item - 要删除的链接对象
 */
function deleteLink(item) {
  // 保存待删除的链接对象
  linkToDelete.value = item;
  
  // 显示删除确认弹窗
  showDeleteModal.value = true;
}

/**
 * 取消删除操作
 * 关闭删除确认弹窗并清空待删除数据
 */
function cancelDelete() {
  // 隐藏删除确认弹窗
  showDeleteModal.value = false;
  
  // 清空待删除的链接对象
  linkToDelete.value = null;
}
/**
 * 确认删除链接
 * 执行实际的删除操作，成功后更新链接列表
 */
async function confirmDelete() {
  try {
    // 获取链接的 ID（兼容不同的 ID 字段名）
    const id = linkToDelete.value.id || linkToDelete.value._id;
    
    // 检查 ID 是否存在
    if (!id) return alert("缺少链接ID，无法删除");
    
    // 发送 DELETE 请求删除链接
    await axios.delete(`${SERVER_IP}links/deleteLinks/${id}`);
    
    // 从本地链接列表中移除已删除的链接
    links.value = links.value.filter((x) => (x.id || x._id) !== id);
    
    // 关闭删除确认弹窗
    showDeleteModal.value = false;
    
    // 清空待删除的链接对象
    linkToDelete.value = null;
  } catch (e) {
    // 删除失败时显示错误提示
    alert("删除失败");
  }
}

// ==================== 生命周期钩子 ====================

onMounted(() => {
  fetchLinks();
});
</script>

<style scoped>
.add-tool-link-page {
  width: 100%;
}

.add-link-section,
.links-table-section {
  width: 100%;
}

.add-link-section {
  margin-bottom: 0;
}

.add-link-section h2 {
  text-align: center;
  margin: 0 0 16px 0;
  font-size: 30px;
  font-weight: 700;
}

.tool-link-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 700;
}

input#url,
input#title,
textarea#function {
  padding: 10px;
  border: 1px solid #d0d5d9;
  font-size: 15px;
  outline: none;
  transition: all 0.15s ease;
  border-radius: 5px;
}

input#url:focus,
input#title:focus,
textarea#function:focus {
  border-color: #3370ff;
}

textarea#function {
  min-height: 100px;
  resize:none;
}

.submit-btn {
  padding: 10px;
  background: #8f959e;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  border-radius: 5px;
}

.submit-btn:hover {
  background: #2b63e5;
}

.links-table-section h2 {
  font-size: 30px;
  font-weight: 700;
  margin: 50px 0 16px 0;
  text-align: center;
}

.links-table {
  width: 100%;
  border-collapse: collapse;
}

.links-table thead th {
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  background: #f7f8fa;
  padding: 15px;
  border: 1px solid #d0d5d9;
  text-align: center;
}

.links-table thead th:nth-child(1) {
  width: 20%;
}

.links-table thead th:nth-child(2) {
  width: 35%;
}

.links-table thead th:nth-child(3) {
  width: 35%;
}

.links-table thead th:nth-child(4) {
  width: 10%;
}

.links-table tbody td {
  padding: 10px;
  font-size: 15px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  border: 1px solid #d0d5d9;
  text-align: center;
}

.links-table tbody td:nth-child(1) {
  width: 15%;
}

.links-table tbody td:nth-child(2) {
  width: 35%;
}

.links-table tbody td:nth-child(3) {
  width: 35%;
}

.links-table tbody td:nth-child(4) {
  width: 15%;
}

.links-table tbody td a {
  color: #3370ff;
  text-decoration: none;
  font-weight: 700;
}

.links-table tbody tr:hover {
  background: #fafbfc;
}

.delete-btn {
  padding: 5px 30px;
  border-radius: 5px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.delete-btn:hover {
  background: #d9363e;
}

.no-links-tip {
  text-align: center;
  padding: 28px 0;
  font-size: 15px;
}
</style>
