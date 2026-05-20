import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "CAPTCHA_FAILED"
  | "CONFLICT"
  | "FEATURE_DISABLED"
  | "INTERNAL_ERROR";

function getUUID(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).substring(2) + "-" + Math.random().toString(36).substring(2);
  }
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      ok: true,
      data,
      error: null,
      meta: {
        request_id: getUUID(),
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  details: Record<string, any> = {},
  status: number = 400
) {
  return NextResponse.json(
    {
      ok: false,
      data: null,
      error: {
        code,
        message,
        details,
      },
      meta: {
        request_id: getUUID(),
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}
