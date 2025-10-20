import { Card, CardContent } from "../Landing/ui/card";
import { Bookmark, Video, FolderOpen } from "lucide-react";

const features = [
  {
    icon: Bookmark,
    title: "URL : 원클릭 북마크",
    description: "한번에 모든 URL을 저장하고 켤 수 있습니다",
    image: "/landing-url.png",
  },
  {
    icon: Video,
    title: "화면, 음성, 얼굴공유, 채팅, 회의록",
    subtitle: "회의의 시작부터 끝까지",
    description: "한 공간에서 소통하고, 기록까지 남기세요",
    image: "/landing-screen.png",
  },
  {
    icon: FolderOpen,
    title: "파일 : 통합 파일 드라이브",
    description: "팀 파일, 이제 흩어지지 않아요.",
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
