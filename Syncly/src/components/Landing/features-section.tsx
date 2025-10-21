import { Card, CardContent } from "../Landing/ui/card";
import { Bookmark, Video, FolderOpen } from "lucide-react";

const features = [
  {
    icon: Bookmark,
    title: "URL : 원클릭 북마크",
    subtitle: "작업중인 링크를 모두 저장하고 한번에 열어보세요",
    description:
      "여러 개의 URL을 한번에 저장하고, 분류하여 체계적으로 관리합니다.",
    image: "/landing-url.png",
  },
  {
    icon: Video,
    title: "화면, 음성, 얼굴공유, 채팅, 회의록",
    subtitle: "작업중인 파일도 함께 저장하고 관리해보세요",
    description:
      "회의나 리뷰 중 바로 화면과 파일을 공유하여 즉각적인 협업이 가능합니다.",
    image: "/landing-screen.png",
  },
  {
    icon: FolderOpen,
    title: "파일 : 통합 파일 드라이브",
    subtitle: "한 공간에서 모든 파일을 관리하세요",
    description:
      "손쉽게 파일을 업로드하고, 폴더별로 깔끔하게 정리할 수 있습니다. ",
    image: "/landing-file.png",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden border-border/50 hover:border-accent/50 transition-colors"
            >
              <div className="aspect-video bg-secondary relative overflow-hidden">
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                {feature.subtitle && (
                  <p className="text-sm font-medium text-foreground mb-2">
                    {feature.subtitle}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
