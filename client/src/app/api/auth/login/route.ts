import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      body
    );
    const data = response.data;

    if (response.status !== 200) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: response.status }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json(
      { message: "Login successful", data: data?.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error.message);
    return NextResponse.json(
      { message: error?.response?.data?.message || "Internal server error" },
      { status: error?.response?.status || 500 }
    );
  }
}
