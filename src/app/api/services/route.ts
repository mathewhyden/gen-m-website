import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ServiceItem } from "@/lib/types";

export async function GET() {
  try {
    const services = await db.getServices();
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body.services)) {
      const updated = await db.updateServices(body.services);
      return NextResponse.json({ success: true, services: updated });
    }

    if (body.action === "delete" && body.id) {
      const current = await db.getServices();
      const filtered = current.filter((s: ServiceItem) => s.id !== body.id);
      const updated = await db.updateServices(filtered);
      return NextResponse.json({ success: true, services: updated });
    }

    if (body.action === "add" && body.service) {
      const current = await db.getServices();
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        title: body.service.title || "UNTITLED SERVICE",
        description: body.service.description || "",
        coverImage: body.service.coverImage || body.service.image || "/services/web-development.jpg",
        image: body.service.coverImage || body.service.image || "/services/web-development.jpg",
      };
      const updated = await db.updateServices([...current, newService]);
      return NextResponse.json({ success: true, services: updated });
    }

    if (body.action === "update" && body.service && body.service.id) {
      const current = await db.getServices();
      const updatedList = current.map((s: ServiceItem) => 
        s.id === body.service.id ? { ...s, ...body.service } : s
      );
      const updated = await db.updateServices(updatedList);
      return NextResponse.json({ success: true, services: updated });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update services" }, { status: 500 });
  }
}
