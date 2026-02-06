import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PetNotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">宠物不存在</h1>
        <p className="text-muted-foreground">
          抱歉，您查找的宠物信息不存在或已被删除
        </p>
        <Button asChild>
          <Link href="/pets">浏览其他宠物</Link>
        </Button>
      </div>
    </div>
  );
}
