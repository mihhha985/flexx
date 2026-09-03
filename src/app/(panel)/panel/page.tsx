import { PackageOpenIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"

export default function PanelPage() {
  return (
    <Empty className="max-w-3xl min-h-[60vh] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
        <EmptyTitle>Панель пока пуста</EmptyTitle>
        <EmptyDescription>
          Здесь появится информация для управления магазином.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
