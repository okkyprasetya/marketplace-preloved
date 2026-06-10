import { NextResponse } from "next/server";

export type ApiSuccess<TData> = {
  success: true;
  message: string;
  data: TData;
};

export type ApiError = {
  success: false;
  message: string;
  errors: string[];
};

export function apiSuccess<TData>(
  message: string,
  data: TData,
  status = 200,
) {
  return NextResponse.json<ApiSuccess<TData>>(
    { success: true, message, data },
    { status },
  );
}

export function apiError(message: string, errors: string[] = [], status = 400) {
  return NextResponse.json<ApiError>(
    { success: false, message, errors },
    { status },
  );
}
