import { FamilyList } from "@/components/family-list"
import { DistributionPanel } from "@/components/distribution-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FamiliesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="families" className="space-y-6">
        <TabsList>
          <TabsTrigger value="families">Famílias</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
        </TabsList>

        <TabsContent value="families">
          <FamilyList />
        </TabsContent>

        <TabsContent value="distribution">
          <DistributionPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
