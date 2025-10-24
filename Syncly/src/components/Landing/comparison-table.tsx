import { Check, Circle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Landing/ui/table";

const comparisons = [
  {
    feature: "실시간 채팅",
    slack: true,
    around: true,
    syncly: true,
  },
  {
    feature: "화상회의",
    slack: true,
    around: true,
    syncly: true,
  },
  {
    feature: "URL 관리",
    slack: false,
    around: false,
    syncly: true,
  },
  {
    feature: "협업 중심",
    slack: "채팅 중심",
    around: "화면 공유 중심",
    syncly: "기록 + 정리 중심 협업",
  },
];

function CellContent({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="h-5 w-5 text-accent mx-auto" />;
  }
  if (value === false) {
    return (
      <span className="text-muted-foreground mx-auto block text-center">-</span>
    );
  }
  if (value === "partial") {
    return <Circle className="h-5 w-5 text-muted-foreground mx-auto" />;
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section id="comparison" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              기존 협업툴과는 다릅니다.
            </h2>
            <p className="text-lg text-muted-foreground">
              Syncly만의 차별화된 강점을 확인하세요.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] font-bold">항목</TableHead>
                  <TableHead className="text-center font-bold">
                    SLACK/TEAMS
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    AROUND
                  </TableHead>
                  <TableHead className="text-center font-bold bg-accent/5">
                    SYNCLY
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisons.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      <CellContent value={row.slack} />
                    </TableCell>
                    <TableCell className="text-center">
                      <CellContent value={row.around} />
                    </TableCell>
                    <TableCell className="text-center bg-accent/5">
                      <CellContent value={row.syncly} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
