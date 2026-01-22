import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("try block");
    console.log(data);
    return NextResponse.json(
      { message: "success", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.log("catch block");
    console.log(error);

    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
