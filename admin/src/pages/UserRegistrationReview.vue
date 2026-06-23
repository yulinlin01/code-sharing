<template>
  <div class="registration-review-container">
    <div class="page-header">
      <h1>用户注册审核</h1>
    </div>
    <div class="content-area">

      <div class="filter-section">
        <div class="filter-buttons">
          <button 
            @click="statusFilter = 'all'"
            :class="['filter-btn', { active: statusFilter === 'all' }]"
          >
            全部
          </button>
          <button 
            @click="statusFilter = '0'"
            :class="['filter-btn', { active: statusFilter === '0' }]"
          >
            待审核
          </button>
          <button 
            @click="statusFilter = '1'"
            :class="['filter-btn', { active: statusFilter === '1' }]"
          >
            已通过
          </button>
          <button 
            @click="statusFilter = '2'"
            :class="['filter-btn', { active: statusFilter === '2' }]"
          >
            已拒绝
          </button>
        </div>
      </div>

      <table class="user-table">
        <thead>
          <tr>
            <th>用户信息</th>
            <th>密码</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
            <th>删除用户</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="user-info">
              <div class="user-name">{{ user.username }}</div>
            </td>
            <td class="password">{{ user.password }}</td>
            <td class="register-time">{{ user.registerTime }}</td>
            <td class="status">
              <span
                :class="[
                  'status-badge',
                  `status-${getStatusClass(user.registerStatus)}`,
                ]"
              >
                {{ getStatusText(user.registerStatus) }}
              </span>
            </td>
            <td class="actions">
              <button
                v-if="user.registerStatus === 0"
                @click="approveUser(user._id)"
                class="action-btn approve-btn"
              >
                通过
              </button>
              <button
                v-if="user.registerStatus === 0"
                @click="rejectUser(user._id)"
                class="action-btn reject-btn"
              >
                拒绝
              </button>
              <button
                @click="viewUserDetail(user._id)"
                class="action-btn detail-btn"
              >
                详情
              </button>
            </td>
            <td class="delete-user">
              <button
                @click="deleteUser(user._id)"
                class="action-btn delete-user-btn"
              >
                删除用户
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 通过确认弹窗 -->
    <ConfirmModal
      v-model:visible="showApproveModal"
      title="通过弹窗"
      confirm-text="通过"
      cancel-text="取消"
      @confirm="confirmApprove"
      @cancel="cancelApprove"
    >
      <p>你要通过 <strong>{{ currentUser?.username }}</strong> 的请求吗？</p>
    </ConfirmModal>
    
    <!-- 拒绝确认弹窗 -->
    <ConfirmModal
      v-model:visible="showRejectModal"
      title="拒绝弹窗"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmReject"
      @cancel="cancelReject"
    >
      <p>你要拒绝 <strong>{{ currentUser?.username }}</strong> 的请求吗？</p>
    </ConfirmModal>
    
    <!-- 用户详情弹窗 -->
    <ConfirmModal
      v-model:visible="showDetailModal"
      title="用户详情"
      :show-cancel="false"
      confirm-text="确定"
      @confirm="closeDetailModal"
    >
      <div class="user-detail-content">
        <p><strong>用户名：</strong>{{ currentUser?.username }}</p>
        <p><strong>注册时间：</strong>{{ currentUser?.registerTime }}</p>
        <p><strong>注册状态：</strong>{{ getStatusText(currentUser?.registerStatus) }}</p>
      </div>
    </ConfirmModal>
    
    <!-- 删除用户确认弹窗 -->
    <ConfirmModal
      v-model:visible="showDeleteUserModal"
      title="删除用户"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
    >
      <p>你要删除 <strong>{{ currentUser?.username }}</strong> 用户吗？</p>
    </ConfirmModal>
  </div>
</template>

<script setup>
// ==================== 导入依赖 ====================
import { computed, onMounted, ref } from "vue";        // Vue 3 组合式 API
import { SERVER_IP } from "../tools/ip.js";            // 服务器 IP 配置
import ConfirmModal from "../components/ConfirmModal.vue"; // 确认弹窗组件

// ==================== 响应式数据定义 ====================

// 筛选和列表数据
const statusFilter = ref("all");        // 状态筛选器：all(全部)、0(待审核)、1(已通过)、2(已拒绝)
const registerList = ref([]);           // 注册用户列表数据

// 弹窗控制状态
const showApproveModal = ref(false);    // 控制通过确认弹窗显示/隐藏
const showRejectModal = ref(false);     // 控制拒绝确认弹窗显示/隐藏
const showDetailModal = ref(false);     // 控制用户详情弹窗显示/隐藏
const showDeleteUserModal = ref(false); // 控制删除用户确认弹窗显示/隐藏
const currentUser = ref(null);          // 存储当前操作的用户对象

// ==================== 计算属性 ====================

/**
 * 根据状态筛选器过滤用户列表
 * @returns {Array} 过滤后的用户列表
 */
const filteredUsers = computed(() => {
  if (statusFilter.value === "all") {
    return registerList.value;
  }
  return registerList.value.filter(
    (user) => user.registerStatus === parseInt(statusFilter.value)
  );
});

// ==================== 数据获取函数 ====================

/**
 * 从服务器获取注册用户列表
 * 获取所有注册用户数据并更新本地状态
 */
async function fetchRegisterUsers() {
  try {
    const response = await fetch(
      `${SERVER_IP}register/getRegisterUsers`
    );
    if (response.ok) {
      const data = await response.json();
      registerList.value = data.data;
    } else {
      console.error("获取注册用户列表失败:", response.status);
    }
  } catch (error) {
    console.error("请求注册用户列表时出错:", error);
  }
}

/**
 * 根据注册状态获取对应的文本描述
 * @param {number} registerStatus - 注册状态码
 * @returns {string} 状态文本描述
 */
function getStatusText(registerStatus) {
  const statusMap = {
    0: "待审核",
    1: "已通过",
    2: "已拒绝",
  };
  return statusMap[registerStatus] || "未知状态";
}

/**
 * 根据注册状态获取对应的CSS类名
 * @param {number} registerStatus - 注册状态码
 * @returns {string} CSS类名
 */
function getStatusClass(registerStatus) {
  const classMap = {
    0: "pending",
    1: "approved",
    2: "rejected",
  };
  return classMap[registerStatus] || "pending";
}

// ==================== 通过审核相关函数 ====================

/**
 * 显示通过确认弹窗
 * @param {string} userId - 用户ID
 */
function approveUser(userId) {
  const user = registerList.value.find((u) => u._id === userId);
  if (user) {
    currentUser.value = user;
    showApproveModal.value = true;
  }
}

/**
 * 确认通过用户注册
 * 执行通过操作并关闭弹窗
 */
function confirmApprove() {
  if (currentUser.value) {
    updateUserStatus(currentUser.value, 1);
    showApproveModal.value = false;
    currentUser.value = null;
  }
}

/**
 * 取消通过操作
 * 关闭弹窗并清空当前用户数据
 */
function cancelApprove() {
  showApproveModal.value = false;
  currentUser.value = null;
}

// ==================== 拒绝审核相关函数 ====================

/**
 * 显示拒绝确认弹窗
 * @param {string} userId - 用户ID
 */
function rejectUser(userId) {
  const user = registerList.value.find((u) => u._id === userId);
  if (user) {
    currentUser.value = user;
    showRejectModal.value = true;
  }
}

/**
 * 确认拒绝用户注册
 * 执行拒绝操作并关闭弹窗
 */
function confirmReject() {
  if (currentUser.value) {
    updateUserStatus(currentUser.value, 2);
    showRejectModal.value = false;
    currentUser.value = null;
  }
}

/**
 * 取消拒绝操作
 * 关闭弹窗并清空当前用户数据
 */
function cancelReject() {
  showRejectModal.value = false;
  currentUser.value = null;
}

// ==================== 用户状态更新函数 ====================

/**
 * 更新用户注册状态
 * @param {Object} user - 用户对象
 * @param {number} newStatus - 新状态：1(通过)、2(拒绝)
 */
async function updateUserStatus(user, newStatus) {
  try {
    const response = await fetch(
      `${SERVER_IP}register/updateRegisterStatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          registerStatus: newStatus,
        }),
      }
    );

    if (response.ok) {
      user.registerStatus = newStatus;
    } else {
      console.error("更新用户状态失败:", response.status);
    }
  } catch (error) {
    console.error("请求更新用户状态时出错:", error);
  }
}

// ==================== 用户详情相关函数 ====================

/**
 * 显示用户详情弹窗
 * @param {string} userId - 用户ID
 */
function viewUserDetail(userId) {
  const user = registerList.value.find((u) => u._id === userId);
  if (user) {
    currentUser.value = user;
    showDetailModal.value = true;
  }
}

/**
 * 关闭用户详情弹窗
 * 关闭弹窗并清空当前用户数据
 */
function closeDetailModal() {
  showDetailModal.value = false;
  currentUser.value = null;
}

// ==================== 删除用户相关函数 ====================

/**
 * 显示删除用户确认弹窗
 * @param {string} userId - 用户ID
 */
function deleteUser(userId) {
  const user = registerList.value.find((u) => u._id === userId);
  if (user) {
    currentUser.value = user;
    showDeleteUserModal.value = true;
  }
}

/**
 * 确认删除用户
 * 向服务器发送删除请求并更新本地列表
 */
async function confirmDeleteUser() {
  if (currentUser.value) {
    try {
      
      const response = await fetch(
        `${SERVER_IP}register/deleteUser`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentUser.value._id,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // 从本地列表中移除已删除的用户
        registerList.value = registerList.value.filter(
          (user) => user._id !== currentUser.value._id
        );
        showDeleteUserModal.value = false;
        currentUser.value = null;
      } else {
        const errorText = await response.text();
        console.error("删除用户失败:", response.status, errorText);
      }
    } catch (error) {
      console.error("请求删除用户时出错:", error);
    }
  }
}

/**
 * 取消删除用户操作
 * 关闭弹窗并清空当前用户数据
 */
function cancelDeleteUser() {
  showDeleteUserModal.value = false;
  currentUser.value = null;
}

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载后执行
 * 页面加载时自动获取注册用户列表
 */
onMounted(() => {
  fetchRegisterUsers();
});
</script>

<style scoped>
.registration-review-container {
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}
.page-header h1{
  font-size: 30px;
}
.content-area {
  margin: 0 auto;
}

.filter-section {
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.filter-buttons {
  display: flex;
  gap: 20px;
}

.filter-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #f8f9fa;
  border-color: #3370ff;
  color: #3370ff;
}

.filter-btn.active {
  background: #3370ff;
  border-color: #3370ff;
  color: white;
}

.user-table {
  width: 100%;
}

.user-table thead th {
  background: #f8f9fa;
  padding: 10px 20px;
  text-align: left;
  font-weight: 700;
}

.user-table tbody td {
  padding: 10px 20px;
}

.user-table tbody tr:hover {
  background: #f8f9fa;
}

.user-name {
  font-weight: 500;
  font-size: 15px;
}

.password {
  font-size: 15px;
}

.user-email {
  font-size: 15px;
}

.register-time {
  font-size: 15px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.approve-btn {
  background: #28a745;
  color: white;
}

.approve-btn:hover {
  background: #218838;
}

.reject-btn {
  background: #dc3545;
  color: white;
}

.reject-btn:hover {
  background: #c82333;
}

.detail-btn {
  background: #6c757d;
  color: white;
}

.detail-btn:hover {
  background: #5a6268;
}

.delete-user-btn {
  background: #dc3545;
  color: white;
}

.delete-user-btn:hover {
  background: #c82333;
}

.user-detail-content p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

</style>
