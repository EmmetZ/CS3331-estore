import { invoke } from "@tauri-apps/api/core";
import { getErrorMessage } from "@/lib/utils";
import type {
  ApiResponse,
  LoginPayload,
  PartialUser,
  RegisterPayload,
  UpdateUserPayload,
  User,
} from "@/types";

const AUTH_ERROR_KEYWORDS = ["login", "token", "unauthorized", "401", "403"];

export async function login(payload: LoginPayload) {
  try {
    const resp = await invoke<ApiResponse<null>>("login", { ...payload });
    if (!resp.success) {
      throw new Error(resp.message || "登录失败");
    }
    return resp;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function logout() {
  try {
    const resp = await invoke<ApiResponse<null>>("logout");
    if (!resp.success) {
      throw new Error(resp.message || "退出登录失败");
    }
    return resp;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const resp = await invoke<ApiResponse<User>>("get_me");
    if (!resp.data) {
      return null;
    }
    return resp.data;
  } catch (error) {
    const message = getErrorMessage(error);
    if (isUnauthorizedMessage(message)) {
      return null;
    }
    throw new Error(message);
  }
}

export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  try {
    const resp = await invoke<ApiResponse<User | null>>("update_user", {
      payload,
    });
    if (!resp.data) {
      throw new Error(resp.message || "更新失败");
    }
    return resp.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAllUsers(): Promise<PartialUser[]> {
  try {
    const resp = await invoke<ApiResponse<PartialUser[]>>("get_all_users");
    if (!resp.success || !resp.data) {
      throw new Error(resp.message || "获取用户列表失败");
    }
    return resp.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const resp = await invoke<ApiResponse<null>>("register", { ...payload });
    if (!resp.success) {
      throw new Error(resp.message || "注册失败");
    }
    return resp;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

function isUnauthorizedMessage(message: string) {
  const normalized = message.toLowerCase();
  return AUTH_ERROR_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
