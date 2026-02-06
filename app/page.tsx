import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Search, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              给流浪宠物一个温暖的家
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              连接救助组织和领养者，让每只宠物都能找到属于自己的幸福
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/pets">
                  <Search className="mr-2 h-5 w-5" />
                  浏览宠物
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            我们的服务
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">轻松搜索</h3>
              <p className="text-muted-foreground">
                通过种类、年龄、地区等多种方式筛选，快速找到适合你的宠物伴侣
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">在线申请</h3>
              <p className="text-muted-foreground">
                简单快捷的线上申请流程，实时跟踪申请状态
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">收藏管理</h3>
              <p className="text-muted-foreground">
                收藏你喜欢的宠物，方便随时查看和对比
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            开始你的领养之旅
          </h2>
          <p className="text-lg mb-8 opacity-90">
            每一次领养，都是一个新生命的开始
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/pets">立即浏览</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
