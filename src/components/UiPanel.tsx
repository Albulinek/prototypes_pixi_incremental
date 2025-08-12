import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BuildTab } from "./BuildTab";
import { HelpTab } from "./HelpTab";

export function UiPanel() {
  return (
    <Tabs defaultValue="build" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="story">Story</TabsTrigger>
        <TabsTrigger value="build">Build</TabsTrigger>
        <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
        <TabsTrigger value="help">Help</TabsTrigger>
      </TabsList>
      <TabsContent value="story">
        <p className="text-sm text-muted-foreground pt-4">
          Your story begins here. Uncover the secrets of this place.
        </p>
      </TabsContent>
      <TabsContent value="build">
        <BuildTab />
      </TabsContent>
      <TabsContent value="upgrades">
        <p className="text-sm text-muted-foreground pt-4">
          Enhance your buildings and abilities.
        </p>
      </TabsContent>
      <TabsContent value="help">
        <HelpTab />
      </TabsContent>
    </Tabs>
  )
}
