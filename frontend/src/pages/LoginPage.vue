<template>
  <div class="login-page">
    <!-- 背景 -->
    <Bg></Bg>
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">用户登录/注册</h2>
        <div class="notice">
          <p>注册之后联系管理员开通权限</p>
          <p>开通之后可以正常登录</p>
        </div>
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="姓名-专业-年级"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="密码"
              required
              class="form-input"
            />
          </div>
          <div class="button-group">
            <button
              type="button"
              @click="handleRegister"
              class="btn btn-register"
            >
              注册
            </button>
            <button type="submit" class="btn btn-login">登录</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Bg from "../components/Bg.vue";
import { customAlert } from "../utils/alert";
import { SERVER_URL } from "../tools/ip.js";

const router = useRouter();

// 响应式数据
const formData = ref({
  username: "",
  password: "",
});

// 注册函数
const handleRegister = async () => {
  try {
    // 验证表单数据
    if (!formData.value.username || !formData.value.password) {
      customAlert("请填写完整的用户名和密码", "表单验证");
      return;
    }

    // 发送注册请求
    const response = await fetch(`${SERVER_URL}admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // 注册成功
      customAlert(data.message || "注册成功！请联系管理员开通权限。", "注册成功");
      // 清空表单
      formData.value.username = "";
      formData.value.password = "";
    } else {
      // 注册失败
      customAlert(data.message || "注册失败，请重试。", "注册失败");
    }
  } catch (error) {
    console.error("注册请求失败:", error);
    customAlert("网络错误，请检查网络连接后重试。", "网络错误");
  }
};

// 登录函数
const handleSubmit = async () => {
  try {
    // 验证表单数据
    if (!formData.value.username || !formData.value.password) {
      customAlert("请填写完整的用户名和密码", "表单验证");
      return;
    }

    // 发送登录请求
    const response = await fetch(`${SERVER_URL}admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // 登录成功
      if (data.message === "用户登录成功") {
        // 保存token到localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("username", data.user.username);
          console.log(localStorage);
        }
        customAlert("登录成功！", "登录成功");
        // 清空表单
        formData.value.username = "";
        formData.value.password = "";
        // 跳转到首页
        router.push("/");
      } else {
        // 其他成功情况
        customAlert(data.message || "登录成功！", "登录成功");
      }
    } else {
      // 登录失败
      if (data.message === "请确定是否注册或者联系管理员开通权限") {
        customAlert("请确定是否注册或者联系管理员开通权限", "权限提示");
      } else {
        customAlert(data.message || "登录失败，请重试。", "登录失败");
      }
    }
  } catch (error) {
    console.error("登录请求失败:", error);
    customAlert("网络错误，请检查网络连接后重试。", "网络错误");
  }
};
</script>

<style scoped>

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px;
}

.login-card {
  width: 600px;
  background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2));
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 40px;
}

.login-title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 30px;
  font-weight: 700;
}

.notice {
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 24px;
}
.notice p{
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 700;
  color: #fff;
  font-size: 15px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #d9d9d9;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.form-input::placeholder {
  color: #bfbfbf;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 5px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register {
  background: linear-gradient(135deg, #10b981, #22c55e);
  color: white;
}

.btn-register:hover {
  background: linear-gradient(135deg, #059669, #16a34a);
}

.btn-login {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.btn-login:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}
</style>
