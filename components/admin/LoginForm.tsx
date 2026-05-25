"use client";

import { useActionState } from "react";
import { loginAction, type AdminActionState } from "@/app/admin/actions";

const initialState: AdminActionState = {
  ok: false,
  message: ""
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="admin-form auth-form" action={formAction}>
      <label>
        이메일
        <input name="email" type="email" autoComplete="email" required placeholder="admin@example.com" />
      </label>
      <label>
        비밀번호
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.message ? <p className="form-message">{state.message}</p> : null}
      <button className="button button-primary" type="submit" disabled={pending}>
        {pending ? "로그인 중" : "관리자 로그인"}
      </button>
    </form>
  );
}
