<template>
  <div class="qb-category-page">
    <div class="two-col">
      <section class="col">
        <h2>添加题库分类</h2>
        <form class="category-form" @submit.prevent="openAddFirstCategoryModal">
          <div class="form-group">
            <input
              v-model="firstCategory"  
              type="text"
              placeholder="请输入一级分类名称"
              required
            />
          </div>
          <button type="submit">添加一级分类</button>
        </form>
        
        <form class="category-form" @submit.prevent="openAddSecondCategoryModal">
          <div class="form-group">
            <select v-model="selectedFirstCategory" required>
              <option value="">请选择一级分类</option>
              <option v-for="cat in firstCategories" :key="cat._id || cat.id" :value="cat.firstCategory">
                {{ cat.firstCategory }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <input
              v-model="secondCategory"  
              type="text"
              placeholder="请输入二级分类名称"
              required
            />
          </div>
          <button type="submit">添加二级分类</button>
        </form>
      </section>

      <section class="col">
        <h2>已有分类</h2>
        <div class="table-wrapper">
          <table class="category-table">
            <thead>
              <tr>
                <th>一级分类</th>
                <th>二级分类</th>
                <th>题目数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row._key">
                <td>{{ row.firstCategory }}</td>
                <td>{{ row.secondCategory }}</td>
                <td>{{ row.count }}</td>
                <td>
                  <button type="button" class="op-btn" @click="openDeleteModal(row)">删除</button>
                </td>
              </tr>
              <tr v-if="rows.length === 0">
                <td colspan="4" class="empty">暂无分类</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
  <ConfirmModal
    :visible="modalVisible"
    :title="modalTitle"
    :content="modalContent"
    :showCancel="modalShowCancel"
    :showConfirm="modalShowConfirm"
    cancelText="取消"
    confirmText="确定"
    @cancel="onModalCancel"
    @confirm="onModalConfirm"
    @update:visible="(v) => modalVisible = v"
  />
</template>

<script setup>
/**
 * 题库分类管理页面 - QuestionBankCategory.vue
 * 
 * 功能说明：
 * - 提供题库分类的增删查功能
 * - 支持一级分类和二级分类的管理
 * - 显示每个分类下的题目数量统计
 * - 使用弹窗确认机制进行重要操作
 * 
 * 主要功能：
 * 1. 添加一级分类：通过表单输入分类名称
 * 2. 添加二级分类：选择一级分类后输入二级分类名称
 * 3. 删除分类：删除选中的二级分类
 * 4. 分类列表：展示所有分类及其题目数量
 * 5. 题目统计：实时统计每个分类下的题目数量
 * 
 * 数据流程：
 * - 页面加载时获取分类列表和题目列表
 * - 根据题目列表统计各分类的题目数量
 * - 将分类数据扁平化为表格行数据
 * - 通过弹窗确认机制处理增删操作
 */

// 导入必要的依赖
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { SERVER_IP } from "../tools/ip.js";
import ConfirmModal from "../components/ConfirmModal.vue";

// ==================== 响应式数据定义 ====================

/**
 * 分类数据
 * 存储从服务器获取的完整分类结构（包含一级分类和二级分类）
 */
const categories = ref([]);

/**
 * 题目数量统计
 * 存储每个分类的题目数量，格式：{ "一级分类__二级分类": 数量 }
 */
const questionCounts = ref({});

/**
 * 添加分类表单数据
 * 用于存储用户在表单中输入的数据
 */
const firstCategory = ref(""); // 一级分类名称
const secondCategory = ref(""); // 二级分类名称
const selectedFirstCategory = ref(""); // 选中的一级分类名称

/**
 * 弹窗控制状态
 * 管理确认弹窗的显示状态和内容
 */
const modalVisible = ref(false); // 弹窗是否显示
const modalTitle = ref(""); // 弹窗标题
const modalContent = ref(""); // 弹窗内容
const modalShowCancel = ref(true); // 是否显示取消按钮
const modalShowConfirm = ref(true); // 是否显示确认按钮
const modalAction = ref(""); // 弹窗操作类型："addFirst" | "addSecond" | "delete"

// ==================== 计算属性 ====================

/**
 * 提取一级分类列表
 * 从分类数据中提取所有一级分类，用于二级分类添加时的下拉选择
 */
const firstCategories = computed(() => {
  return Array.isArray(categories.value) ? categories.value : [];
});

/**
 * 将分类数据扁平化为表格行数据
 * 将嵌套的分类结构转换为表格所需的扁平结构
 * 同时为每个分类添加题目数量统计
 */
const rows = computed(() => {
  const list = Array.isArray(categories.value) ? categories.value : [];
  const res = [];
  
  for (const item of list) {
    const first = item?.firstCategory || "";
    const firstId = item?._id || item?.id || "";
    const children = Array.isArray(item?.children) ? item.children : [];
    
    // 如果一级分类下没有二级分类，创建一行只显示一级分类
    if (children.length === 0) {
      const key = `${first}__`;
      const cnt = questionCounts.value[key] || 0;
      res.push({ 
        _key: `${firstId}__`, 
        firstCategory: first, 
        firstCategoryId: firstId, 
        secondCategory: "", 
        secondCategoryId: "", 
        count: cnt 
      });
    } else {
      // 为每个二级分类创建一行
      for (const child of children) {
        const second = child?.secondCategory || "";
        const secondId = child?._id || child?.id || "";
        const key = `${first}__${second}`;
        const cnt = questionCounts.value[key] || 0;
        res.push({ 
          _key: `${firstId}__${secondId}`, 
          firstCategory: first, 
          firstCategoryId: firstId, 
          secondCategory: second, 
          secondCategoryId: secondId, 
          count: cnt 
        });
      }
    }
  }
  return res;
});

// ==================== 数据获取函数 ====================

/**
 * 获取分类列表
 * 从服务器获取所有分类数据（包含一级分类和二级分类的嵌套结构）
 */
async function fetchCategories() {
  try {
    const res = await axios.get(`${SERVER_IP}questionBank/getCateGory`);
    categories.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
  } catch (e) {
    // 请求失败时设置为空数组，避免渲染错误
    categories.value = [];
  }
}

/**
 * 获取题目列表并统计各分类的题目数量
 * 通过分析所有题目的分类信息，统计每个分类下的题目数量
 */
async function fetchQuestionCounts() {
  try {
    const res = await axios.get(`${SERVER_IP}questionBank/getQuestion`);
    const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
    const map = {};
    
    // 遍历所有题目，按分类统计数量
    for (const q of list) {
      const first = q?.firstCategory || "";
      const second = q?.secondCategory || "";
      const key = `${first}__${second}`;
      map[key] = (map[key] || 0) + 1;
    }
    questionCounts.value = map;
  } catch (e) {
    // 请求失败时设置为空对象
    questionCounts.value = {};
  }
}

// ==================== 弹窗控制函数 ====================

/**
 * 打开添加一级分类确认弹窗
 * 验证输入后显示确认弹窗，用户确认后执行添加操作
 */
function openAddFirstCategoryModal() {
  const category = firstCategory.value.trim();
  if (!category) return;
  
  modalTitle.value = "添加一级分类";
  modalContent.value = `你确定添加一级分类${category}吗？`;
  modalAction.value = "addFirst";
  modalVisible.value = true;
}

/**
 * 打开添加二级分类确认弹窗
 * 验证输入后显示确认弹窗，用户确认后执行添加操作
 */
function openAddSecondCategoryModal() {
  const category = secondCategory.value.trim();
  const firstCategoryId = selectedFirstCategory.value;
  
  if (!category || !firstCategoryId) return;
  
  modalTitle.value = "添加二级分类";
  modalContent.value = `你确定添加二级分类${category}吗？`;
  modalAction.value = "addSecond";
  modalVisible.value = true;
}

// ==================== 删除相关数据 ====================

/**
 * 待删除的分类数据
 * 存储即将被删除的分类信息，用于确认操作
 */
const pending = ref({ firstCategory: "", secondCategory: "", firstCategoryId: "", secondCategoryId: "" });

/**
 * 打开删除分类确认弹窗
 * 设置待删除的分类信息并显示确认弹窗
 */
function openDeleteModal(row) {
  const first = row?.firstCategory || "";
  const second = row?.secondCategory || "";
  const firstId = row?.firstCategoryId || "";
  const secondId = row?.secondCategoryId || "";
  pending.value = { firstCategory: first, secondCategory: second, firstCategoryId: firstId, secondCategoryId: secondId };
  modalTitle.value = "删除分类";
  modalContent.value = `你确定要删除 ${first} 下的 ${second} 分类吗？`;
  modalAction.value = "delete";
  modalVisible.value = true;
}

// ==================== 弹窗事件处理 ====================

/**
 * 处理弹窗取消事件
 * 关闭弹窗并重置表单数据
 */
function onModalCancel() {
  modalVisible.value = false;
  resetFormData();
}

/**
 * 处理弹窗确认事件
 * 根据操作类型执行相应的处理函数
 */
async function onModalConfirm() {
  if (modalAction.value === "addFirst") {
    await handleAddFirstCategory();
  } else if (modalAction.value === "addSecond") {
    await handleAddSecondCategory();
  } else if (modalAction.value === "delete") {
    await handleDeleteCategory();
  }
}

// ==================== 业务处理函数 ====================

/**
 * 处理添加一级分类
 * 调用服务器接口添加一级分类，成功后刷新数据
 */
async function handleAddFirstCategory() {
  const category = firstCategory.value.trim();
  try {
    const res = await axios.post(`${SERVER_IP}questionBank/addFirstCategory`, {
      firstCategory: category
    });
    const msg = (res && res.data && (res.data.message || res.data.msg)) || "添加成功";
    alert(msg);
    resetFormData();
    await fetchCategories();
    await fetchQuestionCounts();
  } catch (e) {
    const errMsg = (e && e.response && e.response.data && (e.response.data.message || e.response.data.msg)) || e.message || "添加失败";
    alert(errMsg);
  } finally {
    modalVisible.value = false;
  }
}

/**
 * 处理添加二级分类
 * 调用服务器接口添加二级分类，成功后刷新数据
 */
async function handleAddSecondCategory() {
  const category = secondCategory.value.trim();
  const firstCategoryId = selectedFirstCategory.value;
  try {
    const res = await axios.post(`${SERVER_IP}questionBank/addSecondCategory`, {
      firstCategory: firstCategoryId,
      secondCategory: category
    });
    const msg = (res && res.data && (res.data.message || res.data.msg)) || "添加成功";
    alert(msg);
    resetFormData();
    await fetchCategories();
    await fetchQuestionCounts();
  } catch (e) {
    const errMsg = (e && e.response && e.response.data && (e.response.data.message || e.response.data.msg)) || e.message || "添加失败";
    alert(errMsg);
  } finally {
    modalVisible.value = false;
  }
}

/**
 * 处理删除分类
 * 调用服务器接口删除二级分类，成功后刷新数据
 */
async function handleDeleteCategory() {
  const { firstCategoryId, secondCategoryId } = pending.value || {};
  try {
    const res = await axios.delete(`${SERVER_IP}questionBank/deleteSecondCategory`, {
      data: { firstCategoryId: firstCategoryId, secondCategoryId: secondCategoryId }
    });
    const msg = (res && res.data && (res.data.message || res.data.msg)) || "删除成功";
    alert(msg);
    await fetchCategories();
    await fetchQuestionCounts();
  } catch (e) {
    const errMsg = (e && e.response && e.response.data && (e.response.data.message || e.response.data.msg)) || e.message || "删除失败";
    alert(errMsg);
  } finally {
    modalVisible.value = false;
    pending.value = { firstCategory: "", secondCategory: "", firstCategoryId: "", secondCategoryId: "" };
  }
}

/**
 * 重置表单数据
 * 清空所有表单输入，用于操作完成后或取消操作时
 */
function resetFormData() {
  firstCategory.value = "";
  secondCategory.value = "";
  selectedFirstCategory.value = "";
}

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载后执行
 * 初始化页面数据，获取分类列表和题目统计
 */
onMounted(() => {
  fetchCategories();
  fetchQuestionCounts();
});
</script>

<style scoped>
.qb-category-page {
  width: 100%;
}

.two-col {
  display: flex;
}

.two-col .col {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.two-col .col:nth-child(1){
  width: 400px;
  flex-shrink: 0;
  padding-right: 20px;
}
.two-col .col:nth-child(2){
  padding-left: 20px;
  flex-grow: 1;
}

h2 {
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input[type="text"], select {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
}

button[type="submit"] {
  padding: 10px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
}

.table-wrapper {
  width: 100%;
}

.category-table {
  width: 100%;
}
.category-table th,
.category-table td {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 15px;
}
.category-table th {
  background: #f5f7fa;
}
.category-table th:nth-child(3),
.category-table td:nth-child(3) {
  width: 120px;
  text-align: center;
}
.category-table th:nth-child(4),
.category-table td:nth-child(4) {
  width: 140px;
  text-align: center;
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
.empty {
  text-align: center;
  color: #909399;
}
</style>


