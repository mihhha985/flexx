import { Button } from "@/src/shared/ui/button";
import { db } from "@/src/prisma/db";
export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await db.orm.public.Category.all()
  console.log(categories);
  return (
    <main className="shell">
      <div className="flex flex-col items-center gap-5 w-2xl mx-auto mt-40">
        <h1 className="text-4xl">Hello world!</h1>
        <Button className="w-fit">Click me</Button>
      </div>

    </main>
  );
}
