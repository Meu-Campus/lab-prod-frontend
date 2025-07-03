import { SchoolIconComponent } from "@/components/school-icon-component";

export function HeaderComponent() {
  return (
    <header id="header" className="border-b border-neutral-200 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <SchoolIconComponent size={45}/>
            <span className="text-xl text-black">Meu Campus</span>
          </div>
        </div>
      </div>
    </header>
  )
}