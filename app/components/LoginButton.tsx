"use client";

import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/login"
      className="btn-hype !px-12 group text-base flex items-center justify-center gap-3"
      id="login-button"
    >
      <span className="text-xl">⚡</span>
      ENTER THE AURA
    </Link>
  );
}
